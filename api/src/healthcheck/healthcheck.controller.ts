import { Controller, Get, Body, Version } from '@nestjs/common';

@Controller('healthcheck')
export class AuthController {
  @Get('debug-sentry')
  @Version('1')
  getError() {
    throw new Error("My first Sentry error!");
  }
}
