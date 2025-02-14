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
