import { Module } from '@nestjs/common';
import { RequiredProductsController } from './required-products.controller';
import { RequiredProductsService } from './required-products.service';

@Module({
  controllers: [RequiredProductsController],
  providers: [RequiredProductsService],
})
export class RequiredProductsModule {}
