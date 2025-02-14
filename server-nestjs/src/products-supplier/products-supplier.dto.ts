export class CreateProductsSupplierDto {
  productId: number;
  supplierId: number;
}

export class UpdateProductsSupplierDto {
  productId?: number;
  supplierId?: number;
}
