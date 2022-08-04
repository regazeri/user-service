import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class UserCreatedAuthEventDto {
  /**
   * @property id -  UUID
   */
  @IsUUID()
  id: string;

  /**
   * @property email - string
   */
  @IsEmail()
  @IsString()
  email?: string;

  /**
   * @property isStaff - boolean
   * @description define to recognize admin roles
   */
  @IsBoolean()
  @IsOptional()
  isStaff?: boolean;
  /**
   * @property password - string
   * @description sha256
   */
  @IsString()
  @IsOptional()
  @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
  password?: string;

  /**
   * @property permission
   * @description User access level
   */
  @IsString()
  @IsOptional()
  permission?: string;

  /**
   * @property apiKey
   * @description Api Key
   */
  @IsString()
  @IsOptional()
  apiKey?: string;
}
