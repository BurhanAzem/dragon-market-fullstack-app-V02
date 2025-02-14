import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductsSupplierService } from './products-supplier.service';
import { CreateProductsSupplierDto, UpdateProductsSupplierDto } from './products-supplier.dto';

@Controller('products-suppliers')
export class ProductsSupplierController {
  constructor(private readonly psService: ProductsSupplierService) {}

  @Get()
  findAll() {
    return this.psService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductsSupplierDto) {
    return this.psService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductsSupplierDto) {
    return this.psService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psService.remove(+id);
  }
}
