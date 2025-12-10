import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => String(value).toLowerCase())
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(6, 6,)
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6,)
    password: string;
}