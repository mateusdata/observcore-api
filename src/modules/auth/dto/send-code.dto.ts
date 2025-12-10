import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SendCodeDto {
    @ApiProperty({
        example: "usuario@gmail.com",
        description: "Email do usuário para receber o código de verificação"
    })
    @IsNotEmpty({ message: "Email é obrigatório" })
    @IsEmail({}, { message: "Email inválido" })
    email: string;
}
