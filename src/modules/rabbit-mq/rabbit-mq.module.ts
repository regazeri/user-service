import {
  MessageHandlerErrorBehavior,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { rabbitConfig } from './../../config';
import { AuthEventService } from './services/auth-event.service';
import { ConsumerService } from './services/consumer.service';
import { EmailEventService } from './services/email-event.service';
import { PublisherService } from './services/publisher.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: rabbitConfig.panelExchanges,
      uri: rabbitConfig.uri,
      prefetchCount: 1,
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
      defaultRpcErrorBehavior: MessageHandlerErrorBehavior.NACK,
      connectionInitOptions: rabbitConfig.Options,
    }),
  ],
  providers: [
    PublisherService,
    ConsumerService,
    AuthEventService,
    EmailEventService,
  ],
  exports: [AuthEventService, EmailEventService],
})
export class UserRabbitMqModule {}
