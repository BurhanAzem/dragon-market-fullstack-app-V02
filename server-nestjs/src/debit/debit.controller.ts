import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DebitService } from './debit.service';
import { CreateDebitDto, UpdateDebitDto } from './debit.dto';

@Controller('debits')
export class DebitController {
  constructor(private readonly debitService: DebitService) {}

  @Get()
  findAll() {
    return this.debitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debitService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateDebitDto) {
    return this.debitService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDebitDto) {
    return this.debitService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debitService.remove(+id);
  }
}
