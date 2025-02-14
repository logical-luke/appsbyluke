import {Module} from "@nestjs/common";
import {SentryModule} from "@sentry/nestjs/setup";
import {APP_FILTER} from "@nestjs/core";
import {SentryGlobalFilter} from "@sentry/nestjs/setup";
import {ConfigModule, ConfigService} from '@nestjs/config';
import {EmailModule} from './email/email.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrdersModule} from "./orders/orders.module";
import {WaitlistModule} from "./waitlist/waitlist.module";

@Module({
    imports: [
        SentryModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: +configService.get<number>('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false,
                charset: 'utf8mb4',
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
        EmailModule,
        OrdersModule,
        WaitlistModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
        },
    ]
})
export class AppModule {
}
