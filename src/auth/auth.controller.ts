import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { Public } from 'nest-utils/decorators/public/public.decorator';
import { RegisterBodyDto } from './dto/register-body.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginBodyDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }
}
