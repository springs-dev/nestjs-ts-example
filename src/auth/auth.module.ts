import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { BcryptAdapter } from "../common/crypto/bcrypt.adapter";
import { CryptoService } from "../common/crypto/crypto.service";
import { JwtConfigService } from "../config/jwt-config.service";
import { TokensService } from "./services/tokens.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    TokensService,
    {
      provide: CryptoService,
      useClass: BcryptAdapter,
    },
  ],
  exports: [
    TokensService,
    {
      provide: CryptoService,
      useClass: BcryptAdapter,
    },
  ],
})
export class AuthModule {}
