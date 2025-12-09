import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

export type PrismaErrorCode = 
  | 'P2002' // Unique constraint violation
  | 'P2025' // Record not found
  | 'P2003' // Foreign key constraint violation
  | 'P2014' // Required relation missing
  | 'P2016' // Query interpretation error
  | 'P2018' // Record required but not found
  | 'P2034'; // Transaction failed

export type PrismaErrorMessages = {
  [K in PrismaErrorCode]?: string | null; 
} & {
  validation?: string | null;
};

export class PrismaErrorHandler {
  static handle(error: any, customMessages: PrismaErrorMessages = {}): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const customMessage = customMessages[error.code as PrismaErrorCode];
      
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(customMessage === null ? undefined : (customMessage || 'Record already exists'));
        case 'P2025':
          throw new NotFoundException(customMessage === null ? undefined : (customMessage || 'Record not found'));
        case 'P2003':
          console.log('Foreign key constraint violation:', error.meta);
          throw new ConflictException(customMessage === null ? undefined : (customMessage || 'Operation not allowed'));
        case 'P2014':
          throw new BadRequestException(customMessage === null ? undefined : (customMessage || 'Required data missing'));
        case 'P2016':
          throw new BadRequestException(customMessage === null ? undefined : (customMessage || 'Invalid query'));
        case 'P2018':
          throw new NotFoundException(customMessage === null ? undefined : (customMessage || 'Required record not found'));
        case 'P2034':
          throw new InternalServerErrorException(customMessage === null ? undefined : (customMessage || 'Transaction failed'));
        case 'P2010':
        case 'P2011':
          throw new ConflictException(customMessage === null ? undefined : (customMessage || 'Resource is currently locked. Please try again later.'));
        default:
          throw new InternalServerErrorException('Internal server error');
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const validationMessage = customMessages.validation;
      throw new BadRequestException(validationMessage === null ? undefined : (validationMessage || 'Invalid data'));
    }

    throw error;
  }
}
