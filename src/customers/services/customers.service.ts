import { Injectable } from '@nestjs/common';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customersRepository: Repository<CustomerEntity>,
  ) {}

  get customerRepository() {
    return this.customersRepository;
  }

  async createCustomer(
    email: string,
    password: string,
  ): Promise<CustomerEntity> {
    return this.customersRepository.save({
      email,
      password,
    });
  }

  findOne(
    conditions: FindConditions<CustomerEntity>,
    options?: FindOneOptions,
  ): Promise<CustomerEntity> {
    return this.customersRepository.findOneOrFail(
      conditions,
      options ?? undefined,
    );
  }

  find(options?: FindManyOptions<CustomerEntity>): Promise<CustomerEntity[]> {
    return this.customersRepository.find(options ?? undefined);
  }

  updateCustomer(
    conditions: FindConditions<CustomerEntity>,
    payload: Partial<CustomerEntity>,
  ): Promise<UpdateResult> {
    return this.customersRepository.update(conditions, payload);
  }

  isCustomerExist(
    conditions: FindConditions<CustomerEntity>,
  ): Promise<boolean> {
    return this.customersRepository
      .count(conditions)
      .then(retailerCount => !!retailerCount);
  }
}
