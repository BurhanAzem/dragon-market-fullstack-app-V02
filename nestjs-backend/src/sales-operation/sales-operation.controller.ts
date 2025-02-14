import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SalesOperationService } from './sales-operation.service';
import { CreateSalesOperationDto, UpdateSalesOperationDto } from './sales-operation.dto';

@Controller('sales-operations')
export class SalesOperationController {
  constructor(private readonly soService: SalesOperationService) {}

  @Get()
  findAll() {
    return this.soService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSalesOperationDto) {
    return this.soService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalesOperationDto) {
    return this.soService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soService.remove(+id);
  }
}
