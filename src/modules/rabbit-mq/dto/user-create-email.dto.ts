import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserCreateEmailDto {
  /**
   * @property email - first step user validation - send to email Service
   */
  @IsEmail()
  @IsString()
  email: string;
  /**
   * @property {code:string}
   * @description Six digit code - send to email service for validation email
   */
  @IsString()
  @MinLength(6)
  link: string;
}
