import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SupplierOrdersService } from './supplier-orders.service';
import { CreateSupplierOrdersDto, UpdateSupplierOrdersDto } from './supplier-orders.dto';

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly soService: SupplierOrdersService) {}

  @Get()
  findAll() {
    return this.soService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSupplierOrdersDto) {
    return this.soService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierOrdersDto) {
    return this.soService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soService.remove(+id);
  }
}
