import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        retryAttempts: 3,
        migrations: [__dirname + '/../**/*.migrations{.ts}'],
        autoLoadEntities: true,
        // synchronize: false,
        synchronize: true,
        entities: [],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
