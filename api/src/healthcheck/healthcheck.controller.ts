import { Controller, Get, Version } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  @Get('debug-sentry')
  @Version('1')
  getError() {
    throw new Error("My first Sentry error!");
  }
}
