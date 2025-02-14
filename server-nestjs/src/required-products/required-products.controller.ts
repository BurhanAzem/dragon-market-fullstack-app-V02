import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RequiredProductsService } from './required-products.service';
import { CreateRequiredProductsDto, UpdateRequiredProductsDto } from './required-products.dto';

@Controller('required-products')
export class RequiredProductsController {
  constructor(private readonly rpService: RequiredProductsService) {}

  @Get()
  findAll() {
    return this.rpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateRequiredProductsDto) {
    return this.rpService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequiredProductsDto) {
    return this.rpService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rpService.remove(+id);
  }
}
