import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordMessageDto {
  /**
   * @property email - first step user validation - send to email Service
   */
  @IsEmail()
  @IsString()
  email: string;
  /**
   * @property {link:string}
   * @description front end link to update password
   */
  @IsString()
  link: string;
}
