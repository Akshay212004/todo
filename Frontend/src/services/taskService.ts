import api from './api';
import { Task, TaskPayload } from '../types';

export const fetchTasksRequest = async (): Promise<Task[]> => {
  const { data } = await api.get<{ tasks: Task[] }>('/tasks');
  return data.tasks;
};

export const createTaskRequest = async (payload: TaskPayload): Promise<Task> => {
  const { data } = await api.post<{ task: Task }>('/tasks', payload);
  return data.task;
};

export const updateTaskRequest = async (id: string, payload: Partial<TaskPayload>): Promise<Task> => {
  const { data } = await api.put<{ task: Task }>(`/tasks/${id}`, payload);
  return data.task;
};

export const deleteTaskRequest = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const completeTaskRequest = async (id: string): Promise<Task> => {
  const { data } = await api.patch<{ task: Task }>(`/tasks/${id}/complete`);
  return data.task;
};
