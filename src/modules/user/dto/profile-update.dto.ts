import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsLowercase,
  IsMobilePhone,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CalendarTypeEnum, GenderEnum } from '../enums';
import { AddressDto } from './address.dto';
export class ProfileUpdateDto {
  /**
   * @property {string} username
   * @description  this must be unique
   */
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'username - this must be unique',
  })
  @IsOptional()
  @IsString()
  @IsLowercase()
  @Length(3, 50)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/) // No space around
  readonly username?: string;

  /**
   * @property {string} firstname
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/) // No space around
  readonly firstname?: string;

  /**
   * @property {string} lastname
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/) // No space around
  readonly lastname?: string;

  /**
   * @property {string} nickname
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/) // No space around
  readonly nickname?: string;

  /**
   * @property {string} mobileNumber
   */
  @ApiProperty({
    required: false,
    type: 'string',
    example: '09111111111',
  })
  @IsMobilePhone()
  @IsOptional()
  readonly mobileNumber?: string;

  /**
   * @property {Date} birthDate
   */
  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  readonly birthDate?: Date;

  /**
   * @property {string} avatar
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  readonly avatar?: string;

  /**
   * @property {string} about
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Length(1, 800)
  readonly about?: string;

  /**
   * @property {string} language
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  readonly language?: string;

  /**
   * @property  AddressDto} {address
   */
  @ApiProperty({
    required: false,
    type: AddressDto,
  })
  @IsOptional()
  @ValidateNested()
  readonly address?: AddressDto;

  /**
   * @property {string} website
   */
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'domain.com',
  })
  @IsOptional()
  @IsUrl()
  @Length(3, 50)
  readonly website?: string;

  /**
   * @property {string} description
   */
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @MaxLength(800)
  readonly description?: string;

  /**
   * @property {GenderEnum} gender
   */
  @ApiProperty({
    required: false,
    enum: GenderEnum,
  })
  @IsOptional()
  @IsEnum(GenderEnum)
  readonly gender?: GenderEnum;

  /**
   * @property {CalendarTypeEnum} calendar
   */
  @ApiProperty({
    required: false,
    enum: CalendarTypeEnum,
  })
  @IsOptional()
  @IsEnum(CalendarTypeEnum)
  readonly calendarType?: CalendarTypeEnum;
}
