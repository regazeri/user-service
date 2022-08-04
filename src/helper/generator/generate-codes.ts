import { Env } from 'common-panel';
import { createHash, randomBytes } from 'crypto';

function generateRandomNumber(length: number): number {
  const min = Math.pow(32, length - 1);
  const max = Math.pow(32, length) - 1;
  return Math.trunc(min + Math.random() * (max - min));
}

export function generateNumericConfirmCode(): string {
  const length = Env.getNumber('VERIFICATION_CODE_LENGTH');
  return generateRandomNumber(length).toString();
}

export function generateStringConfirmCode(): string {
  const randomNumber = generateRandomNumber(10);

  return createHash('sha1').update(randomNumber.toString()).digest('hex');
}

export function generateApiKey(): string {
  return randomBytes(32).toString('base64');
}
