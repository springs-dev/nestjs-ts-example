import { Connection, getRepository } from 'typeorm';
import path from 'path';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';

export class TypeOrmHelpers {
  constructor(private readonly connection: Connection) {}

  async closeConnection() {
    try {
      await this.connection.close();
    } catch (error) {
      throw new Error(`ERROR: Closings test db: ${error}`);
    }
  }

  async refreshDB() {
    try {
      await this.connection.dropDatabase();
      await this.connection.runMigrations();
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  async loadFixtures(
    cleanDBBeforeLoad = true,
    fixturesFolderPath = './fixtures/test',
  ) {
    if (cleanDBBeforeLoad) {
      await this.refreshDB();
    }


    try {
      const loader = new Loader();
      loader.load(path.resolve(fixturesFolderPath));

      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(this.connection, new Parser());

      for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        await getRepository(entity.constructor.name).save(entity);
      }
    } catch (err) {
      throw err;
    }
  }
}
