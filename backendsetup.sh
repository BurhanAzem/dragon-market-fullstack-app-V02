#!/usr/bin/env bash

# --- Step 1: Create project folder ---
mkdir nestjs-backend
cd nestjs-backend

echo "Initializing NestJS project in $(pwd)..."

# --- Step 2: Initialize package.json ---
npm init -y

# --- Step 3: Install NestJS and additional auth dependencies ---
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs @nestjs/cli typescript ts-node ts-node-dev
npm install @nestjs/jwt jsonwebtoken bcrypt
# ^ 'jsonwebtoken' is a peer dep for @nestjs/jwt
# 'bcrypt' for hashing passwords

# --- Step 4: Create Nest configuration files ---

# Create tsconfig.json
cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create nest-cli.json
cat <<EOF > nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
EOF

# Overwrite package.json with updated scripts (start, start:dev, etc.)
cat <<EOF > package.json
{
  "name": "nestjs-backend",
  "version": "1.0.0",
  "description": "NestJS backend (with auth) including all listed entities",
  "scripts": {
    "start": "ts-node src/main.ts",
    "start:dev": "ts-node-dev --respawn --transpileOnly src/main.ts",
    "build": "tsc -p tsconfig.json",
    "start:prod": "node dist/main.js"
  },
  "dependencies": {
    "@nestjs/common": "^9.0.0",
    "@nestjs/core": "^9.0.0",
    "@nestjs/platform-express": "^9.0.0",
    "@nestjs/jwt": "^9.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^9.0.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }
}
EOF

# --- Step 5: Create source folder and files ---
mkdir src

# main.ts
cat <<EOF > src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('NestJS server is running on http://localhost:3000');
}
bootstrap();
EOF

########################################
# Root app.module.ts
########################################
cat <<EOF > src/app.module.ts
import { Module } from '@nestjs/common';

// Import all feature modules (including Auth)
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { CustomerModule } from './customer/customer.module';
import { DebitModule } from './debit/debit.module';
import { DiscountModule } from './discount/discount.module';
import { EmployeeModule } from './employee/employee.module';
import { ManagerModule } from './manager/manager.module';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { ProductOperationModule } from './product-operation/product-operation.module';
import { ProductsSupplierModule } from './products-supplier/products-supplier.module';
import { ProjectModule } from './project/project.module';
import { ProjectMembershipModule } from './project-membership/project-membership.module';
import { RequiredProductsModule } from './required-products/required-products.module';
import { SalesOperationModule } from './sales-operation/sales-operation.module';
import { ShelfModule } from './shelf/shelf.module';
import { SupplierModule } from './supplier/supplier.module';
import { SupplierOrdersModule } from './supplier-orders/supplier-orders.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    CommentModule,
    CustomerModule,
    DebitModule,
    DiscountModule,
    EmployeeModule,
    ManagerModule,
    MemberModule,
    ProductModule,
    ProductOperationModule,
    ProductsSupplierModule,
    ProjectModule,
    ProjectMembershipModule,
    RequiredProductsModule,
    SalesOperationModule,
    ShelfModule,
    SupplierModule,
    SupplierOrdersModule,
    TicketModule,
    UserModule,
  ],
})
export class AppModule {}
EOF

###############################################################################
# AUTH MODULE (for login & register)
###############################################################################
mkdir -p src/auth

# auth.module.ts
cat <<EOF > src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // We'll inject UserService from here

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'MY_SECRET_KEY', // In real apps, use env var
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
EOF

# auth.service.ts
cat <<EOF > src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user with email already exists
    const existingUser = this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // Create user
    const newUser = this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });
    return { message: 'User registered', user: newUser };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Create JWT
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { message: 'Login successful', token };
  }
}
EOF

# auth.controller.ts
cat <<EOF > src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
EOF

# auth.dto.ts
cat <<EOF > src/auth/auth.dto.ts
export class RegisterDto {
  name: string;
  email: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}
EOF

###############################################################################
# ALL OTHER MODULES / ENTITIES
# (Same in-memory CRUD approach)
###############################################################################
# 1) CATEGORY
mkdir -p src/category
cat <<EOF > src/category/category.module.ts
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
EOF

