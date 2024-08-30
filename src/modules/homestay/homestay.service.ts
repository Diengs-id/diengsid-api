import { Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export class HomestayService {
  @Inject()
  private readonly prismaService: PrismaService;
}
