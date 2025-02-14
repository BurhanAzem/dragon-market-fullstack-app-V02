import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectMembershipDto, UpdateProjectMembershipDto } from './project-membership.dto';

interface ProjectMembership {
  id: number;
  projectId: number;
  userId: number;
  role: string;
}

@Injectable()
export class ProjectMembershipService {
  private memberships: ProjectMembership[] = [
    { id: 1, projectId: 1, userId: 1, role: 'Owner' },
    { id: 2, projectId: 2, userId: 2, role: 'Contributor' },
  ];

  findAll(): ProjectMembership[] {
    return this.memberships;
  }

  findOne(id: number): ProjectMembership {
    const membership = this.memberships.find((pm) => pm.id === id);
    if (!membership) {
      throw new NotFoundException(`ProjectMembership #${id} not found`);
    }
    return membership;
  }

  create(dto: CreateProjectMembershipDto): ProjectMembership {
    const id = this.memberships.length
      ? this.memberships[this.memberships.length - 1].id + 1
      : 1;
    const newMembership: ProjectMembership = { id, ...dto };
    this.memberships.push(newMembership);
    return newMembership;
  }

  update(id: number, dto: UpdateProjectMembershipDto): ProjectMembership {
    const membership = this.findOne(id);
    const updatedMembership = { ...membership, ...dto };
    this.memberships = this.memberships.map((pm) =>
      pm.id === id ? updatedMembership : pm,
    );
    return updatedMembership;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.memberships = this.memberships.filter((pm) => pm.id !== id);
    return { deleted: true };
  }
}
