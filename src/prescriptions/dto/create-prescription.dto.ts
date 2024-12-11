import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  ArrayMaxSize,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionDrugDto {
  @IsString()
  drug: string; // Drug ID

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreatePrescriptionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDrugDto)
  @ArrayMaxSize(10)
  drugs: PrescriptionDrugDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
