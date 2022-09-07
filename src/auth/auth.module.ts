import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { TwoFactorAuthenticationService } from './two-factor/two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './two-factor/two-factor-authentication.controller';
import { JwtTwoFactorStrategy } from './strategies/jwt-two-factor.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  controllers: [AuthController, TwoFactorAuthenticationController],
  exports: [AuthService],
})
export class AuthModule {}
