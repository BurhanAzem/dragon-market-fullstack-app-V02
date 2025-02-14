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
