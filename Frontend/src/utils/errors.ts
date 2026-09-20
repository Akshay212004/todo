import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
    if (!error.response) {
      const friendly = 'Cannot reach the server. Check your connection and that the API is running.';
      if (!__DEV__) return friendly;
      const target = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
      return `${friendly}\n\n[dev] ${error.code ?? 'no code'}: ${error.message}\nCalled: ${target}`;
    }
    const message = (error.response.data as { message?: string } | undefined)?.message;
    return message ?? `Something went wrong (error ${error.response.status}).`;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};