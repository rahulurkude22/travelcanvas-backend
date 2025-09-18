import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginBodyDto) {
    return this.authService.login(body);
  }
}
