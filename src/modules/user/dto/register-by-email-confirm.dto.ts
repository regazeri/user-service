import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class RegisterByEmailConfirm {
  /**
   * @property {string} code
   */
  @ApiProperty({
    required: true,
    type: 'string',
    name: 'code',
    example: '123456',
    description: 'The received registration code by email',
  })
  @IsString()
  readonly code: string;

  /**
   * @property {string} password
   */
  @ApiProperty({
    required: true,
    example: '123Qwe@!',
  })
  @IsString()
  @Length(6, 30)
  @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
  readonly password: string;
}
