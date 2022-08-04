import { IsEnum, IsString } from 'class-validator';

import { ExchangeEnum, RoutingKeyEnum } from '../enums';

export class UserRpcEventDto {
  /**
   * @property {exchange: ExchangeEnum}
   * @description define exchange name
   */
  @IsString()
  @IsEnum(ExchangeEnum)
  exchange: ExchangeEnum;
  /**
   * @property {routingKey: RoutingKeyEnum}
   * @description define routing key
   */
  @IsString()
  @IsEnum(RoutingKeyEnum)
  routingKey: RoutingKeyEnum;

  payload?: Record<string, any>;
}
