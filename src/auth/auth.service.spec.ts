import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import mockedUser from './mocks/user.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;
  let userData: User;
  let findUser: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    userData = {
      ...mockedUser,
    };
    findUser = jest.fn().mockResolvedValue(userData);
    const usersRepository = {
      findOne: findUser,
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    authService = await module.get(AuthService);
    usersService = await module.get(UsersService);
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(typeof authService.getCookieWithJwtToken(userId)).toEqual(
        'string',
      );
    });
  });

  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');

      await authService.getAuthenticatedUser(
        'user@email.com',
        'strongPassword',
      );

      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(
          authService.getAuthenticatedUser('user@email.com', 'strongPassword'),
        ).rejects.toThrow();
      });
    });

    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });

        it('should return the user data', async () => {
          const user = await authService.getAuthenticatedUser(
            'user@email.com',
            'strongPassword',
          );

          expect(user).toBe(userData);
        });
      });

      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it('should throw an error', async () => {
          await expect(
            authService.getAuthenticatedUser(
              'user@email.com',
              'strongPassword',
            ),
          ).rejects.toThrow();
        });
      });
    });
  });
});
