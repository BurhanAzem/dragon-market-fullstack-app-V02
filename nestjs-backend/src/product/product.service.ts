import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Pen', price: 1.5 },
    { id: 2, name: 'Notebook', price: 3.25 },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto): Product {
    const newId = this.products.length
      ? this.products[this.products.length - 1].id + 1
      : 1;
    const newProduct: Product = { id: newId, ...data };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, data: UpdateProductDto): Product {
    const product = this.findOne(id);
    const updatedProduct = { ...product, ...data };
    this.products = this.products.map((p) => (p.id === id ? updatedProduct : p));
    return updatedProduct;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.products = this.products.filter((p) => p.id !== id);
    return { deleted: true };
  }
}
