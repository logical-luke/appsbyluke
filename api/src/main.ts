import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import fastifyCors from '@fastify/cors';
import * as morgan from 'morgan';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const configService = app.get(ConfigService);
    const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];

    const isDevelopment = process.env.NODE_ENV !== 'production';

    morgan.token('error', (req: any, res: any) => {
        return res.errorMessage || '';
    });

    const logFormat = ':method :url :status :response-time ms - :res[content-length] :error';

    app.use(morgan(logFormat, {
        stream: {
            write: (message: string) => {
                console.log(message.trim());
            },
        },
        skip: (req, res) => {
            if (res.statusCode < 400) {
                return true;
            }
            return false;
        },
    }));

    app.use((err, req, res, next) => {
        res.errorMessage = err.stack;
        next(err);
    });

    await app.register(fastifyCors, {
        origin: isDevelopment
            ? (origin, cb) => {
                const localhost = /^https?:\/\/localhost(:\d+)?$/;
                if (!origin || localhost.test(origin)) {
                    cb(null, true);
                    return;
                }
                cb(new Error('Not allowed by CORS'), false);
            }
            : allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    app.enableVersioning({
        type: VersioningType.URI,
        prefix: 'v',
    });

    const port = configService.get<number>('PORT') || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
