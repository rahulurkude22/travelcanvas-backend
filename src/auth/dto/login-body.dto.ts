import { IsString } from 'class-validator';

export class LoginBodyDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
