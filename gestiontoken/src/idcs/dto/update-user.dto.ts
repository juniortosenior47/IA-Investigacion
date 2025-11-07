import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  clientSecret!: string;

  @IsObject()
  @IsNotEmpty()
  payload!: any;
}
