import { Inject, Injectable } from '@nestjs/common';
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
            amenity: homestaySearchRequest.amenity,
          },
        },
      });
    }

    if (homestaySearchRequest.destination) {
      filters.push({
        destinations: {
          some: {
            destination: {
              destination_name: homestaySearchRequest.destination,
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
        review: true,
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
        return this.toHomestayResponse(
          homestay,
          homestay.review.reduce((p, c) => p + c.rating, 0),
        );
      }),
      paging: {
        current_page: homestaySearchRequest.page,
        size: homestaySearchRequest.size,
        total_page: Math.ceil(total / homestaySearchRequest.size),
      },
    };
  }

  toHomestayResponse(homestay, rating: number = 0): HomestayResponseDto {
    return {
      id: homestay.id,
      homestay_name: homestay.homestay_name,
      main_image: homestay.main_image,
      description: homestay.description,
      location: {
        latitude: homestay.location.latitude,
        longitude: homestay.location.longitude,
        address: homestay.location.longitude,
      },
      rating: rating,
    };
  }
}
