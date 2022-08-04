import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

import { EventRpcRespons, UserRpcEventDto } from '../dto';
import { ExchangeEnum, RoutingKeyEnum } from '../enums';

@Injectable()
export class PublisherService {
  constructor(private readonly _amqpConnection: AmqpConnection) {}

  /**
   * @descriptions send messages to rabbitmq via pub/sub pattern
   */
  // TODO add timeout to request method
  public async sendMessagePubSub(
    exchangeName: ExchangeEnum,
    routingKey: RoutingKeyEnum,
    payload: any,
  ): Promise<Nack | undefined> {
    try {
      await this._amqpConnection.publish(exchangeName, routingKey, payload);
      return;
    } catch (error) {
      return new Nack(true);
    }
  }

  /**
   * @descriptions send messages to rabbitmq via rpc pattern
   */
  public async sendMessageRpc(
    exchange,
    routingKey,
    payload?: any,
  ): Promise<EventRpcRespons | Nack> {
    try {
      return await this._amqpConnection.request<EventRpcRespons>({
        exchange,
        routingKey,
        payload,
      });
    } catch (error) {
      return new Nack(true);
    }
  }
}
