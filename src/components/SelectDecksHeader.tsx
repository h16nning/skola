import { Deck } from "@/logic/deck/deck";
import { Combobox } from "./ui";

interface SelectDecksHeaderProps {
  label: string;
  disableAll?: boolean;
  decks?: Deck[];
  selectedValue?: string;
  onSelect: (deckId: string | null) => void;
}

export default function SelectDecksHeader({
  decks,
  label,
  disableAll,
  selectedValue = "",
  onSelect,
}: SelectDecksHeaderProps) {
  return (
    <Combobox
      label={label}
      searchable
      nothingFoundMessage="No Decks Found"
      data={(disableAll ? [] : [{ value: "", label: "All" }]).concat(
        decks?.map((deck) => ({
          value: deck.id,
          label: deck.name,
        })) ?? []
      )}
      value={selectedValue}
      onChange={(value) => onSelect(value)}
    />
  );
}
