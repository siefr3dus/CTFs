import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { CreateUserDto, LoginDto, ResponseDto } from 'src/common/dto';
import { AuthService } from './auth.service';
import { AccessTokenResponse } from 'src/common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('/login')
  @Render('login')
  async renderLogin() {
    return;
  }

  @Post('/login')
  async login(@Body() data: LoginDto): Promise<AccessTokenResponse> {
    const user = await this.authService.login(data);
    return await this.authService.getAccessToken(user);
  }

  @Get('/register')
  @Render('register')
  async renderRegister() {
    return;
  }

  @Post('/register')
  async register(@Body() data: CreateUserDto): Promise<ResponseDto> {
    return await this.authService.register(data);
  }
}
