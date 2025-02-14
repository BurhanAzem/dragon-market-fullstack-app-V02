import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

@Injectable()
export class EmployeeService {
  private employees: Employee[] = [
    { id: 1, name: 'John Smith', role: 'Sales', salary: 3000 },
    { id: 2, name: 'Jane Doe', role: 'Accountant', salary: 3500 },
  ];

  findAll(): Employee[] {
    return this.employees;
  }

  findOne(id: number): Employee {
    const employee = this.employees.find((emp) => emp.id === id);
    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return employee;
  }

  create(dto: CreateEmployeeDto): Employee {
    const id = this.employees.length
      ? this.employees[this.employees.length - 1].id + 1
      : 1;
    const newEmployee: Employee = { id, ...dto };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  update(id: number, dto: UpdateEmployeeDto): Employee {
    const employee = this.findOne(id);
    const updatedEmployee = { ...employee, ...dto };
    this.employees = this.employees.map((emp) =>
      emp.id === id ? updatedEmployee : emp,
    );
    return updatedEmployee;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.employees = this.employees.filter((emp) => emp.id !== id);
    return { deleted: true };
  }
}
