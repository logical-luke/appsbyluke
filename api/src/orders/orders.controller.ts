import { Controller, Post, Get, Body, Version, UseGuards, HttpCode } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { SignatureGuard } from './guards/signature.guard';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('webhook')
  @Version('1')
  @UseGuards(SignatureGuard)
  @HttpCode(200)
  async handlePaymentWebhook(@Body() webhookPayloadDto: WebhookPayloadDto) {
    if (webhookPayloadDto.testMode) {
      return { success: true, message: 'Test mode request received' };
    }

    return this.ordersService.processOrder(webhookPayloadDto);
  }

  @Get('available-slots')
  @Version('1')
  async getAvailableSlots() {
    const availableSlots = await this.ordersService.getAvailableSlots();
    return {
      availableSlots,
    };
  }
}
