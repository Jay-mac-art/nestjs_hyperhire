// price.controller.ts
import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { SwapService } from '../../providers/swap.service';
import { CreateAlertDto } from './dto/price.dto';
import { Chain } from 'src/common/constants/enums';
import { SwapRateResult } from 'src/common/constants/types';

@ApiTags('Prices')
@Controller('prices')
export class PriceController {
  constructor( 
    private readonly priceService: PriceService,
    private readonly swapService: SwapService,
  ) {}

  @Get('history')
  @ApiOperation({ 
    summary: 'Get hourly price history for tracked assets over last 24 hours',
    description: 'Returns prices aggregated by hour for each supported blockchain asset'
  })
  @ApiResponse({ status: 200, description: 'Hourly price data' })
  async getHourlyPrices() {
    return this.priceService.getHourlyPrices();
  }

  @Post('alerts')
  @ApiOperation({ 
    summary: 'Create price alert', 
    description: 'Set a price threshold notification for any supported asset' 
  })
  @ApiBody({
    description: 'Alert details including asset, target price, and notification email',
    type: CreateAlertDto, // This specifies the DTO used in the body
  })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.priceService.createAlert(createAlertDto);
  }


  @Get('swap-rate')
  @ApiOperation({ 
    summary: 'Calculate cross-chain swap rate',
    description: 'Calculate conversion between any two supported assets with fee breakdown'
  })
  @ApiQuery({ name: 'source', enum: Chain, description: 'Source blockchain asset' })
  @ApiQuery({ name: 'target', description: 'Target asset (supports BTC for conversions)' })
  @ApiQuery({ name: 'amount', type: Number, description: 'Amount of source asset to swap' })
  @ApiResponse({ status: 200, description: 'Swap calculation result' })
  async getSwapRate(
    @Query('source') source: Chain,
    @Query('target') target: string,
    @Query('amount') amountStr: string
  ) : Promise<SwapRateResult>{
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Invalid amount - must be positive number');
    }
    if (!Object.values(Chain).includes(source)) {
      throw new BadRequestException('Invalid source asset');
    }
    return this.swapService.getSwapRate(source, target, amount);
  }
}