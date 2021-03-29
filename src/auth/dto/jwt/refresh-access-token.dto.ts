import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class RefreshAccessTokenDto {
  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}
