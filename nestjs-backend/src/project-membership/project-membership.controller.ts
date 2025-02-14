import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProjectMembershipService } from './project-membership.service';
import { CreateProjectMembershipDto, UpdateProjectMembershipDto } from './project-membership.dto';

@Controller('project-memberships')
export class ProjectMembershipController {
  constructor(private readonly pmService: ProjectMembershipService) {}

  @Get()
  findAll() {
    return this.pmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pmService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProjectMembershipDto) {
[O    return this.pmService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectMembershipDto) {
    return this.pmService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pmService.remove(+id);
  }
}
