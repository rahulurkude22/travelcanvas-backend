import { IsBooleanString, IsEmail, IsString, Length } from 'class-validator';

export class RegisterBodyDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Length(8)
  password: string;

  @IsBooleanString()
  emailVerified: string;
}
