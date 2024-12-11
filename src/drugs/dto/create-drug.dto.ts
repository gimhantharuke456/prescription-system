import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEnum,
  Min,
} from 'class-validator';

export class CreateDrugDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(['mg', 'ml', 'g', 'tablet', 'capsule'])
  unit: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  expirationDate?: Date;
}
