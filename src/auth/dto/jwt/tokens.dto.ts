import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class TokensDto {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;

  constructor(partial: Partial<TokensDto>) {
    Object.assign(this, partial);
  }
}
