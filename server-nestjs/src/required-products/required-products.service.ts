import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequiredProductsDto, UpdateRequiredProductsDto } from './required-products.dto';

interface RequiredProducts {
  id: number;
  projectId: number;
  productId: number;
  quantity: number;
}

@Injectable()
export class RequiredProductsService {
  private items: RequiredProducts[] = [
    { id: 1, projectId: 1, productId: 1, quantity: 10 },
    { id: 2, projectId: 2, productId: 2, quantity: 15 },
  ];

  findAll(): RequiredProducts[] {
    return this.items;
  }

  findOne(id: number): RequiredProducts {
    const item = this.items.find((rp) => rp.id === id);
    if (!item) {
      throw new NotFoundException(`RequiredProducts #${id} not found`);
    }
    return item;
  }

  create(dto: CreateRequiredProductsDto): RequiredProducts {
    const id = this.items.length
      ? this.items[this.items.length - 1].id + 1
      : 1;
    const newItem: RequiredProducts = { id, ...dto };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, dto: UpdateRequiredProductsDto): RequiredProducts {
    const item = this.findOne(id);
    const updatedItem = { ...item, ...dto };
    this.items = this.items.map((rp) => (rp.id === id ? updatedItem : rp));
    return updatedItem;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.items = this.items.filter((rp) => rp.id !== id);
    return { deleted: true };
  }
}
