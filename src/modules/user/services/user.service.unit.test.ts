/* eslint-disable @typescript-eslint/unbound-method */
import Mock = jest.Mock;

jest.mock('../../../helper', () => ({
  //   generateConfirmCode: jest.fn(),
  generateStringConfirmCode: jest.fn(),
}));

jest.mock('common-panel', () => ({
  hashString: jest.fn(),
}));

import { Test } from '@nestjs/testing';
import * as commonHelpers from 'common-panel';

import * as moduleHelpers from '../../../helper';
import { AuthEventService, EmailEventService } from '../../rabbit-mq/services';
import {
  ForgotPasswordConfirmDto,
  ProfileUpdateDto,
  ProfileUpdateEmailConfirmDto,
  ProfileUpdateEmailDto,
  ProfileUpdatePasswordDto,
  RegisterByEmailConfirm,
  RegisterByEmailDto,
  UserResponseDto,
  UserUpdateDto,
} from '../dto';
import { UserRepository } from '../repositories';
import { UserRedisService } from '.';
import { UserService } from './user.service';
import Mocked = jest.Mocked;
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line no-duplicate-imports
import {
  CodeInvalidException,
  DataAlreadyExistsException,
  DataNotFoundException,
  EmailResponseFailedException,
  InternalServerException,
} from 'common-panel';

import { EventStatus } from '../../rabbit-mq/enums';
import { User } from '../entities';
import { EmailConfirmTypeEnum } from '../enums';

// const generateConfirmCode = moduleHelpers.generateConfirmCode as Mock;
const generateStringConfirmCode =
  moduleHelpers.generateStringConfirmCode as Mock;
const hashString = commonHelpers.hashString as Mock;

const mockUserRepository = (): Partial<Mocked<UserRepository>> => ({
  isEmailExist: jest.fn(),
  registerByEmail: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
});

const mockUserRedisService = (): Partial<Mocked<UserRedisService>> => ({
  setAccountVerificationCode: jest.fn(),
  getAccountVerificationCode: jest.fn(),
  deleteAccountVerificationCode: jest.fn(),
});

const mockEmailService = (): Partial<Mocked<EmailEventService>> => ({
  sendRegisterEmailEvent: jest.fn(),
  sendForgotPasswordEmailEvent: jest.fn(),
  sendUpdateEmailEvent: jest.fn(),
});

const mockAuthEventService = (): Partial<Mocked<AuthEventService>> => ({
  //   requestUserTokenEvent: jest.fn(),
  updateUserEvent: jest.fn(),
  deleteUserEvent: jest.fn(),
  createUserEvent: jest.fn(),
});

const mockConfigService = (): Partial<Mocked<ConfigService>> => ({
  get: jest.fn(),
});

