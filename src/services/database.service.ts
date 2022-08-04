import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
/**
 * @description This class return typeorm config which get from configfile
 */
@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private _configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this._configService.get('database');
  }

  private getBatchTransferStatus(methods, events, batchExtrinsicLike): boolean {
    return methods.flatMap(methods, (arg, i) => {
      const success = this.getBatchTransferStatus(events, i);
      this.getDataFromBatchAndBatchAllItem(batchExtrinsicLike, i, success);
    });
  }
}
