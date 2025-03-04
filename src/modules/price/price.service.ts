import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceRecord } from 'src/entity/priceRecord.entity';
import { LessThan, Repository } from 'typeorm';
import { ErrorMessage, RefStrings } from 'src/common/constants';
import { Utils } from 'src/common/utils/utils';
import { ConfigurationService } from 'src/config/config.service';
import { Chain } from 'src/common/constants/enums';
import { BlockScanService } from 'src/providers/scan.service';
import { Alert } from 'src/entity/alert.entity';
import { EmailService } from 'src/providers/email.service';
import { Cron } from '@nestjs/schedule';
import { CreateAlertDto } from './dto/price.dto';

@Injectable()
export class PriceService {
  // Logger instance for debugging and monitoring
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(PriceRecord) private priceRepo: Repository<PriceRecord>,
    private blockScanService : BlockScanService,
    private emailService: EmailService,
    @InjectRepository(Alert) private alertRepo: Repository<Alert>,
  ) {}

  /** Cronjob to fetch prices every 5 minutes */
  @Cron('0 */5 * * * *')
  async fetchPrices() {
    try {
      // Fetch ETH and MATIC prices concurrently for efficiency
      const [ethPrice, maticPrice] = await Promise.all([
        this.blockScanService.getEthPrice(),
        this.blockScanService.getMaticPrice(),
      ]);

      // Save prices to the database immediately
      await this.priceRepo.save([
        { asset: Chain.ETH, priceUsd: ethPrice, timestamp: new Date() },
        { asset: Chain.POL, priceUsd: maticPrice, timestamp: new Date() },
      ]);

      // Perform price increase checks and alert checks
      await this.checkPriceIncrease(Chain.ETH, ethPrice);
      await this.checkPriceIncrease(Chain.POL, maticPrice);
      await this.checkAlerts();
    } catch (error) {
      this.logger.error('Error in fetchPrices', error.stack);
      // Optionally, add retry logic or notify admins here
    }
  }

  /** Check if the price has increased by more than 3% in the last hour */
  private async checkPriceIncrease(chain: Chain, currentPrice: number) {
    try {
      // Retrieve the most recent price from at least one hour ago
      const oneHourAgo = new Date(Date.now() - 3600 * 1000);
      const oldPriceRecord = await this.priceRepo.findOne({
        where: { asset: chain, timestamp: LessThan(oneHourAgo) },
        order: { timestamp: 'DESC' },
      });

      // If an old price exists, calculate the percentage increase
      if (oldPriceRecord) {
        const oldPrice = oldPriceRecord.priceUsd;
        const increasePercentage = (currentPrice - oldPrice) / oldPrice;
        if (increasePercentage > 0.03) {
          // Send an email alert if the increase exceeds 3%
          await this.emailService.sendAlert(chain, currentPrice, oldPrice);
        }
      }
    } catch (error) {
      this.logger.error(`Error checking price increase for ${chain}`, error.stack);
    }
  }

  /** Check and trigger alerts based on target prices */
  private async checkAlerts() {
    try {
      // Retrieve all active alerts
      const alerts = await this.alertRepo.find({ where: { isActive: true } });

      // Fetch the latest prices for ETH and MATIC once
      const latestEthPrice = await this.getLatestPrice(Chain.ETH);
      const latestMaticPrice = await this.getLatestPrice(Chain.POL);
      const prices = { ETH: latestEthPrice, MATIC: latestMaticPrice };

      // Process each alert sequentially to avoid race conditions
      for (const alert of alerts) {
        const currentPrice = prices[alert.chain];
        if (currentPrice && currentPrice >= alert.targetPrice) {
          // Send alert email and delete the alert (one-time trigger)
          await this.emailService.sendAlertTriggered(alert);
          await this.alertRepo.delete(alert.id);
        }
      }
    } catch (error) {
      this.logger.error('Error in checkAlerts', error.stack);
    }
  }

  /** Helper method to get the latest price for a given chain */
  private async getLatestPrice(chain: Chain): Promise<number | null> {
    try {
      const latestRecord = await this.priceRepo.findOne({
        where: { asset: chain },
        order: { timestamp: 'DESC' },
      });
      return latestRecord ? latestRecord.priceUsd : null;
    } catch (error) {
      this.logger.error(`Error getting latest price for ${chain}`, error.stack);
      return null;
    }
  }

  // In PriceService
async getHourlyPrices() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return this.priceRepo
    .createQueryBuilder('price')
    .select([
      "DATE_TRUNC('hour', price.timestamp) as hour",
      'price.asset as asset',
      'AVG(price.priceUsd) as average_price',
      'MAX(price.priceUsd) as high_price',
      'MIN(price.priceUsd) as low_price'
    ])
    .where('price.timestamp >= :twentyFourHoursAgo', { twentyFourHoursAgo })
    .groupBy("hour, price.asset")
    .orderBy("hour", "ASC")
    .getRawMany();
}

async createAlert(createAlertDto: CreateAlertDto) {
  try{
  const newAlert = this.alertRepo.create({
    ...createAlertDto,
    isActive: true
  });


  const alert = await this.alertRepo.save(newAlert);
  await this.emailService.sendAlertConfirmation(alert);
  return alert;


}

catch(error){
  throw error;
}
}
}