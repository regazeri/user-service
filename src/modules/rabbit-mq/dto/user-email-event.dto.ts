import { IsEnum, IsString } from 'class-validator';

import { EmailTemplateTypeEnum } from '../enums/email-template-type.enum';
import { UserCreateEmailDto } from './user-create-email.dto';

export class UserEmailEventDto extends UserCreateEmailDto {
  /**
   * @property {typeTemplate: EmailTemplateTypeEnum}
   * @description typeTemplate for email service
   */
  @IsString()
  @IsEnum(EmailTemplateTypeEnum)
  templateType: EmailTemplateTypeEnum;
}
