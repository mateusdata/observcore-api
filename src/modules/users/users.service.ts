import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaErrorHandler } from 'src/common/exceptions/prisma-error-handler';
import { EmailsService } from '../emails/emails.service';
import { createAccountTemplate } from 'src/common/templates/create-account';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private emailsService: EmailsService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hash;

      const user = await this.prismaService.user.create({
        data: createUserDto,
      });

      // Envia email de boas-vindas
      this.emailsService.create({
        to: user.email,
        subject: "Bem-vindo ao ObservCore!",
        text: `Olá ${user.name || 'Usuário'}! Sua conta foi criada com sucesso.`,
        body: createAccountTemplate(user.name || 'Usuário'),
      }).catch(err => console.error('Erro ao enviar email:', err));

      const { password, ...result } = user;
      return result;
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: {
            config: true
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      const { password, ...result } = user;
      return result;
    } catch (error) {
        PrismaErrorHandler.handle(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
      
      const { password, ...result } = user;
      return result;
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }
}