cat <<EOF > src/category/category.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
EOF

cat <<EOF > src/category/category.service.ts
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
      throw new NotFoundException(\`Category #\${id} not found\`);
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
EOF

cat <<EOF > src/category/category.dto.ts
export class CreateCategoryDto {
  name: string;
  description: string;
}

export class UpdateCategoryDto {
  name?: string;
  description?: string;
}
EOF

# 2) COMMENT
mkdir -p src/comment
cat <<EOF > src/comment/comment.module.ts
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
EOF

cat <<EOF > src/comment/comment.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
EOF

cat <<EOF > src/comment/comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

interface Comment {
  id: number;
  text: string;
  author: string;
}

@Injectable()
export class CommentService {
  private comments: Comment[] = [
    { id: 1, text: 'Great product!', author: 'Alice' },
    { id: 2, text: 'Needs improvement.', author: 'Bob' },
  ];

  findAll(): Comment[] {
    return this.comments;
  }

  findOne(id: number): Comment {
    const comment = this.comments.find((c) => c.id === id);
    if (!comment) {
      throw new NotFoundException(\`Comment #\${id} not found\`);
    }
    return comment;
  }

  create(dto: CreateCommentDto): Comment {
    const id = this.comments.length
      ? this.comments[this.comments.length - 1].id + 1
      : 1;
    const newComment: Comment = { id, ...dto };
    this.comments.push(newComment);
    return newComment;
  }

  update(id: number, dto: UpdateCommentDto): Comment {
    const comment = this.findOne(id);
    const updatedComment = { ...comment, ...dto };
    this.comments = this.comments.map((c) => (c.id === id ? updatedComment : c));
    return updatedComment;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.comments = this.comments.filter((c) => c.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/comment/comment.dto.ts
export class CreateCommentDto {
  text: string;
  author: string;
}

export class UpdateCommentDto {
  text?: string;
  author?: string;
}
EOF

# 3) CUSTOMER
mkdir -p src/customer
cat <<EOF > src/customer/customer.module.ts
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
EOF

cat <<EOF > src/customer/customer.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
EOF

cat <<EOF > src/customer/customer.service.ts
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
      throw new NotFoundException(\`Customer #\${id} not found\`);
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
EOF

cat <<EOF > src/customer/customer.dto.ts
export class CreateCustomerDto {
  name: string;
  email: string;
}

export class UpdateCustomerDto {
  name?: string;
  email?: string;
}
EOF

# 4) DEBIT
mkdir -p src/debit
cat <<EOF > src/debit/debit.module.ts
import { Module } from '@nestjs/common';
import { DebitController } from './debit.controller';
import { DebitService } from './debit.service';

@Module({
  controllers: [DebitController],
  providers: [DebitService],
})
export class DebitModule {}
EOF

cat <<EOF > src/debit/debit.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DebitService } from './debit.service';
import { CreateDebitDto, UpdateDebitDto } from './debit.dto';

@Controller('debits')
export class DebitController {
  constructor(private readonly debitService: DebitService) {}

  @Get()
  findAll() {
    return this.debitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debitService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateDebitDto) {
    return this.debitService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDebitDto) {
    return this.debitService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debitService.remove(+id);
  }
}
EOF

cat <<EOF > src/debit/debit.service.ts
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
      throw new NotFoundException(\`Debit #\${id} not found\`);
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
EOF

cat <<EOF > src/debit/debit.dto.ts
export class CreateDebitDto {
  amount: number;
  date: string;
  description: string;
}

export class UpdateDebitDto {
  amount?: number;
  date?: string;
  description?: string;
}
EOF

# 5) DISCOUNT
mkdir -p src/discount
cat <<EOF > src/discount/discount.module.ts
import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
EOF

cat <<EOF > src/discount/discount.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './discount.dto';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateDiscountDto) {
    return this.discountService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    return this.discountService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
EOF

cat <<EOF > src/discount/discount.service.ts
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
      throw new NotFoundException(\`Discount #\${id} not found\`);
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
EOF

cat <<EOF > src/discount/discount.dto.ts
export class CreateDiscountDto {
  name: string;
  percentage: number;
  active: boolean;
}

export class UpdateDiscountDto {
  name?: string;
  percentage?: number;
  active?: boolean;
}
EOF

# 6) EMPLOYEE
mkdir -p src/employee
cat <<EOF > src/employee/employee.module.ts
import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
EOF

cat <<EOF > src/employee/employee.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
EOF

cat <<EOF > src/employee/employee.service.ts
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
      throw new NotFoundException(\`Employee #\${id} not found\`);
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
EOF

cat <<EOF > src/employee/employee.dto.ts
export class CreateEmployeeDto {
  name: string;
  role: string;
  salary: number;
}

export class UpdateEmployeeDto {
  name?: string;
  role?: string;
  salary?: number;
}
EOF

# 7) MANAGER
mkdir -p src/manager
cat <<EOF > src/manager/manager.module.ts
import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
EOF

cat <<EOF > src/manager/manager.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto, UpdateManagerDto } from './manager.dto';

@Controller('managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateManagerDto) {
    return this.managerService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateManagerDto) {
    return this.managerService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managerService.remove(+id);
  }
}
EOF

cat <<EOF > src/manager/manager.service.ts
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
      throw new NotFoundException(\`Manager #\${id} not found\`);
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
EOF

cat <<EOF > src/manager/manager.dto.ts
export class CreateManagerDto {
  name: string;
  department: string;
}

export class UpdateManagerDto {
  name?: string;
  department?: string;
}
EOF

# 8) MEMBER
mkdir -p src/member
cat <<EOF > src/member/member.module.ts
import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
EOF

cat <<EOF > src/member/member.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateMemberDto) {
    return this.memberService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.memberService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
EOF

cat <<EOF > src/member/member.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';

interface Member {
  id: number;
  name: string;
  joinedAt: string;
}

@Injectable()
export class MemberService {
  private members: Member[] = [
    { id: 1, name: 'Chris Evans', joinedAt: '2025-01-15' },
    { id: 2, name: 'Mark Ruffalo', joinedAt: '2025-01-20' },
  ];

  findAll(): Member[] {
    return this.members;
  }

  findOne(id: number): Member {
    const member = this.members.find((m) => m.id === id);
    if (!member) {
      throw new NotFoundException(\`Member #\${id} not found\`);
    }
    return member;
  }

  create(dto: CreateMemberDto): Member {
    const id = this.members.length
      ? this.members[this.members.length - 1].id + 1
      : 1;
    const newMember: Member = { id, ...dto };
    this.members.push(newMember);
    return newMember;
  }

  update(id: number, dto: UpdateMemberDto): Member {
    const member = this.findOne(id);
    const updatedMember = { ...member, ...dto };
    this.members = this.members.map((m) => (m.id === id ? updatedMember : m));
    return updatedMember;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.members = this.members.filter((m) => m.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/member/member.dto.ts
export class CreateMemberDto {
  name: string;
  joinedAt: string; // or Date
}

export class UpdateMemberDto {
  name?: string;
  joinedAt?: string; // or Date
}
EOF

# 9) PRODUCT
mkdir -p src/product
cat <<EOF > src/product/product.module.ts
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
EOF

cat <<EOF > src/product/product.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
EOF

cat <<EOF > src/product/product.service.ts
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
      throw new NotFoundException(\`Product #\${id} not found\`);
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
EOF

cat <<EOF > src/product/product.dto.ts
export class CreateProductDto {
  name: string;
  price: number;
}

export class UpdateProductDto {
  name?: string;
  price?: number;
}
EOF

# 10) PRODUCT OPERATION
mkdir -p src/product-operation
cat <<EOF > src/product-operation/product-operation.module.ts
import { Module } from '@nestjs/common';
import { ProductOperationController } from './product-operation.controller';
import { ProductOperationService } from './product-operation.service';

@Module({
  controllers: [ProductOperationController],
  providers: [ProductOperationService],
})
export class ProductOperationModule {}
EOF

cat <<EOF > src/product-operation/product-operation.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductOperationService } from './product-operation.service';
import { CreateProductOperationDto, UpdateProductOperationDto } from './product-operation.dto';

@Controller('product-operations')
export class ProductOperationController {
  constructor(private readonly productOperationService: ProductOperationService) {}

  @Get()
  findAll() {
    return this.productOperationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOperationService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductOperationDto) {
    return this.productOperationService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductOperationDto) {
    return this.productOperationService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOperationService.remove(+id);
  }
}
EOF

cat <<EOF > src/product-operation/product-operation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductOperationDto, UpdateProductOperationDto } from './product-operation.dto';

interface ProductOperation {
  id: number;
  productId: number;
  operationType: string;
  quantity: number;
}

@Injectable()
export class ProductOperationService {
  private operations: ProductOperation[] = [
    { id: 1, productId: 1, operationType: 'IN', quantity: 100 },
    { id: 2, productId: 2, operationType: 'OUT', quantity: 5 },
  ];

  findAll(): ProductOperation[] {
    return this.operations;
  }

  findOne(id: number): ProductOperation {
    const op = this.operations.find((o) => o.id === id);
    if (!op) {
      throw new NotFoundException(\`ProductOperation #\${id} not found\`);
    }
    return op;
  }

  create(dto: CreateProductOperationDto): ProductOperation {
    const id = this.operations.length
      ? this.operations[this.operations.length - 1].id + 1
      : 1;
    const newOp: ProductOperation = { id, ...dto };
    this.operations.push(newOp);
    return newOp;
  }

  update(id: number, dto: UpdateProductOperationDto): ProductOperation {
    const op = this.findOne(id);
    const updatedOp = { ...op, ...dto };
    this.operations = this.operations.map((o) =>
      o.id === id ? updatedOp : o,
    );
    return updatedOp;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.operations = this.operations.filter((o) => o.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/product-operation/product-operation.dto.ts
export class CreateProductOperationDto {
  productId: number;
  operationType: string; // e.g. "IN", "OUT", "ADJUSTMENT"
  quantity: number;
}

export class UpdateProductOperationDto {
  productId?: number;
  operationType?: string;
  quantity?: number;
}
EOF

# 11) PRODUCTS SUPPLIER
mkdir -p src/products-supplier
cat <<EOF > src/products-supplier/products-supplier.module.ts
import { Module } from '@nestjs/common';
import { ProductsSupplierController } from './products-supplier.controller';
import { ProductsSupplierService } from './products-supplier.service';

@Module({
  controllers: [ProductsSupplierController],
  providers: [ProductsSupplierService],
})
export class ProductsSupplierModule {}
EOF

cat <<EOF > src/products-supplier/products-supplier.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductsSupplierService } from './products-supplier.service';
import { CreateProductsSupplierDto, UpdateProductsSupplierDto } from './products-supplier.dto';

@Controller('products-suppliers')
export class ProductsSupplierController {
  constructor(private readonly psService: ProductsSupplierService) {}

  @Get()
  findAll() {
    return this.psService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductsSupplierDto) {
    return this.psService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductsSupplierDto) {
    return this.psService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psService.remove(+id);
  }
}
EOF

cat <<EOF > src/products-supplier/products-supplier.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsSupplierDto, UpdateProductsSupplierDto } from './products-supplier.dto';

interface ProductsSupplier {
  id: number;
  productId: number;
  supplierId: number;
}

@Injectable()
export class ProductsSupplierService {
  private items: ProductsSupplier[] = [
    { id: 1, productId: 1, supplierId: 1 },
    { id: 2, productId: 2, supplierId: 2 },
  ];

  findAll(): ProductsSupplier[] {
    return this.items;
  }

  findOne(id: number): ProductsSupplier {
    const item = this.items.find((ps) => ps.id === id);
    if (!item) {
      throw new NotFoundException(\`ProductsSupplier #\${id} not found\`);
    }
    return item;
  }

  create(dto: CreateProductsSupplierDto): ProductsSupplier {
    const id = this.items.length
      ? this.items[this.items.length - 1].id + 1
      : 1;
    const newItem: ProductsSupplier = { id, ...dto };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, dto: UpdateProductsSupplierDto): ProductsSupplier {
    const item = this.findOne(id);
    const updatedItem = { ...item, ...dto };
    this.items = this.items.map((ps) => (ps.id === id ? updatedItem : ps));
    return updatedItem;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.items = this.items.filter((ps) => ps.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/products-supplier/products-supplier.dto.ts
export class CreateProductsSupplierDto {
  productId: number;
  supplierId: number;
}

export class UpdateProductsSupplierDto {
  productId?: number;
  supplierId?: number;
}
EOF

# 12) PROJECT
mkdir -p src/project
cat <<EOF > src/project/project.module.ts
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
EOF

cat <<EOF > src/project/project.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
EOF

cat <<EOF > src/project/project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
}

@Injectable()
export class ProjectService {
  private projects: Project[] = [
    { id: 1, name: 'Warehouse Upgrade', description: 'Upgrade storage area', startDate: '2025-01-01' },
    { id: 2, name: 'New Product Launch', description: 'Launch new product line', startDate: '2025-01-15' },
  ];

  findAll(): Project[] {
    return this.projects;
  }

  findOne(id: number): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(\`Project #\${id} not found\`);
    }
    return project;
  }

  create(dto: CreateProjectDto): Project {
    const id = this.projects.length
      ? this.projects[this.projects.length - 1].id + 1
      : 1;
    const newProject: Project = { id, ...dto };
    this.projects.push(newProject);
    return newProject;
  }

  update(id: number, dto: UpdateProjectDto): Project {
    const project = this.findOne(id);
    const updatedProject = { ...project, ...dto };
    this.projects = this.projects.map((p) => (p.id === id ? updatedProject : p));
    return updatedProject;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.projects = this.projects.filter((p) => p.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/project/project.dto.ts
export class CreateProjectDto {
  name: string;
  description: string;
  startDate: string; // or Date
}

export class UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: string; // or Date
}
EOF

# 13) PROJECT MEMBERSHIP
mkdir -p src/project-membership
cat <<EOF > src/project-membership/project-membership.module.ts
import { Module } from '@nestjs/common';
import { ProjectMembershipController } from './project-membership.controller';
import { ProjectMembershipService } from './project-membership.service';

@Module({
  controllers: [ProjectMembershipController],
  providers: [ProjectMembershipService],
})
export class ProjectMembershipModule {}
EOF

cat <<EOF > src/project-membership/project-membership.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProjectMembershipService } from './project-membership.service';
import { CreateProjectMembershipDto, UpdateProjectMembershipDto } from './project-membership.dto';

@Controller('project-memberships')
export class ProjectMembershipController {
  constructor(private readonly pmService: ProjectMembershipService) {}

  @Get()
  findAll() {
    return this.pmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pmService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProjectMembershipDto) {
[O    return this.pmService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectMembershipDto) {
    return this.pmService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pmService.remove(+id);
  }
}
EOF

cat <<EOF > src/project-membership/project-membership.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectMembershipDto, UpdateProjectMembershipDto } from './project-membership.dto';

interface ProjectMembership {
  id: number;
  projectId: number;
  userId: number;
  role: string;
}

@Injectable()
export class ProjectMembershipService {
  private memberships: ProjectMembership[] = [
    { id: 1, projectId: 1, userId: 1, role: 'Owner' },
    { id: 2, projectId: 2, userId: 2, role: 'Contributor' },
  ];

  findAll(): ProjectMembership[] {
    return this.memberships;
  }

  findOne(id: number): ProjectMembership {
    const membership = this.memberships.find((pm) => pm.id === id);
    if (!membership) {
      throw new NotFoundException(\`ProjectMembership #\${id} not found\`);
    }
    return membership;
  }

  create(dto: CreateProjectMembershipDto): ProjectMembership {
    const id = this.memberships.length
      ? this.memberships[this.memberships.length - 1].id + 1
      : 1;
    const newMembership: ProjectMembership = { id, ...dto };
    this.memberships.push(newMembership);
    return newMembership;
  }

  update(id: number, dto: UpdateProjectMembershipDto): ProjectMembership {
    const membership = this.findOne(id);
    const updatedMembership = { ...membership, ...dto };
    this.memberships = this.memberships.map((pm) =>
      pm.id === id ? updatedMembership : pm,
    );
    return updatedMembership;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.memberships = this.memberships.filter((pm) => pm.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/project-membership/project-membership.dto.ts
export class CreateProjectMembershipDto {
  projectId: number;
  userId: number;
  role: string;
}

export class UpdateProjectMembershipDto {
  projectId?: number;
  userId?: number;
  role?: string;
}
EOF

# 14) REQUIRED PRODUCTS
mkdir -p src/required-products
cat <<EOF > src/required-products/required-products.module.ts
import { Module } from '@nestjs/common';
import { RequiredProductsController } from './required-products.controller';
import { RequiredProductsService } from './required-products.service';

@Module({
  controllers: [RequiredProductsController],
  providers: [RequiredProductsService],
})
export class RequiredProductsModule {}
EOF

cat <<EOF > src/required-products/required-products.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RequiredProductsService } from './required-products.service';
import { CreateRequiredProductsDto, UpdateRequiredProductsDto } from './required-products.dto';

@Controller('required-products')
export class RequiredProductsController {
  constructor(private readonly rpService: RequiredProductsService) {}

  @Get()
  findAll() {
    return this.rpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateRequiredProductsDto) {
    return this.rpService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequiredProductsDto) {
    return this.rpService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rpService.remove(+id);
  }
}
EOF

cat <<EOF > src/required-products/required-products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequiredProductsDto, UpdateRequiredProductsDto } from './required-products.dto';

interface RequiredProducts {
  id: number;
  projectId: number;
  productId: number;
  quantity: number;
}

@Injectable()
export class RequiredProductsService {
  private items: RequiredProducts[] = [
    { id: 1, projectId: 1, productId: 1, quantity: 10 },
    { id: 2, projectId: 2, productId: 2, quantity: 15 },
  ];

  findAll(): RequiredProducts[] {
    return this.items;
  }

  findOne(id: number): RequiredProducts {
    const item = this.items.find((rp) => rp.id === id);
    if (!item) {
      throw new NotFoundException(\`RequiredProducts #\${id} not found\`);
    }
    return item;
  }

  create(dto: CreateRequiredProductsDto): RequiredProducts {
    const id = this.items.length
      ? this.items[this.items.length - 1].id + 1
      : 1;
    const newItem: RequiredProducts = { id, ...dto };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, dto: UpdateRequiredProductsDto): RequiredProducts {
    const item = this.findOne(id);
    const updatedItem = { ...item, ...dto };
    this.items = this.items.map((rp) => (rp.id === id ? updatedItem : rp));
    return updatedItem;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.items = this.items.filter((rp) => rp.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/required-products/required-products.dto.ts
export class CreateRequiredProductsDto {
  projectId: number;
  productId: number;
  quantity: number;
}

export class UpdateRequiredProductsDto {
  projectId?: number;
  productId?: number;
  quantity?: number;
}
EOF

# 15) SALES OPERATION
mkdir -p src/sales-operation
cat <<EOF > src/sales-operation/sales-operation.module.ts
import { Module } from '@nestjs/common';
import { SalesOperationController } from './sales-operation.controller';
import { SalesOperationService } from './sales-operation.service';

@Module({
  controllers: [SalesOperationController],
  providers: [SalesOperationService],
})
export class SalesOperationModule {}
EOF

cat <<EOF > src/sales-operation/sales-operation.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SalesOperationService } from './sales-operation.service';
import { CreateSalesOperationDto, UpdateSalesOperationDto } from './sales-operation.dto';

@Controller('sales-operations')
export class SalesOperationController {
  constructor(private readonly soService: SalesOperationService) {}

  @Get()
  findAll() {
    return this.soService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSalesOperationDto) {
    return this.soService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalesOperationDto) {
    return this.soService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soService.remove(+id);
  }
}
EOF

cat <<EOF > src/sales-operation/sales-operation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalesOperationDto, UpdateSalesOperationDto } from './sales-operation.dto';

interface SalesOperation {
  id: number;
  productId: number;
  quantity: number;
  saleDate: string;
}

@Injectable()
export class SalesOperationService {
  private sales: SalesOperation[] = [
    { id: 1, productId: 1, quantity: 2, saleDate: '2025-01-10' },
    { id: 2, productId: 2, quantity: 1, saleDate: '2025-01-12' },
  ];

  findAll(): SalesOperation[] {
    return this.sales;
  }

  findOne(id: number): SalesOperation {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) {
      throw new NotFoundException(\`SalesOperation #\${id} not found\`);
    }
    return sale;
  }

  create(dto: CreateSalesOperationDto): SalesOperation {
    const id = this.sales.length
      ? this.sales[this.sales.length - 1].id + 1
      : 1;
    const newSale: SalesOperation = { id, ...dto };
    this.sales.push(newSale);
    return newSale;
  }

  update(id: number, dto: UpdateSalesOperationDto): SalesOperation {
    const sale = this.findOne(id);
    const updatedSale = { ...sale, ...dto };
    this.sales = this.sales.map((s) => (s.id === id ? updatedSale : s));
    return updatedSale;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.sales = this.sales.filter((s) => s.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/sales-operation/sales-operation.dto.ts
export class CreateSalesOperationDto {
  productId: number;
  quantity: number;
  saleDate: string; // or Date
}

export class UpdateSalesOperationDto {
  productId?: number;
  quantity?: number;
  saleDate?: string; // or Date
}
EOF

# 16) SHELF
mkdir -p src/shelf
cat <<EOF > src/shelf/shelf.module.ts
import { Module } from '@nestjs/common';
import { ShelfController } from './shelf.controller';
import { ShelfService } from './shelf.service';

@Module({
  controllers: [ShelfController],
  providers: [ShelfService],
})
export class ShelfModule {}
EOF

cat <<EOF > src/shelf/shelf.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { CreateShelfDto, UpdateShelfDto } from './shelf.dto';

@Controller('shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Get()
  findAll() {
    return this.shelfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shelfService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateShelfDto) {
    return this.shelfService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShelfDto) {
    return this.shelfService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shelfService.remove(+id);
  }
}
EOF

cat <<EOF > src/shelf/shelf.service.ts
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
      throw new NotFoundException(\`Shelf with id \${id} not found\`);
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
EOF

cat <<EOF > src/shelf/shelf.dto.ts
export class CreateShelfDto {
  name: string;
  location: string;
}

export class UpdateShelfDto {
  name?: string;
  location?: string;
}
EOF

# 17) SUPPLIER
mkdir -p src/supplier
cat <<EOF > src/supplier/supplier.module.ts
import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
EOF

cat <<EOF > src/supplier/supplier.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.supplierService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.supplierService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.remove(+id);
  }
}
EOF

cat <<EOF > src/supplier/supplier.service.ts
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
      throw new NotFoundException(\`Supplier with id \${id} not found\`);
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
EOF

cat <<EOF > src/supplier/supplier.dto.ts
export class CreateSupplierDto {
  name: string;
  contact: string;
}

export class UpdateSupplierDto {
  name?: string;
  contact?: string;
}
EOF

# 18) SUPPLIER ORDERS
mkdir -p src/supplier-orders
cat <<EOF > src/supplier-orders/supplier-orders.module.ts
import { Module } from '@nestjs/common';
import { SupplierOrdersController } from './supplier-orders.controller';
import { SupplierOrdersService } from './supplier-orders.service';

@Module({
  controllers: [SupplierOrdersController],
  providers: [SupplierOrdersService],
})
export class SupplierOrdersModule {}
EOF

cat <<EOF > src/supplier-orders/supplier-orders.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SupplierOrdersService } from './supplier-orders.service';
import { CreateSupplierOrdersDto, UpdateSupplierOrdersDto } from './supplier-orders.dto';

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly soService: SupplierOrdersService) {}

  @Get()
  findAll() {
    return this.soService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSupplierOrdersDto) {
    return this.soService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierOrdersDto) {
    return this.soService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soService.remove(+id);
  }
}
EOF

cat <<EOF > src/supplier-orders/supplier-orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierOrdersDto, UpdateSupplierOrdersDto } from './supplier-orders.dto';

interface SupplierOrder {
  id: number;
  supplierId: number;
  orderDate: string;
  total: number;
}

@Injectable()
export class SupplierOrdersService {
  private orders: SupplierOrder[] = [
    { id: 1, supplierId: 1, orderDate: '2025-01-30', total: 500 },
    { id: 2, supplierId: 2, orderDate: '2025-02-05', total: 750 },
  ];

  findAll(): SupplierOrder[] {
    return this.orders;
  }

  findOne(id: number): SupplierOrder {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(\`SupplierOrder #\${id} not found\`);
    }
    return order;
  }

  create(dto: CreateSupplierOrdersDto): SupplierOrder {
    const id = this.orders.length
      ? this.orders[this.orders.length - 1].id + 1
      : 1;
    const newOrder: SupplierOrder = { id, ...dto };
    this.orders.push(newOrder);
    return newOrder;
  }

  update(id: number, dto: UpdateSupplierOrdersDto): SupplierOrder {
    const order = this.findOne(id);
    const updatedOrder = { ...order, ...dto };
    this.orders = this.orders.map((o) => (o.id === id ? updatedOrder : o));
    return updatedOrder;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.orders = this.orders.filter((o) => o.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/supplier-orders/supplier-orders.dto.ts
export class CreateSupplierOrdersDto {
  supplierId: number;
  orderDate: string; // or Date
  total: number;
}

export class UpdateSupplierOrdersDto {
  supplierId?: number;
  orderDate?: string; // or Date
  total?: number;
}
EOF

# 19) TICKET
mkdir -p src/ticket
cat <<EOF > src/ticket/ticket.module.ts
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
EOF

cat <<EOF > src/ticket/ticket.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
EOF

cat <<EOF > src/ticket/ticket.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
}

@Injectable()
export class TicketService {
  private tickets: Ticket[] = [
    { id: 1, subject: 'Login Issue', description: 'Cannot login to system', status: 'open' },
    { id: 2, subject: 'Payment Error', description: 'Payment gateway not working', status: 'open' },
  ];

  findAll(): Ticket[] {
    return this.tickets;
  }

  findOne(id: number): Ticket {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) {
      throw new NotFoundException(\`Ticket #\${id} not found\`);
    }
    return ticket;
  }

  create(dto: CreateTicketDto): Ticket {
    const id = this.tickets.length
      ? this.tickets[this.tickets.length - 1].id + 1
      : 1;
    const newTicket: Ticket = { id, ...dto };
    this.tickets.push(newTicket);
    return newTicket;
  }

  update(id: number, dto: UpdateTicketDto): Ticket {
    const ticket = this.findOne(id);
    const updatedTicket = { ...ticket, ...dto };
    this.tickets = this.tickets.map((t) => (t.id === id ? updatedTicket : t));
    return updatedTicket;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.tickets = this.tickets.filter((t) => t.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/ticket/ticket.dto.ts
export class CreateTicketDto {
  subject: string;
  description: string;
  status: string;
}

export class UpdateTicketDto {
  subject?: string;
  description?: string;
  status?: string;
}
EOF

# 20) USER (UPDATED: now includes a password field)
mkdir -p src/user
cat <<EOF > src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],  // so AuthService can inject it
})
export class UserModule {}
EOF

cat <<EOF > src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
EOF

cat <<EOF > src/user/user.service.ts
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
      password: '$2b$10$somehashedpassword', // example
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
      password: '$2b$10$somehashedpassword', // example
    },
  ];

  findAll(): Omit<User, 'password'>[] {
    // Return all but omit password
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(\`User with id \${id} not found\`);
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
      throw new NotFoundException(\`User with id \${id} not found\`);
    }
    const updatedUser = { ...user, ...data };
    this.users = this.users.map((u) => (u.id === id ? updatedUser : u));
    const { password, ...rest } = updatedUser;
    return rest;
  }

  remove(id: number): { deleted: boolean } {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(\`User with id \${id} not found\`);
    }
    this.users = this.users.filter((u) => u.id !== id);
    return { deleted: true };
  }
}
EOF

cat <<EOF > src/user/user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}
EOF

echo "NestJS project setup complete."
echo "--------------------------------------------------"
echo "1) cd nestjs-backend"
echo "2) npm run start:dev"
echo "--------------------------------------------------"
echo "Your NestJS server is ready at http://localhost:3000"
echo "Endpoints for Auth: POST /auth/register, POST /auth/login"
echo "All other CRUD endpoints are also available."

