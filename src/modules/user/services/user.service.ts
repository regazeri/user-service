import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CodeInvalidException,
  DataAlreadyExistsException,
  DataNotFoundException,
  EmailResponseFailedException,
  hashString,
  InternalServerException,
} from 'common-panel';

import { generateApiKey, generateStringConfirmCode } from '../../../helper';
import { TokenPairResponseDto } from '../../rabbit-mq/dto';
import { EventStatus } from '../../rabbit-mq/enums';
import { AuthEventService, EmailEventService } from '../../rabbit-mq/services';
import {
  ForgotPasswordConfirmDto,
  ForgotPasswordDto,
  ProfileUpdateDto,
  ProfileUpdateEmailConfirmDto,
  ProfileUpdateEmailDto,
  ProfileUpdatePasswordDto,
  RegisterByEmailConfirm,
  RegisterByEmailDto,
  UserResponseDto,
  UserUpdateDto,
} from '../dto';
import { User } from '../entities';
import { EmailConfirmTypeEnum } from '../enums';
import { UserRepository } from '../repositories';
import { UserRedisService } from '.';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _userRepository: UserRepository,
    private _userRedisService: UserRedisService,
    private _emailEventService: EmailEventService,
    private _authEventService: AuthEventService,
    private _configService: ConfigService,
  ) {}

  /**
   * Get the use's email and sends a validation code to it
   * @param input: register DTO
   */
  async registerByEmail(input: RegisterByEmailDto): Promise<void> {
    const isEmailExist = await this._userRepository.isEmailExist(input.email);
    if (isEmailExist) {
      throw new DataAlreadyExistsException('user');
    }

    await this._sendConfirmEmail(EmailConfirmTypeEnum.REGISTER, input.email);

    return;
  }

  /**
   * Check the email confirmation code and create a new user in the database
   * @param input email confirmation code and password
   * @returns the login token
   */
  async registerByEmailConfirm(
    input: RegisterByEmailConfirm,
  ): Promise<TokenPairResponseDto> {
    const email = await this._getEmailFromConfirmCode(
      EmailConfirmTypeEnum.REGISTER,
      input.code,
    );
    const hashedPassword = await hashString(input.password);

    const newUser = await this._userRepository.registerByEmail({
      email,
      password: hashedPassword,
      isStaff: false,
    });

    if (!newUser) {
      throw new InternalServerException();
    }
    const tokenPair = await this._authEventService.createUserEvent({
      id: newUser.id,
      email: newUser.email,
      password: hashedPassword,
      isStaff: false,
    });
    await this._deleteEmailConfirmCode(
      EmailConfirmTypeEnum.REGISTER,
      input.code,
    );
    if (tokenPair === EventStatus.FAIL) {
      await this._userRepository.hardDelete(newUser.id);
      throw new InternalServerException();
    }
    return tokenPair as TokenPairResponseDto;
  }

  /**
   * Updates the given user
   * @param input The user fields
   * @returns All fields of the newly updated user
   */
  async profileUpdate(
    input: ProfileUpdateDto,
    userId: string,
  ): Promise<UserResponseDto> {
    const newUser: Partial<User> = input;
    return this._userRepository.updateUser(newUser, { id: userId });
  }

  /**
   * Update the password of the user
   * @param id The user ID
   * @param input Input DTO
   */
  async updateProfilePassword(
    input: ProfileUpdatePasswordDto,
    userId: string,
  ): Promise<void> {
    const hashedPassword = await hashString(input.password);

    await this._authEventService.updateUserEvent({
      id: userId,
      password: hashedPassword,
    });

    await this._userRepository.updateUser(
      { password: hashedPassword },
      { id: userId },
    );

    return;
  }

  /**
   * Register an email edit request
   * and send email confirmation code the the user's email address
   * @param input The new email address
   * @returns email address and success message
   */
  async profileUpdateEmail(input: ProfileUpdateEmailDto): Promise<void> {
    await this._sendConfirmEmail(
      EmailConfirmTypeEnum.UPDATE_EMAIL,
      input.email,
    );

    return;
  }

  /**
   * Update user email if code was correct
   * @param input email confirmation code
   * @param userId
   * @returns The new user on success
   */
  async profileUpdateEmailConfirm(
    input: ProfileUpdateEmailConfirmDto,
    userId: string,
  ): Promise<void> {
    const email = await this._getEmailFromConfirmCode(
      EmailConfirmTypeEnum.UPDATE_EMAIL,
      input.code,
    );

    await this._authEventService.updateUserEvent({
      email,
      id: userId,
    });

    await this._userRepository.updateUser({ email }, { id: userId });

    await this._deleteEmailConfirmCode(
      EmailConfirmTypeEnum.UPDATE_EMAIL,
      input.code,
    );

    return;
  }

  /**
   * Update the user by admin
   * @param input The fields to update
   * @returns New user on success
   */
  async updateUser(input: UserUpdateDto, id: string): Promise<UserResponseDto> {
    if (input.isStaff) {
      await this._authEventService.updateUserEvent({
        id,
        isStaff: input.isStaff,
      });
    }

    return this._userRepository.updateUser(input, { id });
  }

  /**
   * Delete the user by admin
   * @param id Delete the user by admin
   */
  async deleteUser(id: string): Promise<void> {
    await this._authEventService.deleteUserEvent(id);
    await this._userRepository.deleteUser(id);
    return;
  }

  /**
   * Gets the email address and sends a validation code to the email
   * @param input The email address of the user
   */
  async forgotPassword(input: ForgotPasswordDto): Promise<void> {
    const isEmailExist = await this._userRepository.isEmailExist(input.email);
    if (!isEmailExist) {
      throw new DataNotFoundException('email');
    }

    await this._sendConfirmEmail(
      EmailConfirmTypeEnum.FORGOT_PASSWORD,
      input.email,
    );

    return;
  }

  async forgotPasswordConfirm(input: ForgotPasswordConfirmDto): Promise<void> {
    const email = await this._getEmailFromConfirmCode(
      EmailConfirmTypeEnum.FORGOT_PASSWORD,
      input.code,
    );

    const newHashedPassword = await hashString(input.password);

    const user = await this._userRepository.updateUser(
      { password: newHashedPassword },
      { email },
    );

    await this._authEventService.updateUserEvent({
      id: user.id,
      password: newHashedPassword,
    });

    await this._deleteEmailConfirmCode(
      EmailConfirmTypeEnum.FORGOT_PASSWORD,
      input.code,
    );

    return;
  }

  // /**
  //  * Checks the confirmation code for given email addressDto
  //  * and throws exception if failed
  //  * @param email The user email
  //  * @param code Verification code
  //  */
  // private async _checkEmailConfirmCodeAndThrow(
  //   email: string,
  //   code: string,
  // ): Promise<void> {
  //   const correctCode = await this._userRedisService.getAccountVerificationCode(
  //     email,
  //   );

  //   if (isEmpty(correctCode)) {
  //     throw new EmailNotFoundException();
  //   }
  //   if (correctCode !== code) {
  //     throw new CodeInvalidException();
  //   }
  // }

  /**
   * Generate a unique confirmation code
   * Stores the code in the Redis database
   * And sends code to the given email address
   * If sending failed removes the code from Redis and generates an exception
   * @param type Email confirmation type
   * @param email Email Address
   */
  private async _sendConfirmEmail(
    type: EmailConfirmTypeEnum,
    email: string,
  ): Promise<void> {
    const confirmCode = generateStringConfirmCode();

    const emailConfirmEndpoint = this._configService.get<string>(
      'EMAIL_CONFIRM_ENDPOINT',
    );
    const confirmLink = `${emailConfirmEndpoint}?type=${type}&code=${confirmCode}`;

    const redisKey = this._generateEmailRedisKey(type, confirmCode);
    await this._userRedisService.setAccountVerificationCode(redisKey, email);

    let isEmailSent: boolean;
    switch (type) {
      case 'REGISTER':
        isEmailSent = await this._emailEventService.sendRegisterEmailEvent({
          email,
          link: confirmLink,
        });
        break;
      case 'UPDATE_EMAIL':
        isEmailSent = await this._emailEventService.sendUpdateEmailEvent({
          email,
          link: confirmLink,
        });
        break;
      case 'FORGOT_PASSWORD':
        isEmailSent =
          await this._emailEventService.sendForgotPasswordEmailEvent({
            email,
            link: confirmLink,
          });
    }

    if (!isEmailSent) {
      await this._userRedisService.deleteAccountVerificationCode(redisKey);
      throw new EmailResponseFailedException();
    }
  }

  /**
   * Checks the confirmation code with Redis data
   * Throws error if the code failed
   * And returns the email address corresponding to the code
   * @param type Email confirmation type
   * @param confirmCode The received confirm code from user
   * @returns
   */

  private async _getEmailFromConfirmCode(
    type: EmailConfirmTypeEnum,
    confirmCode: string,
  ): Promise<string> {
    const key = this._generateEmailRedisKey(type, confirmCode);
    const email = await this._userRedisService.getAccountVerificationCode(key);

    if (!email) {
      throw new CodeInvalidException();
    }

    return email;
  }

  /**
   * Removes a confirmation code from Redis database
   * @param type Email confirmation type
   * @param code The code to be removed
   * @returns true on success
   */
  private async _deleteEmailConfirmCode(
    type: EmailConfirmTypeEnum,
    code: string,
  ): Promise<boolean> {
    const key = this._generateEmailRedisKey(type, code);
    return this._userRedisService.deleteAccountVerificationCode(key);
  }

  /**
   * Makes a redis key to use in email confirmation functions
   * @param type Email confirmation type
   * @param code The confirm code
   * @example "REGISTER@1234567890"
   * @returns The generated key for Redis usage
   */
  private _generateEmailRedisKey(
    type: EmailConfirmTypeEnum,
    code: string,
  ): string {
    return `${type}@${code}`;
  }

  async handleGenerateApiKey(userId: string): Promise<string> {
    const apiKey = generateApiKey();

    await this._userRepository.updateUser(
      { webServiceKey: apiKey },
      { id: userId },
    );

    await this._authEventService.updateUserEvent({
      apiKey,
      id: userId,
    });

    return apiKey;
  }
}
