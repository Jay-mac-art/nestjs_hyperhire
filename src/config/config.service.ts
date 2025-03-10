import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}
  get(configString: string) {
    return this.configService.getOrThrow(configString);
  }
}
