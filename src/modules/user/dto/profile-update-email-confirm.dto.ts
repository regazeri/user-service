import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ProfileUpdateEmailConfirmDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'The confirm code',
  })
  @IsString()
  readonly code: string;
}
