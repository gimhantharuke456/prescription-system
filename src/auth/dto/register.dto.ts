import { IsEmail, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { UserType } from '../../users/user.schema';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  contactNo: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsEnum(UserType)
  userType: UserType;
}
