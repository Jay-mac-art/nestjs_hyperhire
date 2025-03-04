import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BlockScanService {
  private readonly logger = new Logger(BlockScanService.name);
  private readonly API_ENDPOINTS = {
    ETH: 'https://api.etherscan.io/api',
    POLYGON: 'https://api.polygonscan.com/api',
  };

  constructor() {
    if (!process.env.ETHERSCAN_API_KEY || !process.env.POLYGONSCAN_API_KEY) {
      throw new Error('API keys not configured in environment variables');
    }
  }

  async getEthPrice(): Promise<number> {
    return this.getNativeTokenPrice('ETH');
  }

  async getMaticPrice(): Promise<number> {
    return this.getNativeTokenPrice('POLYGON');
  }

  private async getNativeTokenPrice(chain: string): Promise<number> {
    try {
      let response;
      
      switch(chain.toUpperCase()) {
        case 'ETH':
          response = await axios.get(this.API_ENDPOINTS.ETH, {
            params: {
              module: 'stats',
              action: 'ethprice',
              apikey: process.env.ETHERSCAN_API_KEY
            }
          });
          break;

        case 'POLYGON':
          response = await axios.get(this.API_ENDPOINTS.POLYGON, {
            params: {
              module: 'stats',
              action: 'maticprice',
              apikey: process.env.POLYGONSCAN_API_KEY
            }
          });
          break;

        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }

      // Validate response
      if (response.data.status !== '1') {
        throw new Error(`Invalid response status from ${chain} scanner API`);
      }

      // Extract price based on chain
      let price: number;
      switch(chain.toUpperCase()) {
        case 'ETH':
          price = parseFloat(response.data.result.ethusd);
          break;
        case 'POLYGON':
          price = parseFloat(response.data.result.maticusd);
          break;
        default:
          throw new Error(`No price found for ${chain}`);
      }

      // Log the price for debugging
      this.logger.log(`${chain} Price: ${price}`);

      return price;
    } catch (error) {
      this.logger.error(`Failed to fetch ${chain} price`, error);
      throw new Error(`Failed to fetch ${chain} price: ${error.message}`);
    }
  }
}