import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';
import { Authorization } from 'src/auth/decorators/authoration.decorator'; // Проверьте опечатку в названии файла (authoration)
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Доски (Boards)')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  // 1. GET /boards — Любой авторизованный (т.к. Guard глобальный, просто @Get)
  @Get()
  @ApiOperation({ summary: 'Получить список всех досок' })
  findAll() {
    return this.boardsService.findAll();
  }

  // 2. GET /boards/:id — Любой авторизованный
  @Get(':id')
  @ApiOperation({ summary: 'Получить одну доску по ID' })
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  // 3. POST /boards — Только ADMIN
  @Roles(Role.ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Создать новую доску (Только Admin)' })
  @ApiResponse({ status: 201, description: 'Доска успешно создана.' })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  // 4. PATCH /boards/:id — Только ADMIN
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные доски (Только Admin)' })
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardsDto) {
    return this.boardsService.update(id, updateBoardDto);
  }

  // 5. DELETE /boards/:id — Только ADMIN
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить доску (Только Admin)' })
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}