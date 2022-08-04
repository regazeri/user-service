import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class UserUpdatedEvent {
  /**
   * @property {string} The user ID
   */
  @IsUUID()
  @IsString()
  id: string;

  /**
   * @property {string} email
   */
  @IsEmail()
  @IsString()
  email?: string;

  /**
   * @property {string} password
   * @description sha256
   */
  @IsString()
  @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
  password?: string;

  /**
   * @property {string} permission
   * @description User access level
   */
  @IsString()
  @IsOptional()
  permission?: string;
}
