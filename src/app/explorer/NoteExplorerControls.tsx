import SelectDecksHeader from "@/components/SelectDecksHeader";
import { TextInput } from "@/components/ui";
import { Deck } from "@/logic/deck/deck";
import { IconSearch } from "@tabler/icons-react";
import "./NoteExplorerControls.css";

interface NoteExplorerControlsProps {
  decks: Deck[] | undefined;
  selectedDeckParam: string;
  onDeckSelect: (deckId: string | null) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
}

export function NoteExplorerControls({
  decks,
  selectedDeckParam,
  onDeckSelect,
  filterValue,
  onFilterChange,
}: NoteExplorerControlsProps) {
  return (
    <div className="note-explorer-controls">
      <SelectDecksHeader
        label="Showing Notes in"
        decks={decks}
        selectedValue={selectedDeckParam}
        onSelect={onDeckSelect}
      />

      <TextInput
        leftSection={<IconSearch size={16} />}
        value={filterValue}
        placeholder="Filter Notes"
        onChange={(event) => onFilterChange(event.currentTarget.value)}
      />
    </div>
  );
}