describe('user-service', () => {
  let userService: Mocked<UserService>;
  let userRedisService: Mocked<UserRedisService>;
  let authEventService: Mocked<AuthEventService>;
  let emailEventService: Mocked<EmailEventService>;
  let userRepository: Mocked<UserRepository>;
  let configService: Mocked<ConfigService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRedisService, useFactory: mockUserRedisService },
        { provide: AuthEventService, useFactory: mockAuthEventService },
        { provide: EmailEventService, useFactory: mockEmailService },
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    userService = module.get(UserService);
    userRedisService = module.get(UserRedisService);
    authEventService = module.get(AuthEventService);
    emailEventService = module.get(EmailEventService);
    userRepository = module.get(UserRepository);
    configService = module.get(ConfigService);
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('registerByEmail', () => {
    const input: RegisterByEmailDto = {
      email: 'info@domain.com',
    };
    const confirmCode = 'confirmCode1234';
    generateStringConfirmCode.mockReturnValue(confirmCode);

    const type = EmailConfirmTypeEnum.REGISTER;
    const redisKey = 'redisKey1234';
    const email = input.email;
    const emailConfirmEndpoint = 'https://www.test.online/config';
    const confirmLink = `${emailConfirmEndpoint}?type=${type}&code=${confirmCode}`;

    it('should set user in redis and send verification email', async () => {
      configService.get.mockReturnValue(emailConfirmEndpoint);
      userRepository.isEmailExist.mockResolvedValue(false);

      const generateEmailRedisKey = jest.fn();
      (userService as any)._generateEmailRedisKey = generateEmailRedisKey;
      generateEmailRedisKey.mockReturnValue(redisKey);

      emailEventService.sendRegisterEmailEvent.mockResolvedValue(true);
      await expect(userService.registerByEmail(input)).resolves.toBeUndefined();

      expect(emailEventService.sendRegisterEmailEvent).toBeCalledWith({
        email,
        link: confirmLink,
      });

      expect(userRedisService.setAccountVerificationCode).toBeCalledWith(
        redisKey,
        email,
      );
    });

    it('should throw error sendConfirmEmail', async () => {
      userRepository.isEmailExist.mockResolvedValue(false);

      //   generateStringConfirmCode.mockReturnValue(confirmCode);
      configService.get.mockReturnValue(emailConfirmEndpoint);

      //   const generateEmailRedisKey = jest.fn();
      //   (userService as any)._generateEmailRedisKey = generateEmailRedisKey;
      //   generateEmailRedisKey.mockReturnValue(redisKey);
      //   emailEventService.sendRegisterEmailEvent.mockResolvedValue(false);

      await expect(userService.registerByEmail(input)).rejects.toThrow(
        EmailResponseFailedException,
      );

      expect(emailEventService.sendRegisterEmailEvent).toBeCalledWith({
        email,
        link: confirmLink,
      });

      //   expect(userRedisService.setAccountVerificationCode).toBeCalledWith(
      //     redisKey,
      //     email,
      //   );
    });

    it('should throw error when sending register email fails', async () => {
      userRepository.isEmailExist.mockResolvedValue(true);

      await expect(userService.registerByEmail(input)).rejects.toThrow(
        DataAlreadyExistsException,
      );
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('registerByEmailConfirm', () => {
    const input: RegisterByEmailConfirm = {
      code: '1',
      password: '1234',
    };
    const tokenPair = {
      accessToken: '111',
      refreshToken: '222',
      expiresAt: new Date(),
    };
    const email = 'test@test.co';
    const hashPassword = '1234bala';

    const newUser = {
      email,
      id: '1',
      password: '1234',
      isStaff: false,
    };

    // const key = 'redisKey123';

    it('should passed check email confirm code & register new user & request for token Pair', async () => {
      userRedisService.getAccountVerificationCode.mockResolvedValue(email);

      hashString.mockReturnValue(hashPassword);

      userRepository.registerByEmail.mockResolvedValue(newUser);

      authEventService.createUserEvent.mockResolvedValue(tokenPair);

      await expect(userService.registerByEmailConfirm(input)).resolves.toEqual(
        tokenPair,
      );

      expect(userRepository.registerByEmail).toBeCalledWith({
        email,
        password: hashPassword,
        isStaff: false,
      });

      expect(authEventService.createUserEvent).toBeCalledWith({
        id: newUser.id,
        email: newUser.email,
        password: hashPassword,
        isStaff: false,
      });
    });
    // 'should throw error when confirm email code fails'

    it('should throw error when tokenPair is fail', async () => {
      //   const getEmailFromConfirmCode = jest.fn();
      //   (userService as any)._getEmailFromConfirmCode = getEmailFromConfirmCode;
      //   getEmailFromConfirmCode.mockResolvedValue(email);

      userRedisService.getAccountVerificationCode.mockResolvedValue(email);
      hashString.mockReturnValue(hashPassword);

      userRepository.registerByEmail.mockResolvedValue(newUser);

      const tokenPairFAILS = EventStatus.FAIL;
      authEventService.createUserEvent.mockResolvedValue(tokenPairFAILS);

      await expect(userService.registerByEmailConfirm(input)).rejects.toThrow(
        InternalServerException,
      );

      expect(userRepository.registerByEmail).toBeCalledWith({
        email,
        password: hashPassword,
        isStaff: false,
      });

      expect(authEventService.createUserEvent).toBeCalledWith({
        id: newUser.id,
        email: newUser.email,
        password: hashPassword,
        isStaff: false,
      });
    });

    it('should throw error when email confirm code is fail', async () => {
      //   const getEmailFromConfirmCode = jest.fn();
      //   (userService as any)._getEmailFromConfirmCode = getEmailFromConfirmCode;
      //   getEmailFromConfirmCode.mockResolvedValue(email);

      userRedisService.getAccountVerificationCode.mockResolvedValue(null);
      hashString.mockReturnValue(hashPassword);

      userRepository.registerByEmail.mockResolvedValue(newUser);

      authEventService.createUserEvent.mockResolvedValue(tokenPair);

      await expect(userService.registerByEmailConfirm(input)).rejects.toThrow(
        CodeInvalidException,
      );
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('profileUpdate', () => {
    const user: User = { id: '1', email: '' };
    const profileUpdateDto: ProfileUpdateDto = {};
    const userId = '1';

    it('should user profile will be updated', async () => {
      userRepository.updateUser.mockResolvedValue(user);
      await expect(
        userService.updateUser(profileUpdateDto, userId),
      ).resolves.toEqual(user);
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('updateProfilePassword', () => {
    it('should user profile password will be update', async () => {
      const input: ProfileUpdatePasswordDto = { password: '123456' };
      const userId = '1';
      const hashPassword = 'hashpassword2315';
      hashString.mockResolvedValue(hashPassword);

      await expect(
        userService.updateProfilePassword(input, userId),
      ).resolves.toBeUndefined();

      expect(authEventService.updateUserEvent).toBeCalledWith({
        id: userId,
        password: hashPassword,
      });
      expect(userRepository.updateUser).toBeCalledWith(
        { password: hashPassword },
        { id: userId },
      );
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('profileUpdateEmail', () => {
    const input: ProfileUpdateEmailDto = { id: '1', email: 'info@domin.com' };
    const type = EmailConfirmTypeEnum.UPDATE_EMAIL;
    const confirmCode = 'confirmCode1234';
    // const redisKey = 'redisKey1234';
    const email = input.email;
    const emailConfirmEndpoint = 'https://www.test.online/config';
    const confirmLink = `${emailConfirmEndpoint}?type=${type}&code=${confirmCode}`;

    it('should user profile email will be update', async () => {
      //   generateStringConfirmCode.mockReturnValue(confirmCode);

      configService.get.mockReturnValue(emailConfirmEndpoint);
      emailEventService.sendUpdateEmailEvent.mockResolvedValue(true);

      await expect(
        userService.profileUpdateEmail(input),
      ).resolves.toBeUndefined();

      expect(emailEventService.sendUpdateEmailEvent).toBeCalledWith({
        email,
        link: confirmLink,
      });
    });

    it('should throw error profile update send confirm code', async () => {
      configService.get.mockReturnValue(emailConfirmEndpoint);
      emailEventService.sendUpdateEmailEvent.mockResolvedValue(false);

      await expect(userService.profileUpdateEmail(input)).rejects.toThrow(
        EmailResponseFailedException,
      );

      expect(emailEventService.sendUpdateEmailEvent).toBeCalledWith({
        email,
        link: confirmLink,
      });
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('profileUpdateEmailConfirm', () => {
    const userId = '1';
    const input: ProfileUpdateEmailConfirmDto = {
      code: '1',
      //   email: 'info@domin.com',//comm+++
    };
    const email = 'test@test.co';

    it('should user profile email confirm will be update', async () => {
      //   const getEmailFromConfirmCode = jest.fn();
      //   (userService as any)._getEmailFromConfirmCode = getEmailFromConfirmCode;
      //   getEmailFromConfirmCode.mockResolvedValue(email);
      userRedisService.getAccountVerificationCode.mockResolvedValue(email);

      await expect(
        userService.profileUpdateEmailConfirm(input, userId),
      ).resolves.toBeUndefined();

      expect(authEventService.updateUserEvent).toBeCalledWith({
        email,
        id: userId,
      });

      expect(userRepository.updateUser).toBeCalledWith(
        { email },
        { id: userId },
      );
    });

    it('should throw error CodeInvalidException', async () => {
      userRedisService.getAccountVerificationCode.mockResolvedValue(null);

      await expect(
        userService.profileUpdateEmailConfirm(input, userId),
      ).rejects.toThrow(CodeInvalidException);
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('updateUser', () => {
    it('should isStaff is true', async () => {
      const input: UserUpdateDto = { isStaff: true };
      const id = '1';
      const userRepositoryDto: UserResponseDto = {
        email: 'info@domin.com',
        isStaff: true,
      };
      //   expect(input.isStaff).toEqual(true);
      //   authEventService.updateUserEvent.mockResolvedValue(1)
      userRepository.updateUser.mockResolvedValue(userRepositoryDto);

      await expect(userService.updateUser(input, id)).resolves.toEqual(
        userRepositoryDto,
      );

      //   expect(authEventService.updateUserEvent).toBeCalledWith({
      //     id,
      //     isStaff: input.isStaff,
      //   });

      //   expect(userRepository.updateUser).toBeCalledWith(input, { id });
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const id = '1';
      authEventService.deleteUserEvent.mockResolvedValue(null); // comm+++
      userRepository.deleteUser.mockResolvedValue();

      await expect(userService.deleteUser(id)).resolves.toBeUndefined();
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('forgotPassword', () => {
    const input = { email: 'john@example.com' };
    const type = EmailConfirmTypeEnum.FORGOT_PASSWORD;
    const confirmCode = 'confirmCode1234';
    // const redisKey = 'redisKey1234';
    const email = input.email;
    const emailConfirmEndpoint = 'https://www.test.online/config';
    const confirmLink = `${emailConfirmEndpoint}?type=${type}&code=${confirmCode}`;

    it('should create and send email forgot link to event handler', async () => {
      userRepository.isEmailExist.mockResolvedValue(true);

      configService.get.mockReturnValue(emailConfirmEndpoint);
      emailEventService.sendForgotPasswordEmailEvent.mockResolvedValue(true);

      await expect(userService.forgotPassword(input)).resolves.toBeUndefined();

      expect(emailEventService.sendForgotPasswordEmailEvent).toBeCalledWith({
        email,
        link: confirmLink,
      });
    });

    it('should throw error forgetPassword sendConfirm Email', async () => {
      userRepository.isEmailExist.mockResolvedValue(true);

      configService.get.mockReturnValue(emailConfirmEndpoint);
      emailEventService.sendForgotPasswordEmailEvent.mockResolvedValue(false);

      await expect(userService.forgotPassword(input)).rejects.toThrow(
        EmailResponseFailedException,
      );

      expect(emailEventService.sendForgotPasswordEmailEvent).toBeCalledWith({
        email,
        link: confirmLink,
      });
    });

    it('should throw error if emails does not exists', async () => {
      userRepository.isEmailExist.mockResolvedValue(false);

      await expect(userService.forgotPassword({} as any)).rejects.toThrow(
        DataNotFoundException,
      );
    });
  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  describe('forgotPasswordConfirm', () => {
    it('should update user password when input is valid', async () => {
      const input: ForgotPasswordConfirmDto = {
        code: '123456',
        password: '142536',
      };
      const email = 'john@example.com';
      const hashedPassword = 'hashed142536';
      const user: User = { id: '1', email: 'john@example.com' };

      userRedisService.getAccountVerificationCode.mockResolvedValue(email);

      hashString.mockResolvedValue(hashedPassword);

      const deleteConfirm = jest.fn();
      (userService as any)._deleteEmailConfirmCode = deleteConfirm;
      deleteConfirm.mockResolvedValue(true);

      userRepository.updateUser.mockResolvedValue(user);

      await expect(
        userService.forgotPasswordConfirm(input),
      ).resolves.toBeUndefined();

      expect(userRepository.updateUser).toBeCalledWith(
        { password: hashedPassword },
        { email },
      );

      expect(authEventService.updateUserEvent).toBeCalledWith({
        id: user.id,
        password: hashedPassword,
      });
      expect(deleteConfirm).toBeCalledWith(
        EmailConfirmTypeEnum.FORGOT_PASSWORD,
        input.code,
      );
    });

    it('should throw error when code is not valid', async () => {
      const input: ForgotPasswordConfirmDto = {
        code: '123456',
        password: '142536',
      };
      await expect(userService.forgotPasswordConfirm(input)).rejects.toThrow(
        CodeInvalidException,
      );
    });
  });
});
