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
