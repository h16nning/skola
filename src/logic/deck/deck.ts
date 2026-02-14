import { ColorIdentifier } from "@/lib/ColorIdentifier";
import { SimplifiedState } from "../card/getSimplifiedStatesOf";

export interface DeckStatCache {
  counts: Record<SimplifiedState, number>;
  lastUpdated: Date;
  includesSubdecks: boolean;
}

export interface Deck {
  id: string;
  name: string;
  subDecks: string[];
  superDecks?: string[];
  cards: Array<string>;
  notes: Array<string>;
  description?: string;
  options: DeckOptions;
  color?: ColorIdentifier;
  statCache?: DeckStatCache;
}

export interface DeckOptions {
  newToReviewRatio: number;
  dailyNewCards: number;
}
