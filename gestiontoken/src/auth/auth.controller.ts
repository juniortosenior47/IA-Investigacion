import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IdcsService } from '../idcs/idcs.service';
import { ApiKeyGuard } from './api-key.guard';
import { GetTokenDto } from './dto/get-token.dto';

@Controller('auth2/v1/')
export class AuthController {
  constructor(private readonly idcsService: IdcsService) {}

  @Post('token')
  @UseGuards(ApiKeyGuard)
  async getToken(@Body() getTokenDto: GetTokenDto) {
    return this.idcsService.getTokenForApp(getTokenDto.clientId, getTokenDto.clientSecret);
  }
}
