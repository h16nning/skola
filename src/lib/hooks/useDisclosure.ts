import { useCallback, useState } from "react";

export interface DisclosureHandlers {
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
}

export function useDisclosure(
  initialState = false
): [boolean, DisclosureHandlers] {
  const [opened, setOpened] = useState(initialState);

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened((prev) => !prev), []);

  const handlers: DisclosureHandlers = { open, close, toggle };

  return [opened, handlers];
}
