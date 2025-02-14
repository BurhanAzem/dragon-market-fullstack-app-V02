import { Module } from '@nestjs/common';
import { ProductOperationController } from './product-operation.controller';
import { ProductOperationService } from './product-operation.service';

@Module({
  controllers: [ProductOperationController],
  providers: [ProductOperationService],
})
export class ProductOperationModule {}
