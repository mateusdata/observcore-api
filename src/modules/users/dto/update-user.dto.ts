import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transform } from "class-transformer";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// O PartialType já herda o setter/getter de email do CreateUserDto
