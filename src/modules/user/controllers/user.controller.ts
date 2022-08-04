import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiCustomException,
  AuthUser,
  CodeInvalidException,
  DataAlreadyExistsException,
  DataNotFoundException,
  EmailResponseFailedException,
  Env,
  IAuthUser,
  InternalServerException,
  ValidationPipe,
} from 'common-panel';
import { Response } from 'express';

import { AccessTokenResponseDto } from '../../rabbit-mq/dto';
import {
  ForgotPasswordConfirmDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ProfileUpdateDto,
  ProfileUpdateEmailConfirmDto,
  ProfileUpdateEmailDto,
  ProfileUpdateEmailResponseDto,
  ProfileUpdatePasswordDto,
  RegisterByEmailConfirm,
  RegisterByEmailDto,
  RegisterByEmailResponseDto,
  SuccessResponseDto,
  UserResponseDto,
  UserUpdateDto,
} from '../dto';
import { ApiKeyResponseDto } from '../dto/api-key-response.dto';
import { UserService } from '../services';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  /**
   * Registers a new user by email and password
   * @param registerInfo user email address and password
   * @returns success if confirmation email sent
   */
  @Post('register')
  @ApiTags('User Register')
  @ApiOperation({
    summary: 'Register a new user using his/her email address',
  })
  @ApiOkResponse({ type: RegisterByEmailResponseDto })
  @ApiCustomException(() => [
    DataAlreadyExistsException,
    EmailResponseFailedException,
    InternalServerException,
  ])
  @UsePipes(new ValidationPipe())
  async registerByEmail(
    @Body() registerInfo: RegisterByEmailDto,
  ): Promise<RegisterByEmailResponseDto> {
    await this._userService.registerByEmail(registerInfo);
    return {
      email: registerInfo.email,
      message: 'Confirmation email sent successfully',
    };
  }

  /**
   * Confirms the user's code and email and creates a new user for him
   * @param confirmEmail Confirmation code & email from the user's email inbox
   * @returns login token
   */
  @Post('register/confirm')
  @ApiTags('User Register')
  @ApiOperation({
    summary: 'Verity the email address by code',
  })
  @ApiOkResponse({
    type: AccessTokenResponseDto,
  })
  @ApiCustomException(() => [InternalServerException, CodeInvalidException])
  @UsePipes(new ValidationPipe())
  async registerByEmailConfirm(
    @Body() confirmEmail: RegisterByEmailConfirm,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResponseDto> {
    const tokenPair = await this._userService.registerByEmailConfirm(
      confirmEmail,
    );

    const refreshTokenValidationDays = Env.getNumber(
      'REFRESH_TOKEN_VALIDATION_DAYS',
    );

    response.cookie('refreshToken', tokenPair.refreshToken, {
      httpOnly: true,
      path: '/refresh',
      sameSite: true,
      expires: new Date(
        new Date().getTime() + refreshTokenValidationDays * 24 * 60 * 60 * 1000,
      ),
    });

    return {
      accessToken: tokenPair.accessToken,
      expiresAt: tokenPair.expiresAt,
    };
  }

  /**
   * Updates some fields of the user profile and returns all user fields
   * @param userInfo The user field values to be updated
   * @returns All user fields of the user
   */
  @Patch('profile')
  @ApiTags('User Profile')
  @ApiOperation({ summary: 'Update the user profile' })
  @ApiHeader({ name: 'user-id', required: false })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @UsePipes(new ValidationPipe())
  profileUpdate(
    @Body() userInfo: ProfileUpdateDto,
    @AuthUser() user: IAuthUser,
  ): Promise<UserResponseDto> {
    return this._userService.profileUpdate(userInfo, user.id);
  }

  /**
   * Sends a confirmation code to the user's email address
   * @param newEmail The new email address to be updated
   * @returns Success if email sent successfully
   */
  @Patch('profile/email')
  @ApiTags('User Profile')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary:
      "Sends a confirmation code to the user's email to edit his email address",
  })
  @ApiHeader({ name: 'user-id', required: false })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ProfileUpdateEmailResponseDto })
  @ApiCustomException(() => EmailResponseFailedException)
  async profileUpdateEmail(
    @Body() newEmail: ProfileUpdateEmailDto,
  ): Promise<ProfileUpdateEmailResponseDto> {
    await this._userService.profileUpdateEmail(newEmail);
    return {
      email: newEmail.email,
      message: 'The confirmation email sent',
    };
  }

  /**
   * Gets the confirmation code and updates email.
   * Then logs the user out
   * @param emailConfirm Confirmation code & email from the user's email inbox
   * @returns Success if confirmation email sent successfully
   */
  @Post('profile/email/confirm')
  @ApiTags('User Profile')
  @ApiOperation({
    summary: "Gets the confirmation email code and updates the user's email",
  })
  @ApiHeader({ name: 'user-id', required: false })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiCustomException(() => CodeInvalidException)
  @UsePipes(new ValidationPipe())
  async profileUpdateEmailConfirm(
    @Body() emailConfirm: ProfileUpdateEmailConfirmDto,
    @AuthUser() user: IAuthUser,
  ): Promise<SuccessResponseDto> {
    await this._userService.profileUpdateEmailConfirm(emailConfirm, user.id);
    return {
      status: 'success',
      logout: true,
    };
  }

  /**
   * Update the password of the user
   * @param newPassword The new password
   * @param userId The ID of the user
   * @returns Success status
   */
  @Patch('profile/password')
  @ApiTags('User Profile')
  @ApiOperation({
    summary: 'Update password of the current logged in user',
  })
  @ApiHeader({ name: 'user-id', required: false })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: SuccessResponseDto })
  @UsePipes(new ValidationPipe())
  async profileUpdatePassword(
    @Body() newPassword: ProfileUpdatePasswordDto,
    @AuthUser() user: IAuthUser,
  ): Promise<SuccessResponseDto> {
    await this._userService.updateProfilePassword(newPassword, user.id);
    return {
      status: 'success',
      logout: true,
    };
  }

  /**
   * Update a given user by system admin
   * @param userInfo New user fields to update
   * @returns The updated user
   */
  @Patch(':id')
  @ApiTags('User Administration')
  @ApiOperation({ summary: 'Updates a user' })
  @UsePipes(new ValidationPipe())
  userUpdate(
    @Param('id') id: string,
    @Body() userInfo: UserUpdateDto,
  ): Promise<UserResponseDto> {
    return this._userService.updateUser(userInfo, id);
  }

  /**
   * Delete a user by system admin
   * @param userInfo The user ID to deleteUser
   * @returns Success status
   */
  @Delete(':id')
  @ApiTags('User Administration')
  @ApiOperation({ summary: 'Deletes a user' })
  @ApiCustomException(() => [
    DataNotFoundException,
    EmailResponseFailedException,
  ])
  @UsePipes(new ValidationPipe())
  async userDelete(@Param('id') id: string): Promise<SuccessResponseDto> {
    await this._userService.deleteUser(id);
    return {
      status: 'success',
    };
  }

  @Post('forgot/password')
  @ApiTags('Forgot Password')
  @ApiOperation({ summary: 'Starts the password recovery process' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiCustomException(() => EmailResponseFailedException)
  @UsePipes(new ValidationPipe())
  async forgotPassword(
    @Body() request: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    await this._userService.forgotPassword(request);
    return {
      email: request.email,
      message: 'Confirmation email sent successfully',
    };
  }

  @Post('forgot/password/confirm')
  @ApiTags('Forgot Password')
  @ApiOperation({
    summary: 'Send email confirmation code and the new password',
  })
  @ApiCustomException(() => CodeInvalidException)
  @UsePipes(new ValidationPipe())
  async forgotPasswordConfirm(
    @Body() request: ForgotPasswordConfirmDto,
  ): Promise<SuccessResponseDto> {
    await this._userService.forgotPasswordConfirm(request);
    return { status: 'success' };
  }

  @Post('generate/apikey')
  @ApiTags('API')
  @ApiOperation({ summary: 'Generates a new APIKey and returns it' })
  @ApiBearerAuth('access-token')
  @ApiHeader({ name: 'user-id' })
  async generateApiKey(
    @AuthUser() authUser: IAuthUser,
  ): Promise<ApiKeyResponseDto> {
    const apiKey = await this._userService.handleGenerateApiKey(authUser.id);
    return { apiKey };
  }
}
