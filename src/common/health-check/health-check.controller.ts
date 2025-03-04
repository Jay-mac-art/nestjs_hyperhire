import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../decorators/public.decorator';

@Controller('healthcheck')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return true;
  }
}
