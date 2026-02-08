import { Deck } from "@/logic/deck/deck";
import { useParams } from "react-router-dom";
import { Combobox } from "./ui";

interface SelectDecksHeaderProps {
  label: string;
  disableAll?: boolean;
  decks?: Deck[];
  onSelect: (deckId: string | null) => void;
}

export default function SelectDecksHeader({
  decks,
  label,
  disableAll,
  onSelect,
}: SelectDecksHeaderProps) {
  const deckId = useParams().deckId || "";
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
      value={deckId}
      onChange={(value) => onSelect(value)}
    />
  );
}
