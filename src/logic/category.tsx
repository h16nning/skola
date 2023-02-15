import { Card } from "./card";

export type Category = {
    name: String;
    subcategories: Array<Category>;
    subcards: Array<Card>;
};

export function getCategory(id: String): Category {
    return { name: "Kategorie-Name", subcategories: [], subcards: [] };
}
