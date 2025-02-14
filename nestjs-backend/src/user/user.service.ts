import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';

interface User {
  id: number;
  name: string;
  email: string;
  password: string; // hashed by AuthService when registering
}

@Injectable()
export class UserService {
  // For demo, we store all in-memory
  private users: User[] = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      password: 'b0', // example
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
      password: 'b0', // example
    },
  ];

  findAll(): Omit<User, 'password'>[] {
    // Return all but omit password
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // Omit password
    const { password, ...rest } = user;
    return rest;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  create(data: CreateUserDto): Omit<User, 'password'> {
    const newId = this.users.length
      ? this.users[this.users.length - 1].id + 1
      : 1;
    const newUser: User = {
      id: newId,
      ...data, // includes password
    };
    this.users.push(newUser);
    const { password, ...rest } = newUser;
    return rest;
  }

  update(id: number, data: UpdateUserDto): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = { ...user, ...data };
    this.users = this.users.map((u) => (u.id === id ? updatedUser : u));
    const { password, ...rest } = updatedUser;
    return rest;
  }

  remove(id: number): { deleted: boolean } {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users = this.users.filter((u) => u.id !== id);
    return { deleted: true };
  }
}
