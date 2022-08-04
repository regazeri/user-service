import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLowercase, IsOptional, IsString } from 'class-validator';

export class ForgotPasswordDto {
  /**
   * @property {email:string}
   */
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'user@domain.com',
    description: "The user's email address",
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  @IsLowercase()
  readonly email?: string;
}
