import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsOptional, IsString } from 'class-validator';

export class AccessTokenResponseDto {
  /**
   * @param refreshToken: string
   * @description 'long time valid '
   */
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'long time valid ',
  })
  @IsString()
  @IsOptional()
  @IsJWT()
  readonly accessToken?: string;

  /**
   * @param expiresIn: Date
   * @description 'Expiration date '
   */
  @ApiProperty({
    required: true,
    type: 'Date',
  })
  readonly expiresAt: Date;
}
