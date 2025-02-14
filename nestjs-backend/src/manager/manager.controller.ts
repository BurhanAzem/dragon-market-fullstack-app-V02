import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto, UpdateManagerDto } from './manager.dto';

@Controller('managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateManagerDto) {
    return this.managerService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateManagerDto) {
    return this.managerService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managerService.remove(+id);
  }
}
