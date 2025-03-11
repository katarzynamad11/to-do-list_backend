import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passHash = await argon2.hash(createUserDto.password);
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: passHash,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Użytkownik już istnieje');
      }
    }
  }

  async findOne(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
