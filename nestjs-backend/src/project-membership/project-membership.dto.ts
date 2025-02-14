export class CreateProjectMembershipDto {
  projectId: number;
  userId: number;
  role: string;
}

export class UpdateProjectMembershipDto {
  projectId?: number;
  userId?: number;
  role?: string;
}
