import { ColorIdentifier } from "@/lib/ColorIdentifier";

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
}

export interface DeckOptions {
  newToReviewRatio: number;
  dailyNewCards: number;
}
