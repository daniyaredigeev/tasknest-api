// src/types/index.ts

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tasks?: Task[]; // Опционально, если загружаем доску с задачами
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  boardId: string;
  userId: string;
}