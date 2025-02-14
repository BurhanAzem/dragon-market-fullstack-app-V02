export class CreateCommentDto {
  text: string;
  author: string;
}

export class UpdateCommentDto {
  text?: string;
  author?: string;
}
