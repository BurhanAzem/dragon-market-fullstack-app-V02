import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { CreateShelfDto, UpdateShelfDto } from './shelf.dto';

@Controller('shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Get()
  findAll() {
    return this.shelfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shelfService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateShelfDto) {
    return this.shelfService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShelfDto) {
    return this.shelfService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shelfService.remove(+id);
  }
}
