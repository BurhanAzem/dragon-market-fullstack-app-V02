import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Injectable()
export class CategoryService {
  private categories: Category[] = [
    { id: 1, name: 'Stationery', description: 'Paper, pens, pencils...' },
    { id: 2, name: 'Electronics', description: 'Electronic gadgets, cables...' },
  ];

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: number): Category {
    const category = this.categories.find((cat) => cat.id === id);
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  create(dto: CreateCategoryDto): Category {
    const id = this.categories.length
      ? this.categories[this.categories.length - 1].id + 1
      : 1;
    const newCategory: Category = { id, ...dto };
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: number, dto: UpdateCategoryDto): Category {
    const category = this.findOne(id);
    const updatedCategory = { ...category, ...dto };
    this.categories = this.categories.map((cat) =>
      cat.id === id ? updatedCategory : cat,
    );
    return updatedCategory;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.categories = this.categories.filter((cat) => cat.id !== id);
    return { deleted: true };
  }
}
