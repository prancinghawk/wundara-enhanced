import { StackHandler } from "@stackframe/stack";
import { stackClientApp } from "../lib/stack";

export default function Handler() {
  return <StackHandler app={stackClientApp} />;
}
