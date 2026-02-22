import type { ReactNode } from "react";

/**
 * Represents a single action that can be triggered from the spotlight search
 */
export interface SpotlightAction {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
  leftSection?: ReactNode;
  tabAction?: {
    label: string;
    action: () => void;
    disabled?: boolean;
  };
}

/**
 * Groups related spotlight actions together under a common label
 */
export interface SpotlightGroup {
  group: string;
  actions: SpotlightAction[];
}
