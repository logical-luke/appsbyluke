import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waitlist } from './entities/waitlist.entity';
import { AddToWaitlistDto } from './dto/add-to-waitlist.dto';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist)
    private waitlistRepository: Repository<Waitlist>,
  ) {}

  async addToWaitlist(waitlistDto: AddToWaitlistDto) {
    const waitlist = new Waitlist();
    waitlist.id = uuidv4();
    waitlist.email = waitlistDto.email;
    waitlist.name = waitlistDto.name;
    waitlist.packageName = waitlistDto.packageName;

    await this.waitlistRepository.save(waitlist);

    return {
      success: true,
      message: 'Successfully added to waitlist',
    };
  }
}
