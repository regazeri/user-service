import { ApiProperty } from '@nestjs/swagger';

export class ProfileUpdateEmailResponseDto {
  /**
   * @property email - first step user validation - send to email Service
   */
  @ApiProperty({
    required: true,
    name: 'email',
    example: 'user@domain.com',
    description: 'The new email address',
  })
  email: string;

  @ApiProperty({
    required: false,
    description: 'The response message',
  })
  message?: string;
}
