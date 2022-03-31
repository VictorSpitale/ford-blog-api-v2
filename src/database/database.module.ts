import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IMongoConfigOptions } from './mongo.config.interface';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  public static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const dbConfig = configService.get<IMongoConfigOptions>('database');
            return {
              uri:
                'mongodb+srv://' +
                dbConfig.username +
                ':' +
                dbConfig.password +
                '@' +
                dbConfig.host +
                '/' +
                (configService.get<string>('NODE_ENV') === 'test'
                  ? dbConfig.test_name
                  : configService.get<string>('NODE_ENV') === 'development'
                  ? dbConfig.dev_name
                  : dbConfig.name),
            };
          },
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
