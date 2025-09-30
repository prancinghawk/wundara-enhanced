// Minimal shim to satisfy imports like `import { event } from "next/dist/build/output/log"`.
// We export a no-op `event` function so callers can pass it to removeEventListener without type errors.
export function event() {
  // no-op
}
