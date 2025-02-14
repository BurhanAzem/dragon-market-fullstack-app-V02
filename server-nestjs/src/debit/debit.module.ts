import { Module } from '@nestjs/common';
import { DebitController } from './debit.controller';
import { DebitService } from './debit.service';

@Module({
  controllers: [DebitController],
  providers: [DebitService],
})
export class DebitModule {}
