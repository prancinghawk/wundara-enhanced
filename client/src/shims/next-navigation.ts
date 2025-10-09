// Shim for next/navigation in Vite/React app
import { useNavigate, useLocation, useSearchParams as useRouterSearchParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  return useRouterSearchParams();
}

export function redirect(url: string): never {
  window.location.href = url;
  throw new Error('REDIRECT');
}

export function notFound(): never {
  throw new Error('NOT_FOUND');
}

export enum RedirectType {
  push = 'push',
  replace = 'replace',
}

export function useServerInsertedHTML(callback: () => void) {
  // No-op for client-side rendering
  return null;
}
