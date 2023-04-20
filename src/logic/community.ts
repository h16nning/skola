import { Card, CardType } from "./card";

export interface Community {
  id: string;
  linkedCards: Card<CardType>[];
  content: Object;
}
