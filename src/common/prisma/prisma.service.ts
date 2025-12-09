import "dotenv/config";
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
        super({ adapter });
    }
    async onModuleInit() {
        try {
            await this.$queryRaw`SELECT 1`;
            Logger.log('PrismaService connected to the database successfully.');
        } catch (error) {
            Logger.error('PrismaService failed to connect to the database.', error);
            throw new Error(`PrismaService connection error: ${error.message}`);
        }
    }
}