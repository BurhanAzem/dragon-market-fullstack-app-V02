import { Module } from '@nestjs/common';
import { ProductsSupplierController } from './products-supplier.controller';
import { ProductsSupplierService } from './products-supplier.service';

@Module({
  controllers: [ProductsSupplierController],
  providers: [ProductsSupplierService],
})
export class ProductsSupplierModule {}
