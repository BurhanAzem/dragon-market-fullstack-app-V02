import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

interface Comment {
  id: number;
  text: string;
  author: string;
}

@Injectable()
export class CommentService {
  private comments: Comment[] = [
    { id: 1, text: 'Great product!', author: 'Alice' },
    { id: 2, text: 'Needs improvement.', author: 'Bob' },
  ];

  findAll(): Comment[] {
    return this.comments;
  }

  findOne(id: number): Comment {
    const comment = this.comments.find((c) => c.id === id);
    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`);
    }
    return comment;
  }

  create(dto: CreateCommentDto): Comment {
    const id = this.comments.length
      ? this.comments[this.comments.length - 1].id + 1
      : 1;
    const newComment: Comment = { id, ...dto };
    this.comments.push(newComment);
    return newComment;
  }

  update(id: number, dto: UpdateCommentDto): Comment {
    const comment = this.findOne(id);
    const updatedComment = { ...comment, ...dto };
    this.comments = this.comments.map((c) => (c.id === id ? updatedComment : c));
    return updatedComment;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.comments = this.comments.filter((c) => c.id !== id);
    return { deleted: true };
  }
}
