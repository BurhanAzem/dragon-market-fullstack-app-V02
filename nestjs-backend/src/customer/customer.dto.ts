export class CreateCustomerDto {
  name: string;
  email: string;
}

export class UpdateCustomerDto {
  name?: string;
  email?: string;
}
