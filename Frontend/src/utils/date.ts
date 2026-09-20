import { TaskStatus } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Manual formatting keeps output identical on every device (no Intl dependency).
export const formatDate = (input: string | Date): string => {
  const d = new Date(input);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatTime = (input: string | Date): string => {
  const d = new Date(input);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
};

export const formatDateTime = (input: string | Date): string =>
  `${formatDate(input)}, ${formatTime(input)}`;

/** A pending task whose deadline has passed. */
export const isOverdue = (deadline: string, status: TaskStatus): boolean =>
  status === 'Pending' && new Date(deadline).getTime() < Date.now();

/** Default deadline for a new task: tomorrow at 6 PM. */
export const defaultDeadline = (): Date => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(18, 0, 0, 0);
  return d;
};
