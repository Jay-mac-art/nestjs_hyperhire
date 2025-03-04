import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PriceRecord } from 'src/entity/priceRecord.entity';
import { ConfigurationService } from 'src/config/config.service';
import {Alert} from 'src/entity/alert.entity';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { EmailService } from 'src/providers/email.service';
import { SwapService } from 'src/providers/swap.service';
import { BlockScanService } from 'src/providers/scan.service';
@Module({
  imports: [TypeOrmModule.forFeature([PriceRecord,Alert]), PriceModule],
  controllers: [PriceController],
  providers: [PriceService, EmailService, BlockScanService , SwapService , ConfigurationService],
})
export class PriceModule {}
