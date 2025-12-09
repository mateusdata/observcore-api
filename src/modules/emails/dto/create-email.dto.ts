import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateEmailDto {
    @ApiProperty()
    to: string;
    @ApiProperty()
    subject: string;

    @ApiProperty()
    body: string;

    @ApiProperty()
    text: string;
}
