import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLowercase, IsOptional, IsString } from 'class-validator';

export class ProfileUpdateEmailDto {
  /**
   * @property email - first step user validation - send to email Service
   */
  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  @IsLowercase()
  readonly email: string;
}
