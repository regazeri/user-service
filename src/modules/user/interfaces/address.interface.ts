/**
 * @description IAddress for user address
 */
export interface IAddress {
  readonly country: string;
  readonly city: string;
  readonly province: string;
  readonly address: string;
  readonly postalNumber: string;
}
