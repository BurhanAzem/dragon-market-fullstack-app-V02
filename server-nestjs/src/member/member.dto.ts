export class CreateMemberDto {
  name: string;
  joinedAt: string; // or Date
}

export class UpdateMemberDto {
  name?: string;
  joinedAt?: string; // or Date
}
