export abstract class CryptoService {
  /**
   * @description Returns a hash for provided string value
   * @param value - String to hash
   * @param saltRounds - Number of salt round
   */
  abstract hash(value: string, saltRounds?: number): Promise<string>;

  /**
   * @description Check that hashed value is the same as provided value
   * @param hash - Hash value
   * @param value - Value that we need to compare with hash
   */
  abstract compare(hash: string, value: string): Promise<boolean>;
}
