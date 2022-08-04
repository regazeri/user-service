import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsLowercase,
  IsMobilePhone,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

import { UserRole } from '../entities';
import { CalendarTypeEnum, GenderEnum } from '../enums';
import { IAddress } from '../interfaces';

export class UserResponseDto {
  @IsUUID()
  id?: string;

  userRoles?: UserRole[];

  @IsOptional()
  @IsString()
  @IsLowercase()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(64, 64)
  password?: string;

  @IsEmail()
  @IsString()
  @IsLowercase()
  email: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  firstname?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  lastname?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  nickname?: string;

  @IsMobilePhone()
  @IsOptional()
  mobileNumber?: string;

  /**
   * If true, the user can login in admin panel
   */
  @IsOptional()
  @IsBoolean()
  isStaff?: boolean;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsOptional()
  @Length(10, 100)
  @Matches(/apikey-\d+-\d+-[a-z0-9]+/)
  webServiceKey?: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  avatar?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsString()
  @Length(1, 800)
  about?: string;

  @IsOptional()
  @IsEnum(CalendarTypeEnum)
  calendarType?: CalendarTypeEnum;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  language?: string;

  @IsOptional()
  @IsObject({})
  address?: IAddress;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @IsOptional()
  @IsDate()
  lastPasswordUpdate?: Date;

  /**
   * Description by admin
   */
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  expireTime?: Date;

  @IsDate()
  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsString()
  resetPassword?: string;

  @IsEmpty()
  @IsDate()
  resetPasswortExpired?: Date;
}
