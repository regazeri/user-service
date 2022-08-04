import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty()
  status?: 'success';

  @ApiProperty({
    description:
      'if true, the user is logged out. The login page should be displayed',
    example: true,
  })
  logout?: boolean;
}
