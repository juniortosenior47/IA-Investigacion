import { IsString, IsNotEmpty } from 'class-validator';

export class GetTokenDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  clientSecret!: string;
}
