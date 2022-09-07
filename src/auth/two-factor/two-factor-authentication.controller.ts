import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import RequestWithUser from '../interfaces/request-with-user.interface';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authentication-code.dto';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
      true,
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
