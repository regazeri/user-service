import { ApiProperty } from '@nestjs/swagger';

import { ForgotPasswordDto } from './forgot-password.dto';

export class ForgotPasswordResponseDto extends ForgotPasswordDto {
  @ApiProperty({
    required: false,
    description: 'The response message',
  })
  message?: string;
}
