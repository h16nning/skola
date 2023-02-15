import { CardType } from "./card-type";

export type Card = {
    type: CardType;
    fields: Array<String>;
    history: Array<Object>;
};
