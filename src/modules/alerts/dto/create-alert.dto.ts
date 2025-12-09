import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { Severity } from "src/generated/prisma/client";

export class CreateAlertDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    metricId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    zScoreValue: number;

    @ApiProperty({ enum: Severity })
    @IsEnum(Severity)
    @IsNotEmpty()
    severity: Severity;
}