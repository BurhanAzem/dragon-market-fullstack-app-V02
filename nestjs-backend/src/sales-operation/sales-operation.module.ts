import { Module } from '@nestjs/common';
import { SalesOperationController } from './sales-operation.controller';
import { SalesOperationService } from './sales-operation.service';

@Module({
  controllers: [SalesOperationController],
  providers: [SalesOperationService],
})
export class SalesOperationModule {}
