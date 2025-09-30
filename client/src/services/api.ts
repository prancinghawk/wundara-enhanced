export type ApiFetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  token?: string;
};

export async function apiFetch<T = unknown>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const baseUrl = (import.meta as any).env?.VITE_API_URL || '';
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;

  const init: RequestInit = {
    method: opts.method || (opts.body ? 'POST' : 'GET'),
    headers,
  };

  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    let message = '';
    try {
      message = await res.text();
    } catch {}
    throw new Error(message || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
