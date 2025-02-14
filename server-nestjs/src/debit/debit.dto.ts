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
