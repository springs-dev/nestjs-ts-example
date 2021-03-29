import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1h"
      }
    };
  }
}
