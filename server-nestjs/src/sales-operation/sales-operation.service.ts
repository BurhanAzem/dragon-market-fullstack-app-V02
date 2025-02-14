import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalesOperationDto, UpdateSalesOperationDto } from './sales-operation.dto';

interface SalesOperation {
  id: number;
  productId: number;
  quantity: number;
  saleDate: string;
}

@Injectable()
export class SalesOperationService {
  private sales: SalesOperation[] = [
    { id: 1, productId: 1, quantity: 2, saleDate: '2025-01-10' },
    { id: 2, productId: 2, quantity: 1, saleDate: '2025-01-12' },
  ];

  findAll(): SalesOperation[] {
    return this.sales;
  }

  findOne(id: number): SalesOperation {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) {
      throw new NotFoundException(`SalesOperation #${id} not found`);
    }
    return sale;
  }

  create(dto: CreateSalesOperationDto): SalesOperation {
    const id = this.sales.length
      ? this.sales[this.sales.length - 1].id + 1
      : 1;
    const newSale: SalesOperation = { id, ...dto };
    this.sales.push(newSale);
    return newSale;
  }

  update(id: number, dto: UpdateSalesOperationDto): SalesOperation {
    const sale = this.findOne(id);
    const updatedSale = { ...sale, ...dto };
    this.sales = this.sales.map((s) => (s.id === id ? updatedSale : s));
    return updatedSale;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.sales = this.sales.filter((s) => s.id !== id);
    return { deleted: true };
  }
}
