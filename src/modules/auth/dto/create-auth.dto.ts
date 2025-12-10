
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";
import { Transform } from "class-transformer";


export class CreateAuthDto {
    @ApiProperty({
        example: "parceiro@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => String(value).toLowerCase())
    email: string;

    @ApiProperty({
        example: "123456"
    })
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password: string;
}