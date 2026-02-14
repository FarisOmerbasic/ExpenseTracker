import type { AxiosError } from 'axios';

export function extractApiError(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  if (!error) return fallback;

  const axiosError = error as AxiosError<{ message?: string; title?: string; errors?: Record<string, string[]> }>;

  // Try structured error response
  if (axiosError.response?.data) {
    const data = axiosError.response.data;

    // Standard message field
    if (typeof data.message === 'string') return data.message;

    // ASP.NET ProblemDetails title
    if (typeof data.title === 'string') return data.title;

    // ASP.NET validation errors
    if (data.errors) {
      const firstError = Object.values(data.errors).flat()[0];
      if (firstError) return firstError;
    }

    // Plain string response
    if (typeof data === 'string') return data;
  }

  // Network error
  if (axiosError.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your connection.';
  }

  // Status code fallbacks
  if (axiosError.response?.status === 401) return 'Session expired. Please log in again.';
  if (axiosError.response?.status === 403) return 'You do not have permission for this action.';
  if (axiosError.response?.status === 404) return 'The requested resource was not found.';
  if (axiosError.response?.status === 409) return 'This resource already exists or conflicts with another.';
  if (axiosError.response?.status === 500) return 'Server error. Please try again later.';

  return fallback;
}

export function toDateInputValue(dateStr: string): string {
  if (!dateStr) return '';
  // Already in yyyy-MM-dd format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // ISO datetime string — extract date portion
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  // Try Date parsing as fallback
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return dateStr;
}

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) return;

  const header = columns.map((c) => c.label).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = val === null || val === undefined ? '' : String(val);
        // Escape quotes and wrap in quotes if contains comma/quote/newline
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return false; // No exp claim = assume valid
    return Date.now() >= exp * 1000;
  } catch {
    return true; // Malformed token
  }
}
