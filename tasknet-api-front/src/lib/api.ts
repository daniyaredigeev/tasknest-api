import { getAccessToken, saveAccessToken, clearAccessToken } from "./auth";
import type { User, Board, Task, TaskStatus } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── БАЗОВАЯ ФУНКЦИЯ ЗАПРОСА ───────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const accessToken = getAccessToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(endpoint, options, true);
    } else {
      clearAccessToken();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Сессия истекла. Войдите снова.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) return false;
    const data = await response.json();
    saveAccessToken(data.accessToken);
    return true;
  } catch { return false; }
}

// ─── AUTH ──────────────────────────────────────────────────
export const apiRegister = (data: any) => request("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const apiLogin = (data: any) => request<{ accessToken: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const apiLogout = () => request("/auth/logout", { method: "POST" });
export const apiGetMe = () => request<User>("/auth/me");

// ─── BOARDS ─────────────────────────────────────────────────────────
export const apiGetBoards = () => request<Board[]>("/boards");
export const apiGetBoard = (id: string) => request<Board>(`/boards/${id}`);

// ИСПРАВЛЕНО: Теперь принимает объект с title и description
export const apiCreateBoard = (data: { title: string; description?: string }) => 
  request<Board>("/boards/create", { 
    method: "POST", 
    body: JSON.stringify(data) 
  });

export const apiDeleteBoard = (id: string) => request(`/boards/${id}`, { method: "DELETE" });

// Добавь также обновление доски (для админа), если понадобится
export const apiUpdateBoard = (id: string, data: Partial<Board>) =>
  request<Board>(`/boards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// ─── TASKS (ОБЯЗАТЕЛЬНО ДОБАВЬ ЭТО) ─────────────────────────────────────────────────────────

// Получение задач (можно с фильтром по статусу)
export const apiGetTasks = (status?: TaskStatus) => {
  const url = status ? `/tasks?status=${status}` : "/tasks";
  return request<Task[]>(url);
};

// Создание задачи
export const apiCreateTask = (data: {
  title: string;
  description?: string;
  status: TaskStatus;
  boardId: string;
}) => request<Task>("/tasks/create", {
  method: "POST",
  body: JSON.stringify(data),
});

// Обновление (для смены статуса или текста)
export const apiUpdateTask = (id: string, data: Partial<Task>) => 
  request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// Удаление
export const apiDeleteTask = (id: string) => 
  request(`/tasks/${id}`, { method: "DELETE" });