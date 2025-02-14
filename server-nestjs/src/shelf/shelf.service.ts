import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShelfDto, UpdateShelfDto } from './shelf.dto';

interface Shelf {
  id: number;
  name: string;
  location: string;
}

@Injectable()
export class ShelfService {
  private shelves: Shelf[] = [
    { id: 1, name: 'Shelf A', location: 'Warehouse 1' },
    { id: 2, name: 'Shelf B', location: 'Warehouse 2' },
  ];

  findAll(): Shelf[] {
    return this.shelves;
  }

  findOne(id: number): Shelf {
    const shelf = this.shelves.find((s) => s.id === id);
    if (!shelf) {
      throw new NotFoundException(`Shelf with id ${id} not found`);
    }
    return shelf;
  }

  create(data: CreateShelfDto): Shelf {
    const newId = this.shelves.length
      ? this.shelves[this.shelves.length - 1].id + 1
      : 1;
    const newShelf: Shelf = { id: newId, ...data };
    this.shelves.push(newShelf);
    return newShelf;
  }

  update(id: number, data: UpdateShelfDto): Shelf {
    const shelf = this.findOne(id);
    const updatedShelf = { ...shelf, ...data };
    this.shelves = this.shelves.map((s) => (s.id === id ? updatedShelf : s));
    return updatedShelf;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.shelves = this.shelves.filter((s) => s.id !== id);
    return { deleted: true };
  }
}
