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
