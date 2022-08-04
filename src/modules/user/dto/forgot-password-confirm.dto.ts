import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ForgotPasswordConfirmDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'The confirm code',
  })
  @IsString()
  readonly code: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Length(6, 30)
  @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
  readonly password: string;
}
