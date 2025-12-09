import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateAlertDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isResolved: boolean;
}