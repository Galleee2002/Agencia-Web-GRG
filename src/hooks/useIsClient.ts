"use client";

import { useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/** True after client hydration; avoids `useEffect` + `setMounted(true)`. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}
