import { AuthServiceInterface } from './auth-service.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, Inject, UnauthorizedException } from '@nestjs/common';
import { AutoGoogleDto } from './dto/auto-google.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export class AuthService implements AuthServiceInterface {
  @Inject()
  private prismaService: PrismaService;

  @Inject()
  private jwtService: JwtService;

  async loginGoogle(authGoogleDto: AutoGoogleDto): Promise<AuthResponseDto> {
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
    const countUser = await this.prismaService.user.count({
      where: {
        email: authRegisterDto.email,
      },
    });

    if (countUser !== 0) {
      throw new HttpException('User already registered', 400);
    }

    const passwordHash = await bcrypt.hash(authRegisterDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: authRegisterDto.email,
        password: passwordHash,
      },
    });

    const token = await this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      token: token,
    };
  }

  async registerGoogle(authGoogleDto: AutoGoogleDto): Promise<AuthResponseDto> {
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

  private async generateToken(user): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }
}
