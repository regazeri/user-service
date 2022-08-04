import { Injectable } from '@nestjs/common';

import {
  ForgotPasswordMessageDto,
  UpdateEmailMessageDto,
  UserCreateEmailDto,
  UserEmailEventDto,
} from '../dto';
import { ExchangeEnum, RoutingKeyEnum } from '../enums';
import { EmailTemplateTypeEnum } from '../enums/email-template-type.enum';
import { PublisherService } from './publisher.service';

@Injectable()
export class EmailEventService {
  constructor(private readonly _publisherService: PublisherService) {}

  public async sendRegisterEmailEvent(
    input: UserCreateEmailDto,
  ): Promise<boolean> {
    const payload: UserEmailEventDto = {
      ...input,
      templateType: EmailTemplateTypeEnum.CODE_REGISTER,
    };
    try {
      await this._publisherService.sendMessagePubSub(
        ExchangeEnum.USER_EXCHANGE,
        RoutingKeyEnum.REGISTER_USER_ROUTING_KEY,
        payload,
      );
      return true;
    } catch (error) {
      // TODO insert logging
      return false;
    }
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // TODO add comment

  public async sendUpdateEmailEvent(
    input: UpdateEmailMessageDto,
  ): Promise<boolean> {
    const payload: UserEmailEventDto = {
      ...input,
      templateType: EmailTemplateTypeEnum.CODE_UPDATE,
    };
    try {
      await this._publisherService.sendMessagePubSub(
        ExchangeEnum.USER_EXCHANGE,
        RoutingKeyEnum.UPDATE_EMAIL_ROUTING_KEY,
        payload,
      );
      return true;
    } catch (error) {
      // TODO insert logging
      return false;
    }
  }

  public async sendForgotPasswordEmailEvent(
    input: ForgotPasswordMessageDto,
  ): Promise<boolean> {
    const payload = {
      ...input,
      templateType: EmailTemplateTypeEnum.FORGET_PASSWORD,
    };
    try {
      await this._publisherService.sendMessagePubSub(
        ExchangeEnum.USER_EXCHANGE,
        RoutingKeyEnum.FORGET_PASSWORD_EMAIL_ROUTING_KEY,
        payload,
      );
      return true;
    } catch (error) {
      // TODO insert logging
      return false;
    }
  }
}
