import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductOperationService } from './product-operation.service';
import { CreateProductOperationDto, UpdateProductOperationDto } from './product-operation.dto';

@Controller('product-operations')
export class ProductOperationController {
  constructor(private readonly productOperationService: ProductOperationService) {}

  @Get()
  findAll() {
    return this.productOperationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOperationService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductOperationDto) {
    return this.productOperationService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductOperationDto) {
    return this.productOperationService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOperationService.remove(+id);
  }
}
