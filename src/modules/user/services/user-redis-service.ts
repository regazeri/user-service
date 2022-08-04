import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class UserRedisService implements OnModuleInit {
  private _redis: Redis;

  constructor(private readonly _redisService: RedisService) {}

  onModuleInit(): void {
    // Get default client instance
    this._redis = this._redisService.getClient();
  }

  /**
   * Set verification code in redis
   *
   * @param identifier Account identifier (email or mobile)
   * @param code Verification code
   * @returns Nothing
   */
  async setAccountVerificationCode(
    identifier: string,
    code: string,
  ): Promise<void> {
    const key = UserRedisService._makeAccountVerificationKey(identifier);
    await this._redis.set(key, code, 'EX', 60 * 10); // expire in 10 min
  }

  /**
   * Retrieve verification code from redis
   *
   * @param identifier account identifier (email or mobile)
   * @returns The stored or or null if entry not found
   */
  async getAccountVerificationCode(identifier: string): Promise<string | null> {
    const key = UserRedisService._makeAccountVerificationKey(identifier);
    return this._redis.get(key);
  }

  /**
   * Delete verification key from redis
   *
   * @param identifier Account identifier (email or mobile)
   * @returns Success or failure result
   */
  async deleteAccountVerificationCode(identifier: string): Promise<boolean> {
    const key = UserRedisService._makeAccountVerificationKey(identifier);
    const result = await this._redis.del(key);
    return result === 1;
  }

  /**
   * Make unique key for storing verification codes in redis
   *
   * @param identifier Account identifier (email or mobile)
   * @returns Redis key for account
   */
  private static _makeAccountVerificationKey(identifier: string): string {
    return `verification::${identifier}`;
  }
}
