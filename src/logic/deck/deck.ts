export interface Deck {
  id: string;
  name: string;
  subDecks: string[];
  superDecks?: string[];
  cards: Array<string>;
  notes: Array<string>;
  description?: string;
  options: DeckOptions;
}

export interface DeckOptions {
  newToReviewRatio: number;
  dailyNewCards: number;
}
