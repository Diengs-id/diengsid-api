import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Paging } from '../../common/responses/api-response';
import { HomestaySearchRequest } from './dto/homestay-request.dto';
import { HomestayResponseDto } from './dto/homestay-response.dto';
import { HomestayServiceInteface } from './homestay-service.inteface';

@Injectable()
export class HomestayService implements HomestayServiceInteface {
  @Inject()
  private readonly prismaService: PrismaService;
  async search(homestaySearchRequest: HomestaySearchRequest): Promise<{
    homestayResponseDto: HomestayResponseDto[];
    paging: Paging;
  }> {
    const filters = [];

    if (homestaySearchRequest.name) {
      filters.push({
        homestay_name: {
          contains: homestaySearchRequest.name,
        },
      });
    }

    if (homestaySearchRequest.destination) {
      filters.push({
        description: {
          contains: homestaySearchRequest.description,
        },
      });
    }

    if (homestaySearchRequest.amenity) {
      filters.push({
        amenities: {
          some: {
            amenity: {
              contains: homestaySearchRequest.amenity,
            },
          },
        },
      });
    }

    if (homestaySearchRequest.destination) {
      filters.push({
        destinations: {
          some: {
            destination: {
              destination_name: {
                contains: homestaySearchRequest.destination,
              },
            },
          },
        },
      });
    }

    const skip = (homestaySearchRequest.page - 1) * homestaySearchRequest.size;

    const homestays = await this.prismaService.homestay.findMany({
      where: {
        AND: filters,
      },
      include: {
        location: true,
        reviews: true,
        image_homestays: true,
      },
      take: homestaySearchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.homestay.count({
      where: {
        AND: filters,
      },
    });

    return {
      homestayResponseDto: homestays.map((homestay) => {
        return this.toHomestayResponse(homestay);
      }),
      paging: {
        current_page: homestaySearchRequest.page,
        size: homestaySearchRequest.size,
        total_page: Math.ceil(total / homestaySearchRequest.size),
      },
    };
  }
  async get(id: string): Promise<HomestayResponseDto> {
    const homestay = await this.prismaService.homestay.findFirst({
      where: {
        id: id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
        destinations: true,
        amenities: true,
        image_homestays: true,
        location: true,
        rooms: true,
      },
    });

    console.log(homestay);

    if (!homestay) {
      throw new HttpException('Homestay tidak ditemukan', 404);
    }

    return this.toHomestayResponse(homestay);
  }

  toHomestayResponse(homestay): HomestayResponseDto {
    return {
      id: homestay.id,
      homestay_name: homestay.homestay_name,
      main_image: homestay.main_image,
      description: homestay.description,
      location: homestay.location,
      image_homestay: homestay.image_homestays.map((img) => img.image),
      total_rating: homestay.review.reduce((p, c) => p + c.rating, 0),
      destinations: homestay.destinations,
      reviews: homestay.reviews,
      rooms: homestay.rooms,
    };
  }
}
