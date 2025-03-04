// swap.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceRecord } from 'src/entity/priceRecord.entity';
import axios from 'axios';
import { Chain } from 'src/common/constants/enums';
import { SwapRateResult } from 'src/common/constants/types';



@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);

  constructor(
    @InjectRepository(PriceRecord)
    private priceRepo: Repository<PriceRecord>,
  ) {}

  async getSwapRate(
    sourceAsset: Chain,
    targetAsset: string,
    amount: number
  ): Promise<any> {
    try {
      // Validate input parameters
      if (!amount || amount <= 0) {
        throw new Error('Invalid swap amount');
      }

      // Get source asset price
      const sourcePrice = await this.getAssetPrice(sourceAsset);
      
      // Get target asset price
      const targetPrice = targetAsset.toUpperCase() === 'BTC' 
        ? await this.getBtcPrice()
        : await this.getAssetPrice(targetAsset as Chain);

      // Calculate fees
      const feeAssetAmount = amount * 0.03;
      const feeUsd = feeAssetAmount * sourcePrice;

      // Calculate received amount
      const convertedAmount = (amount - feeAssetAmount) * (sourcePrice / targetPrice);

      return {
        receivableBTCAmount: convertedAmount,
        totalfeeApplicable: {
          asset: sourceAsset,
          amount: feeAssetAmount,
          usd: feeUsd,
          feePercentage : 0.03
        },
        rateUsed: sourcePrice / targetPrice,
      };
    } catch (error) {
      this.logger.error(`Swap calculation failed: ${error.message}`);
      throw new Error(`Swap calculation failed: ${error.message}`);
    }
  }

  private async getAssetPrice(asset: Chain): Promise<number> {
    const record = await this.priceRepo.findOne({
      where: { asset },
      order: { timestamp: 'DESC' },
    });
    
    if (!record) {
      throw new Error(`No price data available for ${asset}`);
    }
    
    return record.priceUsd;
  }

  private async getBtcPrice(): Promise<number> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      
      if (!response.data?.bitcoin?.usd) {
        throw new Error('Failed to fetch BTC price');
      }
      
      return response.data.bitcoin.usd;
    } catch (error) {
      this.logger.error('BTC price fetch failed', error.stack);
      throw new Error('Failed to retrieve BTC conversion rate');
    }
  }
}
