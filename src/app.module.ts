import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './common/health-check/health-check.module';
import { PostgresModule } from './config/database/postgres.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceModule } from './modules/price/price.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    HealthModule,
    PostgresModule,
    TypeOrmModule.forFeature([]),
    PriceModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
