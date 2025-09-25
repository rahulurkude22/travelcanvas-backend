import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from 'nest-utils/decorators/public/public.decorator';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { RegisterBodyDto } from './dto/register-body.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() body: LoginBodyDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  signUp(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }

  @Get('signout/:id')
  signOut(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const accessToken = authHeader.replace('Bearer ', '');
    return this.authService.logout(id, accessToken);
  }
}
