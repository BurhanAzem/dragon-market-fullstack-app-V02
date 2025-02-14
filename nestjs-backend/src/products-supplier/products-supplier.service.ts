import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsSupplierDto, UpdateProductsSupplierDto } from './products-supplier.dto';

interface ProductsSupplier {
  id: number;
  productId: number;
  supplierId: number;
}

@Injectable()
export class ProductsSupplierService {
  private items: ProductsSupplier[] = [
    { id: 1, productId: 1, supplierId: 1 },
    { id: 2, productId: 2, supplierId: 2 },
  ];

  findAll(): ProductsSupplier[] {
    return this.items;
  }

  findOne(id: number): ProductsSupplier {
    const item = this.items.find((ps) => ps.id === id);
    if (!item) {
      throw new NotFoundException(`ProductsSupplier #${id} not found`);
    }
    return item;
  }

  create(dto: CreateProductsSupplierDto): ProductsSupplier {
    const id = this.items.length
      ? this.items[this.items.length - 1].id + 1
      : 1;
    const newItem: ProductsSupplier = { id, ...dto };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, dto: UpdateProductsSupplierDto): ProductsSupplier {
    const item = this.findOne(id);
    const updatedItem = { ...item, ...dto };
    this.items = this.items.map((ps) => (ps.id === id ? updatedItem : ps));
    return updatedItem;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.items = this.items.filter((ps) => ps.id !== id);
    return { deleted: true };
  }
}
