import { ApiProperty } from '@nestjs/swagger';

import { RegisterByEmailDto } from './register-by-email.dto';

export class RegisterByEmailResponseDto extends RegisterByEmailDto {
  @ApiProperty({
    required: false,
    description: 'The response message',
  })
  message?: string;
}
