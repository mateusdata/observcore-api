import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class ValidateCodeDto {
    @ApiProperty({
        example: "usuario@gmail.com",
        description: "Email do usuário"
    })
    @IsNotEmpty({ message: "Email é obrigatório" })
    @IsEmail({}, { message: "Email inválido" })
    @Transform(({ value }) => String(value).toLowerCase())
    email: string;

    @ApiProperty({
        example: "123456",
        description: "Código de verificação enviado por email"
    })
    @IsNotEmpty({ message: "Código é obrigatório" })
    @IsString({ message: "Código deve ser uma string" })
    @Length(6, 6, { message: "Código deve ter 6 dígitos" })
    code: string;
}
