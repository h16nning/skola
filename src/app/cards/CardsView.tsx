import { Kbd } from "@/components/ui/Kbd";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { Select, SelectOption } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useListState } from "@/lib/hooks/useListState";
import { db } from "@/logic/db";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useNotesOf } from "@/logic/note/hooks/useNotesOf";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { noteMatchesSearch } from "@/logic/note/search";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import {
  IconCalendar,
  IconMenuOrder,
  IconSearch,
  IconTextCaption,
} from "@tabler/icons-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CardItem from "./CardItem";
import "./CardsView.css";

const BASE = "cards-view";
const CARDS_LIMIT = 5000;

export default function CardsView() {
  const [deck] = useDeckFromUrl();

  const [excludeSubDecks, setExcludeSubDecks] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [notes] = useNotesOf(deck, excludeSubDecks, CARDS_LIMIT);
  const filteredNotes = useMemo(
    () => filterNotes(notes ?? [], deferredSearchQuery),
    [notes, deferredSearchQuery]
  );

  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);
  const [sortOrder] = useState<1 | -1>(1);
  const [sortedNotes, setSortedNotes] = useState<Note<NoteType>[]>(
    filteredNotes ?? []
  );

  const [useCustomSort, setUseCustomSort] = useState(false);
  const [customOrderTouched, setCustomOrderTouched] = useState(false);
  const [state, handlers] = useListState(sortedNotes ?? []);

  useEffect(() => {
    if (useCustomSort && !customOrderTouched) {
      handlers.setState(sortedNotes ?? []);
    }
  }, [sortedNotes]);

  useEffect(() => {
    setUseCustomSort(sortOption.value === "custom_order");
    setSortedNotes(
      filteredNotes.slice(0).sort(sortOption.sortFunction(sortOrder))
    );
  }, [filteredNotes, sortOption, sortOrder, setSortedNotes]);

  const omittedNoteCount = Math.max((deck?.notes.length ?? 0) - CARDS_LIMIT, 0);

  return (
    <div className={BASE}>
      <div className={`${BASE}__toolbar`}>
        <TextInput
          className={`${BASE}__search`}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          placeholder="Search front and back..."
          leftSection={<IconSearch />}
          aria-label="Search cards"
        />
        <SortSelect sortOption={sortOption} setSortOption={setSortOption} />
        <CardsMenu
          excludeSubDecks={excludeSubDecks}
          setExcludeSubDecks={setExcludeSubDecks}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
        />
      </div>
      {omittedNoteCount > 0 && (
        <div className={`${BASE}__limit-notice`}>
          {`Currently there is a limit of ${CARDS_LIMIT} cards displayed. ${omittedNoteCount} cards have been omitted.`}
        </div>
      )}
      {useCustomSort ? (
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            if (!destination) return;

            const newState = [...state];
            const [removed] = newState.splice(source.index, 1);
            newState.splice(destination.index, 0, removed);

            handlers.reorder({
              from: source.index,
              to: destination.index,
            });
            setCustomOrderTouched(true);

            db.notes.bulkUpdate(
              newState.map((note, index) => ({
                key: note.id,
                changes: { customOrder: index },
              }))
            );
          }}
        >
          <Droppable droppableId="cards" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${BASE}__list`}
              >
                {state.map((card, index) => (
                  <CardItem
                    key={card.id}
                    note={card}
                    index={index}
                    useCustomSort={true}
                    showAnswer={showAnswer}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className={`${BASE}__list`}>
          {sortedNotes.map((note, index) => (
            <CardItem
              key={note.id}
              note={note}
              index={index}
              useCustomSort={false}
              showAnswer={showAnswer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function filterNotes(notes: Note<NoteType>[], query: string) {
  return notes.filter((note) => noteMatchesSearch(note, query));
}

interface SortOption {
  value: string;
  icon: React.ComponentType<any>;
  label: string;
  sortFunction: NoteSortFunction;
}

const sortOptions: SortOption[] = [
  {
    value: "custom_order",
    icon: IconMenuOrder,
    label: "Custom",
    sortFunction: NoteSorts.byCustomOrder,
  },
  {
    value: "sort_field",
    icon: IconTextCaption,
    label: "By Sort Field",
    sortFunction: NoteSorts.bySortField,
  },
  {
    value: "creation_date",
    icon: IconCalendar,
    label: "By Creation Date",
    sortFunction: NoteSorts.byCreationDate,
  },
];

function SortSelect({
  sortOption,
  setSortOption,
}: {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}) {
  const selectOptions: SelectOption<string>[] = sortOptions.map((s) => ({
    value: s.value,
    label: s.label,
    icon: s.icon,
  }));

  return (
    <Select
      value={sortOption.value}
      onChange={(value) => {
        const option = sortOptions.find((s) => s.value === value);
        if (option) {
          setSortOption(option);
        }
      }}
      options={selectOptions}
    />
  );
}

function CardsMenu({
  excludeSubDecks,
  setExcludeSubDecks,
  showAnswer,
  setShowAnswer,
}: {
  excludeSubDecks: boolean;
  setExcludeSubDecks: (value: boolean) => void;
  showAnswer: boolean;
  setShowAnswer: (value: boolean) => void;
}) {
  const [t] = useTranslation();

  useHotkeys([["-", () => setShowAnswer(!showAnswer)]]);

  return (
    <Menu>
      <MenuItem
        checked={excludeSubDecks}
        onClick={() => {
          setExcludeSubDecks(!excludeSubDecks);
        }}
      >
        {t("cards.options.exclude-subdecks")}
      </MenuItem>
      <Tooltip
        label={
          <>
            Press <Kbd>-</Kbd> to toggle all answers
          </>
        }
      >
        <MenuItem
          checked={showAnswer}
          onClick={() => {
            setShowAnswer(!showAnswer);
          }}
        >
          {t("cards.options.show-answer")}
        </MenuItem>
      </Tooltip>
    </Menu>
  );
}
