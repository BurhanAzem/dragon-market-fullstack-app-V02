import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto, UpdateDiscountDto } from './discount.dto';

interface Discount {
  id: number;
  name: string;
  percentage: number;
  active: boolean;
}

@Injectable()
export class DiscountService {
  private discounts: Discount[] = [
    { id: 1, name: 'New Year Sale', percentage: 10, active: true },
    { id: 2, name: 'Clearance', percentage: 20, active: false },
  ];

  findAll(): Discount[] {
    return this.discounts;
  }

  findOne(id: number): Discount {
    const discount = this.discounts.find((d) => d.id === id);
    if (!discount) {
      throw new NotFoundException(`Discount #${id} not found`);
    }
    return discount;
  }

  create(dto: CreateDiscountDto): Discount {
    const id = this.discounts.length
      ? this.discounts[this.discounts.length - 1].id + 1
      : 1;
    const newDiscount: Discount = { id, ...dto };
    this.discounts.push(newDiscount);
    return newDiscount;
  }

  update(id: number, dto: UpdateDiscountDto): Discount {
    const discount = this.findOne(id);
    const updatedDiscount = { ...discount, ...dto };
    this.discounts = this.discounts.map((d) =>
      d.id === id ? updatedDiscount : d,
    );
    return updatedDiscount;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.discounts = this.discounts.filter((d) => d.id !== id);
    return { deleted: true };
  }
}
