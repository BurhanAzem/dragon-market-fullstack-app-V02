import { Module } from '@nestjs/common';
import { ProjectMembershipController } from './project-membership.controller';
import { ProjectMembershipService } from './project-membership.service';

@Module({
  controllers: [ProjectMembershipController],
  providers: [ProjectMembershipService],
})
export class ProjectMembershipModule {}
