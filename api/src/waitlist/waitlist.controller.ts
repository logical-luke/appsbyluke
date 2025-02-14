import { Controller, Post, Body, Version } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { AddToWaitlistDto } from './dto/add-to-waitlist.dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('add')
  @Version('1')
  async addToWaitlist(@Body() addToWaitlistDto: AddToWaitlistDto) {
    return this.waitlistService.addToWaitlist(addToWaitlistDto);
  }
}
