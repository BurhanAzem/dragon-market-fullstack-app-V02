import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';

interface Member {
  id: number;
  name: string;
  joinedAt: string;
}

@Injectable()
export class MemberService {
  private members: Member[] = [
    { id: 1, name: 'Chris Evans', joinedAt: '2025-01-15' },
    { id: 2, name: 'Mark Ruffalo', joinedAt: '2025-01-20' },
  ];

  findAll(): Member[] {
    return this.members;
  }

  findOne(id: number): Member {
    const member = this.members.find((m) => m.id === id);
    if (!member) {
      throw new NotFoundException(`Member #${id} not found`);
    }
    return member;
  }

  create(dto: CreateMemberDto): Member {
    const id = this.members.length
      ? this.members[this.members.length - 1].id + 1
      : 1;
    const newMember: Member = { id, ...dto };
    this.members.push(newMember);
    return newMember;
  }

  update(id: number, dto: UpdateMemberDto): Member {
    const member = this.findOne(id);
    const updatedMember = { ...member, ...dto };
    this.members = this.members.map((m) => (m.id === id ? updatedMember : m));
    return updatedMember;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.members = this.members.filter((m) => m.id !== id);
    return { deleted: true };
  }
}
