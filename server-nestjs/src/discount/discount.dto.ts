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
