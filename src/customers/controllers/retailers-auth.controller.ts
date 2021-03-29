import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersRolesEnum } from '../../auth/enumerables/users-roles.enum';
import { RefreshAccessTokenDto } from '../../auth/dto/jwt/refresh-access-token.dto';
import { CustomersService } from '../services/customers.service';
import { TokensService } from '../../auth/services/tokens.service';
import { CustomerWithTokensDto } from '../dto/customer-auth/customer-with-tokens.dto';
import { CustomerLoginDto } from '../dto/customer-auth/customer-login.dto';
import { CustomerRegistrationDto } from '../dto/customer-auth/customer-registration.dto';

@ApiBearerAuth()
@ApiTags('Customers Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth/customers')
export class CustomersAuthController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly tokensService: TokensService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customers login',
    type: CustomerWithTokensDto,
  })
  @SerializeOptions({ groups: ['customer'] })
  @UseGuards(AuthGuard('local-customers'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: CustomerLoginDto,
    @CurrentUser() user,
  ): Promise<CustomerWithTokensDto> {
    const customer = await this.customersService.findOne(
      {
        id: user.id,
      }
    );

    const tokens = await this.tokensService.createTokens(
      UsersRolesEnum.CUSTOMER,
      customer.id,
    );

    return {
      customer,
      tokens,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register new customer.',
    type: CustomerWithTokensDto,
  })
  @SerializeOptions({ groups: ['customer'] })
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registerCustomer(
    @Body() createCustomerDto: CustomerRegistrationDto,
  ): Promise<CustomerWithTokensDto> {
    const customer = await this.customersService.createCustomer(
      createCustomerDto.email,
      createCustomerDto.password,
    );

    const tokens = await this.tokensService.createTokens(
      UsersRolesEnum.CUSTOMER,
      customer.id,
    );

    return {
      customer,
      tokens,
    };
   
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh access token.',
    type: CustomerWithTokensDto,
  })
  @SerializeOptions({ groups: ['customer'] })
  @Post('refresh-access-token')
  @HttpCode(HttpStatus.OK)
  async refreshcustomerToken(
    @Body() refreshTokenDto: RefreshAccessTokenDto,
  ): Promise<CustomerWithTokensDto> {
    const { tokens, payload } = await this.tokensService.refreshAccessToken(
      UsersRolesEnum.CUSTOMER,
      refreshTokenDto.refreshToken,
    );

    const customer = await this.customersService.findOne(
      {
        id: payload.userId,
      }
    );

    return {
      customer,
      tokens,
    };
  }
}
