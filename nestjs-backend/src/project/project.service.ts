import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
}

@Injectable()
export class ProjectService {
  private projects: Project[] = [
    { id: 1, name: 'Warehouse Upgrade', description: 'Upgrade storage area', startDate: '2025-01-01' },
    { id: 2, name: 'New Product Launch', description: 'Launch new product line', startDate: '2025-01-15' },
  ];

  findAll(): Project[] {
    return this.projects;
  }

  findOne(id: number): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    return project;
  }

  create(dto: CreateProjectDto): Project {
    const id = this.projects.length
      ? this.projects[this.projects.length - 1].id + 1
      : 1;
    const newProject: Project = { id, ...dto };
    this.projects.push(newProject);
    return newProject;
  }

  update(id: number, dto: UpdateProjectDto): Project {
    const project = this.findOne(id);
    const updatedProject = { ...project, ...dto };
    this.projects = this.projects.map((p) => (p.id === id ? updatedProject : p));
    return updatedProject;
  }

  remove(id: number): { deleted: boolean } {
    this.findOne(id);
    this.projects = this.projects.filter((p) => p.id !== id);
    return { deleted: true };
  }
}
