import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductOperationDto, UpdateProductOperationDto } from './product-operation.dto';

interface ProductOperation {
  id: number;
  productId: number;
  operationType: string;
  quantity: number;
}

@Injectable()
export class ProductOperationService {
  private operations: ProductOperation[] = [
    { id: 1, productId: 1, operationType: 'IN', quantity: 100 },
    { id: 2, productId: 2, operationType: 'OUT', quantity: 5 },
  ];

  findAll(): ProductOperation[] {
    return this.operations;
  }

  findOne(id: number): ProductOperation {
    const op = this.operations.find((o) => o.id === id);
    if (!op) {
      throw new NotFoundException(`ProductOperation #${id} not found`);
    }
    return op;
  }

  create(dto: CreateProductOperationDto): ProductOperation {
    const id = this.operations.length
      ? this.operations[this.operations.length - 1].id + 1
      : 1;
    const newOp: ProductOperation = { id, ...dto };
    this.operations.push(newOp);
    return newOp;
  }

  update(id: number, dto: UpdateProductOperationDto): ProductOperation {
    const op = this.findOne(id);
    const updatedOp = { ...op, ...dto };
    this.operations = this.operations.map((o) =>
      o.id === id ? updatedOp : o,
    );
    return updatedOp;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.operations = this.operations.filter((o) => o.id !== id);
    return { deleted: true };
  }
}
