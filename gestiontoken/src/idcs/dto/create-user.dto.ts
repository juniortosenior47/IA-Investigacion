import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateUserDto {
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
