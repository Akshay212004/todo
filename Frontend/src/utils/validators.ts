/** Each validator returns an error message, or undefined when the value is valid. */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Enter your email address';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Enter your password';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 72) return 'Password must be 72 characters or fewer';
  return undefined;
};

export const validateConfirmPassword = (password: string, confirm: string): string | undefined => {
  if (!confirm) return 'Confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return undefined;
};

export const validateTitle = (title: string): string | undefined => {
  if (!title.trim()) return 'Give the task a title';
  if (title.trim().length > 100) return 'Title must be 100 characters or fewer';
  return undefined;
};

export const validateDescription = (description: string): string | undefined =>
  description.trim().length > 500 ? 'Description must be 500 characters or fewer' : undefined;

/** New tasks cannot start with a deadline in the past; existing tasks may keep theirs. */
export const validateDeadline = (deadline: Date, isNew: boolean): string | undefined => {
  if (Number.isNaN(deadline.getTime())) return 'Pick a deadline';
  if (isNew && deadline.getTime() < Date.now()) return 'Pick a deadline in the future';
  return undefined;
};
