export class CreateProjectDto {
  name: string;
  description: string;
  startDate: string; // or Date
}

export class UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: string; // or Date
}
