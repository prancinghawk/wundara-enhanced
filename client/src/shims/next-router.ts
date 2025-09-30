import { useLocation, useNavigate } from 'react-router-dom';

// Minimal Next.js router shim for React Router
export function useRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  return {
    asPath: location.pathname + location.search + location.hash,
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    prefetch: async () => {},
    pathname: location.pathname,
    query: {},
  } as const;
}
