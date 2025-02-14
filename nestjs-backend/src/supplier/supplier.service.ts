import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

interface Supplier {
  id: number;
  name: string;
  contact: string;
}

@Injectable()
export class SupplierService {
  private suppliers: Supplier[] = [
    { id: 1, name: 'Acme Corp.', contact: 'contact@acme.com' },
    { id: 2, name: 'Global Supplies', contact: 'info@globalsupplies.com' },
  ];

  findAll(): Supplier[] {
    return this.suppliers;
  }

  findOne(id: number): Supplier {
    const supplier = this.suppliers.find((s) => s.id === id);
    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  create(data: CreateSupplierDto): Supplier {
    const newId = this.suppliers.length
      ? this.suppliers[this.suppliers.length - 1].id + 1
      : 1;
    const newSupplier: Supplier = { id: newId, ...data };
    this.suppliers.push(newSupplier);
    return newSupplier;
  }

  update(id: number, data: UpdateSupplierDto): Supplier {
    const supplier = this.findOne(id);
    const updatedSupplier = { ...supplier, ...data };
    this.suppliers = this.suppliers.map((s) => (s.id === id ? updatedSupplier : s));
    return updatedSupplier;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.suppliers = this.suppliers.filter((s) => s.id !== id);
    return { deleted: true };
  }
}
