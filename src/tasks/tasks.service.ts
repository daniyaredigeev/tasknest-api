import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from './enums/task-status.enum';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Шаг 3: Принимаем userId отдельно
  async create(dto: CreateTaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        ...dto,
        userId, // Принудительно устанавливаем владельца
      },
    });
  }

  // Шаг 4: Проверка владения или роли ADMIN
  async update(id: string, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Задача не найдена');

    // Если не админ И не владелец — запрещаем
    if (user.role !== Role.ADMIN && task.userId !== user.id) {
      throw new ForbiddenException('Вы не можете изменять чужую задачу');
    }

    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, user: any) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Задача не найдена');

    // Шаг 4: Проверка для удаления
    if (user.role !== Role.ADMIN && task.userId !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужую задачу');
    }

    return await this.prisma.task.delete({ where: { id } });
  }

  async findAll(status?: TaskStatus) {
    return this.prisma.task.findMany({
      where: status ? { status } : {},
      include: { board: true, user: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.task.findUnique({ where: { id } });
  }
}