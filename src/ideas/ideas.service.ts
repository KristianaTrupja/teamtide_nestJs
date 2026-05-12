import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';

@Injectable()
export class IdeasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIdeaDto, userId: string) {
  return this.prisma.idea.create({
    data: {
      title: dto.title,
      shortDescription: dto.shortDescription,
      coverImageUrl: dto.coverImageUrl,
      status: 'NEW',
      createdById: userId,
      tags: {
        connect: dto.tagIds.map((id) => ({ id })),
      },
      board: {
        create: {},
      },
    },
    include: {
      createdBy: true,
      tags: true,
      board: true,
    },
  });
}

  async findOne(id: string) {
    return this.prisma.idea.findUnique({
      where: { id },

      include: {
        createdBy: true,
        tags: true,

        board: {
          include: {
            stickers: {
              include: {
                author: true,
                reactions: true,
              },
            },
          },
        },

        comments: {
          include: {
            author: true,
          },
        },

        summary: true,
      },
    });
  }

  async findAll(status?: string) {
  return this.prisma.idea.findMany({
    where: status
      ? {
          status: status as any,
        }
      : undefined,

    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },

      tags: true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}
}
