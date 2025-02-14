import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-fngs-signature'];
    const payload = request.body;

    if (!signature) {
      throw new UnauthorizedException('Missing signature header');
    }

    const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET');

    const expectedSignature = this.calculateSignature(payload, webhookSecret);
    const actualSignature = signature.replace('sha256_', '');

    if (expectedSignature !== actualSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }

  private calculateSignature(payload: any, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }
}
