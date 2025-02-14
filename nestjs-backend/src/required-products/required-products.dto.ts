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
