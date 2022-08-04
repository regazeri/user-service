import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ProfileUpdatePasswordDto {
  /**
   * @property {string} password
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @Length(6, 30)
  @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
  readonly password: string;
}
