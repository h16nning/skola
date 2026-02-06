export const COLORS = ["red", "orange", "lime", "sky", "fuchsia"] as const;

export type ColorIdentifier = (typeof COLORS)[number];
