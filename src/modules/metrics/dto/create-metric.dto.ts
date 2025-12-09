import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMetricDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    promQL: string;

    @ApiPropertyOptional({ default: 3.0 })
    @IsNumber()
    @IsOptional()
    zScoreThreshold?: number;

    @ApiPropertyOptional({ default: 60 })
    @IsNumber()
    @IsOptional()
    checkInterval?: number;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    serviceId: string;
}