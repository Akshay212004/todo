export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
export const STATUSES: TaskStatus[] = ['Pending', 'Completed'];

export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  priority: Priority;
  status: TaskStatus;
  userId: string;
  createdAt: string; // ISO date string
}

/** Body sent to POST /tasks and PUT /tasks/:id. */
export interface TaskPayload {
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status?: TaskStatus; // only sent when editing
}

export interface AuthResponse {
  token: string;
  user: User;
}

/** Route params for the two navigators. */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  TaskList: undefined;
  TaskForm: { task?: Task } | undefined;
};
