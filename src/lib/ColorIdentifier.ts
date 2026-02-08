export const COLORS = ["sky", "red", "orange", "lime", "fuchsia"] as const;

export type ColorIdentifier = (typeof COLORS)[number];
