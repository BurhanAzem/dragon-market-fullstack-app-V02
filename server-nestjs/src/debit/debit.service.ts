import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebitDto, UpdateDebitDto } from './debit.dto';

interface Debit {
  id: number;
  amount: number;
  date: string;
  description: string;
}

@Injectable()
export class DebitService {
  private debits: Debit[] = [
    { id: 1, amount: 100, date: '2025-01-01', description: 'Office supplies' },
    { id: 2, amount: 250, date: '2025-02-10', description: 'Travel expenses' },
  ];

  findAll(): Debit[] {
    return this.debits;
  }

  findOne(id: number): Debit {
    const debit = this.debits.find((d) => d.id === id);
    if (!debit) {
      throw new NotFoundException(`Debit #${id} not found`);
    }
    return debit;
  }

  create(dto: CreateDebitDto): Debit {
    const id = this.debits.length
      ? this.debits[this.debits.length - 1].id + 1
      : 1;
    const newDebit: Debit = { id, ...dto };
    this.debits.push(newDebit);
    return newDebit;
  }

  update(id: number, dto: UpdateDebitDto): Debit {
    const debit = this.findOne(id);
    const updatedDebit = { ...debit, ...dto };
    this.debits = this.debits.map((d) => (d.id === id ? updatedDebit : d));
    return updatedDebit;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.debits = this.debits.filter((d) => d.id !== id);
    return { deleted: true };
  }
}
