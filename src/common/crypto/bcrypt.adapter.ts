import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { CryptoService } from "./crypto.service";
import { promisify } from "util";

bcrypt.hash = promisify(bcrypt.hash);
bcrypt.genSalt = promisify(bcrypt.genSalt);
bcrypt.compare = promisify(bcrypt.compare);

@Injectable()
export class BcryptAdapter implements CryptoService {
  get defaultRounds() {
    return this._defaultRounds;
  }

  set defaultRounds(rounds) {
    this._defaultRounds = rounds;
  }

  private _defaultRounds?: number = 10;

  public hash(value: string, saltRounds?: number): Promise<string> {
    return bcrypt
      .genSalt(saltRounds ?? this.defaultRounds)
      .then(salt => bcrypt.hash(value, salt));
  }

  public compare(hash: string, value: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
