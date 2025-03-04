import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from './config.service';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
  ],
  exports: [ConfigurationService],
  providers: [ConfigurationService, ConfigService],
})
export class ConfigurationModule {}
