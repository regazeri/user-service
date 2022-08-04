import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsOptional, IsString } from 'class-validator';

export class TokenPairResponseDto {
  /**
   * @param accessToken: string
   * @description 'short time valid '
   */
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'short time valid ',
  })
  @IsString()
  @IsJWT()
  readonly accessToken: string;

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
  readonly refreshToken?: string;

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
