import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
