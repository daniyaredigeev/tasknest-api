import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@ApiTags('Задачи (Tasks)')
@ApiBearerAuth() // Показывает в Swagger, что нужен токен
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 1. GET /tasks — Любой авторизованный пользователь (Guard глобальный)
  @Get()
  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiQuery({
    name: 'status',
    enum: TaskStatus,
    required: false,
    description: 'Фильтрация задач по статусу',
  })
  findAll(@Query('status') status?: TaskStatus) {
    return this.tasksService.findAll(status);
  }

  // 2. GET /tasks/:id — Любой авторизованный пользователь
  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создать новую задачу' })
  create(
    @Body() createTaskDto: CreateTaskDto, 
    @Authorized('id') userId: string // Шаг 2: берем ID из токена
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу (Владелец или Админ)' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Authorized() user: any // Передаем весь объект user для проверки роли и id
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить задачу (Владелец или Админ)' })
  remove(
    @Param('id') id: string,
    @Authorized() user: any
  ) {
    return this.tasksService.remove(id, user);
  }

  //можно добавить get/me
}