import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  SerializeOptions,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
