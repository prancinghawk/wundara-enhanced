// Shim for next/headers in Vite/React app
export function cookies() {
  return {
    get: (name: string) => {
      const value = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
      return value ? { value } : undefined;
    },
    set: (name: string, value: string) => {
      document.cookie = `${name}=${value}; path=/`;
    },
  };
}

export function headers() {
  return new Map();
}
