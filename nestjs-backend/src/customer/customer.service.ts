import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

interface Customer {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class CustomerService {
  private customers: Customer[] = [
    { id: 1, name: 'Alice Anderson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Brown', email: 'bob@example.com' },
  ];

  findAll(): Customer[] {
    return this.customers;
  }

  findOne(id: number): Customer {
    const customer = this.customers.find((c) => c.id === id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  findByEmail(email: string): Customer | undefined {
    return this.customers.find((c) => c.email === email);
  }

  create(dto: CreateCustomerDto): Customer {
    const id = this.customers.length
      ? this.customers[this.customers.length - 1].id + 1
      : 1;
    const newCustomer: Customer = { id, ...dto };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  update(id: number, dto: UpdateCustomerDto): Customer {
    const customer = this.findOne(id);
    const updatedCustomer = { ...customer, ...dto };
    this.customers = this.customers.map((c) =>
      c.id === id ? updatedCustomer : c,
    );
    return updatedCustomer;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.customers = this.customers.filter((c) => c.id !== id);
    return { deleted: true };
  }
}
