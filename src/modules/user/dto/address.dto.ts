import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IAddress } from '../interfaces';

export class AddressDto implements IAddress {
  /**
   * @property {string} country
   */
  @ApiProperty()
  @IsString()
  readonly country: string;

  /**
   * @property {string} city
   */
  @ApiProperty()
  @IsString()
  readonly city: string;

  /**
   * @property {string} province
   */
  @ApiProperty()
  @IsString()
  readonly province: string;

  /**
   * @property {string} address
   */
  @ApiProperty()
  @IsString()
  readonly address: string;

  /**
   * @property {string} postalNumber
   */
  @ApiProperty()
  @IsString()
  readonly postalNumber: string;
}
