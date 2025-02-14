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
