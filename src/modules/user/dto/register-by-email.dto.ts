import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLowercase } from 'class-validator';

export class RegisterByEmailDto {
  @ApiProperty({
    required: true,
    type: 'string',
    name: 'email',
    example: 'user@domain.com',
    description: 'first step user register - get user email ',
  })
  @IsEmail()
  @IsLowercase()
  readonly email: string;
}
