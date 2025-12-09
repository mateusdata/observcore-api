import "dotenv/config";
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL
    });

    super({
      adapter,
      omit: { user: { password: true } },
    });

    const extendedClient = (this as PrismaClient).$extends({
      name: 'softDelete',
      query: {
        $allModels: {
          async findMany({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            
            return query(args);
          },
          async findFirst({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          async findUnique({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          async findUniqueOrThrow({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          async findFirstOrThrow({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          async count({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          async aggregate({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          async groupBy({ args, query }: any) {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
         
        },
      },
    });

    return extendedClient as any;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}