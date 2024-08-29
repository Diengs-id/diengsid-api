import { AuthServiceInterface } from './auth-service.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { HttpException, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthRegisterGoogleDto } from './dto/auth-register-google.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthEmailVerifiedDto } from './dto/auth-email-verified.dto';
import * as otpGenerator from 'otp-generator';
import { AuthVerifyOtpDto } from './dto/auth-verify-otp.dto';
import * as moment from 'moment';
import { EmailService } from '../../common/email/email.service';

export class AuthService implements AuthServiceInterface {
  @Inject()
  private prismaService: PrismaService;

  @Inject()
  private jwtService: JwtService;

  @Inject()
  private emailService: EmailService;

  async loginGoogle(authGoogleDto: AuthRegisterGoogleDto): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: authGoogleDto.email,
        google_id: authGoogleDto.google_id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = await this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      token: token,
    };
  }
  async register(authRegisterDto: AuthRegisterDto): Promise<AuthResponseDto> {
    await this.emailVerified(authRegisterDto.email);

    const passwordHash = await bcrypt.hash(authRegisterDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: authRegisterDto.email,
        password: passwordHash,
        google_id: null,
        email_verified_at: null,
        customer: {
          create: {
            first_name: authRegisterDto.name,
            last_name: null,
            phone: null,
            address: null,
            picture: null,
          },
        },
      },
    });

    const token = await this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      token: token,
    };
  }
  async registerGoogle(authGoogleDto: AuthRegisterGoogleDto): Promise<AuthResponseDto> {
    const countUser = await this.prismaService.user.count({
      where: {
        OR: [
          {
            google_id: authGoogleDto.google_id,
          },
          {
            email: authGoogleDto.email,
          },
        ],
      },
    });

    if (countUser !== 0) {
      throw new HttpException('User already registered', 400);
    }

    const user = await this.prismaService.user.create({
      data: {
        email: authGoogleDto.email,
        google_id: authGoogleDto.google_id,
        password: null,
        email_verified_at: null,
        customer: {
          create: {
            first_name: authGoogleDto.name,
            last_name: null,
            phone: null,
            address: null,
            picture: authGoogleDto.picture,
          },
        },
      },
    });

    const token = await this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      token: token,
    };
  }
  async login(authLoginDto: AuthLoginDto): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authLoginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = await this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      token: token,
    };
  }
  async sendOtp(authEmailVerifiedDto: AuthEmailVerifiedDto): Promise<string> {
    // generate otp
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    // create opt expired at
    const now = moment();
    const otp_expired_at = now.add(5, 'minute').toDate();

    const verificationCode =
      await this.prismaService.verificationCode.findFirst({
        where: {
          email: authEmailVerifiedDto.email,
        },
      });

    // update or create verification code

    if (!verificationCode) {
      await this.prismaService.verificationCode.create({
        data: {
          email: authEmailVerifiedDto.email,
          otp: otp,
          expired_at: otp_expired_at,
          is_email_verified: false,
        },
      });
    } else {
      await this.prismaService.verificationCode.update({
        where: {
          email: authEmailVerifiedDto.email,
        },
        data: {
          otp: otp,
          expired_at: otp_expired_at,
          is_email_verified: false,
        },
      });
    }

    // send email
    await this.emailService.sendOtp(authEmailVerifiedDto.email, otp);

    return otp;
  }

  private async generateToken(user): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }
  async emailVerified(email): Promise<boolean> {
    const countUser = await this.prismaService.user.count({
      where: {
        email: email,
      },
    });

    if (countUser !== 0) {
      throw new HttpException('User already registered', 400);
    }

    return true;
  }

  async verifyOtp(authVerifyOtpDto: AuthVerifyOtpDto): Promise<boolean> {
    const verificationCode =
      await this.prismaService.verificationCode.findFirst({
        where: {
          AND: [
            {
              email: authVerifyOtpDto.email,
            },
            {
              otp: authVerifyOtpDto.otp,
            },
          ],
        },
      });

    const now = moment();

    if (!verificationCode) {
      throw new HttpException('Your OTP is not correct', 400);
    } else if (now.isAfter(verificationCode.expired_at)) {
      throw new HttpException('Your OTP has been expired', 400);
    }

    await this.prismaService.verificationCode.update({
      data: {
        expired_at: now.toDate(),
        is_email_verified: true,
      },
      where: {
        email: authVerifyOtpDto.email,
      },
    });

    return true;
  }
}
