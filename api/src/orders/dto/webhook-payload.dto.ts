import { IsString, IsBoolean, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class UserDto {
  @IsString()
  email: string;
}

class ItemDto {
  @IsString()
  name: string;
}

class OrderInfoDto {
  @IsNumber()
  createdAt: number;
}

class PaymentDataDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ValidateNested()
  @Type(() => OrderInfoDto)
  order: OrderInfoDto;

  @ValidateNested()
  @Type(() => UserDto)
  customer: UserDto;  // Added customer field
}

export class WebhookPayloadDto {
  @IsString()
  type: string;

  @IsBoolean()
  testMode: boolean;

  @ValidateNested()
  @Type(() => PaymentDataDto)
  data: PaymentDataDto;
}
