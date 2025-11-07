import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Logger, Query } from '@nestjs/common';
import { IdcsService } from './idcs.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetTokenDto } from '../auth/dto/get-token.dto';

@Controller('idcs')
export class IdcsController {
  private readonly logger = new Logger(IdcsController.name);
  constructor(private readonly idcs: IdcsService) {}

  @Post('token')
  @UseGuards(ApiKeyGuard)
  async getToken(@Body() getTokenDto: GetTokenDto) {
    return this.idcs.getTokenForApp(getTokenDto.clientId, getTokenDto.clientSecret);
  }

  @Get('users/:clientId')
  @UseGuards(ApiKeyGuard)
  async users(@Param('clientId') clientId: string, @Query('clientSecret') clientSecret: string) {
    return this.idcs.listUsers(clientId, clientSecret);
  }

  @Post('users')
  @UseGuards(ApiKeyGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`createUser called for app ${createUserDto.clientId}`);
    return this.idcs.createUser(createUserDto.clientId, createUserDto.clientSecret, createUserDto.payload);
  }

  @Put('users/:userId')
  @UseGuards(ApiKeyGuard)
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`updateUser called for app ${updateUserDto.clientId} user ${userId}`);
    return this.idcs.updateUser(updateUserDto.clientId, updateUserDto.clientSecret, userId, updateUserDto.payload);
  }

  @Delete('users/:userId')
  @UseGuards(ApiKeyGuard)
  async deleteUser(@Param('userId') userId: string, @Body() deleteUserDto: DeleteUserDto) {
    this.logger.log(`deleteUser called for app ${deleteUserDto.clientId} user ${userId}`);
    return this.idcs.deleteUser(deleteUserDto.clientId, deleteUserDto.clientSecret, userId);
  }
}
