import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  clientSecret!: string;
}
