import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';
import { Task, TaskPayload } from '../types';
import {
  completeTaskRequest,
  createTaskRequest,
  deleteTaskRequest,
  fetchTasksRequest,
  updateTaskRequest,
} from '../services/taskService';
import { getErrorMessage } from '../utils/errors';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD'; payload: Task }
  | { type: 'UPDATE'; payload: Task }
  | { type: 'REMOVE'; payload: string };

const initialState: TaskState = { tasks: [], loading: false, error: null };

const reducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { tasks: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case 'REMOVE':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    default:
      return state;
  }
};

interface TaskContextValue extends TaskState {
  fetchTasks: () => Promise<void>;
  createTask: (payload: TaskPayload) => Promise<void>;
  updateTask: (id: string, payload: Partial<TaskPayload>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

/**
 * Mounted only while the user is logged in (see RootNavigator), so logging out
 * unmounts it and the next user never sees the previous user's tasks.
 *
 * fetchTasks reports failures through `error` state (shown on the list screen).
 * The mutating functions throw, so the screen that triggered them can show the message.
 */
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      dispatch({ type: 'FETCH_SUCCESS', payload: await fetchTasksRequest() });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: getErrorMessage(error) });
    }
  }, []);

  const createTask = useCallback(async (payload: TaskPayload) => {
    dispatch({ type: 'ADD', payload: await createTaskRequest(payload) });
  }, []);

  const updateTask = useCallback(async (id: string, payload: Partial<TaskPayload>) => {
    dispatch({ type: 'UPDATE', payload: await updateTaskRequest(id, payload) });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await deleteTaskRequest(id);
    dispatch({ type: 'REMOVE', payload: id });
  }, []);

  const completeTask = useCallback(async (id: string) => {
    dispatch({ type: 'UPDATE', payload: await completeTaskRequest(id) });
  }, []);

  const value = useMemo(
    () => ({ ...state, fetchTasks, createTask, updateTask, deleteTask, completeTask }),
    [state, fetchTasks, createTask, updateTask, deleteTask, completeTask]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextValue => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside <TaskProvider>');
  return ctx;
};
