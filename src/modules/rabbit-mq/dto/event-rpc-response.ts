import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { EventStatus } from '../enums';
import { TokenPairResponseDto } from './token-pair.response.dto';

export class EventRpcRespons {
  /**
   * @param staus: EventStatus
   * @description 'response from event '
   */
  @IsString()
  @IsEnum(EventStatus)
  readonly status: EventStatus;
  /**
   * @param message: TokenPairRespons
   * @description 'token pair response'
   */
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TokenPairResponseDto)
  message?: TokenPairResponseDto;
}
