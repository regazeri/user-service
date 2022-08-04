import { Injectable } from '@nestjs/common';

import {
  TokenPairResponseDto,
  UserCreatedAuthEventDto,
  UserUpdatedEventDto,
} from '../dto';
import { EventStatus, ExchangeEnum, RoutingKeyEnum } from '../enums';
import { PublisherService } from './publisher.service';

@Injectable()
export class AuthEventService {
  constructor(private readonly _publisherService: PublisherService) {}
  // TODO add comment

  public async createUserEvent(
    payload: UserCreatedAuthEventDto,
  ): Promise<TokenPairResponseDto | EventStatus> {
    try {
      const result = await this._publisherService.sendMessageRpc(
        ExchangeEnum.USER_EXCHANGE,
        RoutingKeyEnum.USER_SIGNIN_ROUTING_KEY,
        payload,
      );
      if ('status' in result) {
        return result.status === EventStatus.SUCCESS
          ? result.message
          : EventStatus.FAIL;
      }
      return EventStatus.FAIL;
    } catch (error) {
      return EventStatus.FAIL;
      // TODO insert logging
      // TODO insert custom error
    }
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // TODO add comment

  public async deleteUserEvent(id: string): Promise<EventStatus> {
    try {
      const result = await this._publisherService.sendMessageRpc(
        ExchangeEnum.USER_EXCHANGE,
        RoutingKeyEnum.USER_DELETE_ROUTING_KEY,
        { id },
      );
      if ('status' in result) {
        return result.status;
      }
      return EventStatus.FAIL;
    } catch (error) {
      // TODO insert logging
      return EventStatus.FAIL;
    }
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // TODO add comment

  public async updateUserEvent(
    payload: UserUpdatedEventDto,
  ): Promise<EventStatus> {
    try {
      const result = await this._publisherService.sendMessageRpc(
        ExchangeEnum.USER_EXCHANGE,
        RoutingKeyEnum.USER_UPDATE_ROUTING_KEY,
        payload,
      );
      if ('status' in result) {
        return result.status;
      }
      return EventStatus.FAIL;
    } catch (error) {
      return EventStatus.FAIL;

      // TODO insert logging
      // TODO insert custom error
    }
  } // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}
