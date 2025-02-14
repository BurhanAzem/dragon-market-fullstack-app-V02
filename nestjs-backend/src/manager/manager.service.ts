import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManagerDto, UpdateManagerDto } from './manager.dto';

interface Manager {
  id: number;
  name: string;
  department: string;
}

@Injectable()
export class ManagerService {
  private managers: Manager[] = [
    { id: 1, name: 'Sarah Connor', department: 'Operations' },
    { id: 2, name: 'Peter Parker', department: 'Development' },
  ];

  findAll(): Manager[] {
    return this.managers;
  }

  findOne(id: number): Manager {
    const manager = this.managers.find((m) => m.id === id);
    if (!manager) {
      throw new NotFoundException(`Manager #${id} not found`);
    }
    return manager;
  }

  create(dto: CreateManagerDto): Manager {
    const id = this.managers.length
      ? this.managers[this.managers.length - 1].id + 1
      : 1;
    const newManager: Manager = { id, ...dto };
    this.managers.push(newManager);
    return newManager;
  }

  update(id: number, dto: UpdateManagerDto): Manager {
    const manager = this.findOne(id);
    const updatedManager = { ...manager, ...dto };
    this.managers = this.managers.map((m) =>
      m.id === id ? updatedManager : m,
    );
    return updatedManager;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.managers = this.managers.filter((m) => m.id !== id);
    return { deleted: true };
  }
}
