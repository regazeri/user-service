import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

import { ProfileUpdateDto } from './profile-update.dto';
export class UserUpdateDto extends ProfileUpdateDto {
  /**
   * @property {boolean} If true, the user can login in admin panel
   */
  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'If true, the user can login in admin panel',
  })
  @IsOptional()
  @IsBoolean()
  readonly isStaff?: boolean;

  /**
   * @property {boolean} isSuperAdmin
   */
  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  readonly isSuperAdmin?: boolean;

  /**
   * @property {string} webServiceKey
   */
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'apikey-0-0-abcd',
  })
  @IsOptional()
  @Length(10, 100)
  @Matches(/apikey-\d+-\d+-[a-z0-9]+/)
  readonly webServiceKey?: string;

  /**
   * @property {Date} expireTime
   */
  @ApiProperty({
    required: false,
    type: Date,
    description: 'The expiration date of the user',
  })
  @IsOptional()
  @IsDateString()
  readonly expireTime?: Date;
}
