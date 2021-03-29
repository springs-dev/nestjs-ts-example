import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getMetadataArgsStorage } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmOptionsService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      username: this.config.get('DB_USERNAME'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: Number(this.config.get('DB_PORT')),
      database: this.config.get('DB_NAME'),
      synchronize: false,
      dropSchema: false,
      namingStrategy: new SnakeNamingStrategy(),
      logging: this.config.get('DB_LOGGING') == 'true',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      keepConnectionAlive: true,
    };
  }
}
