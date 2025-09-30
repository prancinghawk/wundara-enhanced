import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Minimal Next.js Link shim that proxies to React Router's Link
// Usage: <Link href="/path">...</Link>
export type NextLinkProps = Omit<React.ComponentProps<typeof RouterLink>, 'to'> & {
  href: string;
  children?: React.ReactNode;
};

export default function Link({ href, children, ...rest }: NextLinkProps) {
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  );
}
