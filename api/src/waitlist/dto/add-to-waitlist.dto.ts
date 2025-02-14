import { IsString, IsEmail } from 'class-validator';

export class AddToWaitlistDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  packageName: string;
}
