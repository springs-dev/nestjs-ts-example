import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { CustomersService } from './services/customers.service';
import { AuthModule } from '../auth/auth.module';
import { CustomerEntity } from './entities/customer.entity';
import { CustomersSelfController } from './controllers/customers-self.controller';
import { CustomersAuthController } from './controllers/customers-auth.controller';
import { JwtCustomersStrategy } from './strategies/jwt-customer.strategy';
import { LocalCustomersStrategy } from './strategies/local-customer.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
    ]),
    AuthModule,
  ],
  providers: [
    CustomersService,
    JwtCustomersStrategy,
    LocalCustomersStrategy,
  ],
  exports: [
    CustomersService,
  ],
  controllers: [
    CustomersAuthController,
    CustomersSelfController,
  ],
})
export class CustomersModule {}
