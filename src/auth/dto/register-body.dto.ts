import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class RegisterBodyDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
