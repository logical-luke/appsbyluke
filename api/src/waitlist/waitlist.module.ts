import {Module} from '@nestjs/common';
import {WaitlistController} from './waitlist.controller';
import {WaitlistService} from "./waitlist.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {Waitlist} from "./entities/waitlist.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Waitlist]),
        ConfigModule.forRoot(),
    ],
    controllers: [WaitlistController],
    providers: [WaitlistService],
})
export class WaitlistModule {
}
