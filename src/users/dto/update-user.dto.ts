import {
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { UserType } from '../user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPhoneNumber()
  contactNo?: string;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}
