import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierOrdersDto, UpdateSupplierOrdersDto } from './supplier-orders.dto';

interface SupplierOrder {
  id: number;
  supplierId: number;
  orderDate: string;
  total: number;
}

@Injectable()
export class SupplierOrdersService {
  private orders: SupplierOrder[] = [
    { id: 1, supplierId: 1, orderDate: '2025-01-30', total: 500 },
    { id: 2, supplierId: 2, orderDate: '2025-02-05', total: 750 },
  ];

  findAll(): SupplierOrder[] {
    return this.orders;
  }

  findOne(id: number): SupplierOrder {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`SupplierOrder #${id} not found`);
    }
    return order;
  }

  create(dto: CreateSupplierOrdersDto): SupplierOrder {
    const id = this.orders.length
      ? this.orders[this.orders.length - 1].id + 1
      : 1;
    const newOrder: SupplierOrder = { id, ...dto };
    this.orders.push(newOrder);
    return newOrder;
  }

  update(id: number, dto: UpdateSupplierOrdersDto): SupplierOrder {
    const order = this.findOne(id);
    const updatedOrder = { ...order, ...dto };
    this.orders = this.orders.map((o) => (o.id === id ? updatedOrder : o));
    return updatedOrder;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.orders = this.orders.filter((o) => o.id !== id);
    return { deleted: true };
  }
}
