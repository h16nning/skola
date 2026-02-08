import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import { Switch } from "@/components/ui/Switch";
import { Tooltip } from "@/components/ui/Tooltip";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useListState } from "@/lib/hooks/useListState";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useNotesOf } from "@/logic/note/hooks/useNotesOf";
import { NoteType } from "@/logic/note/note";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import {
  IconCalendar,
  IconDots,
  IconEye,
  IconMenuOrder,
  IconTextCaption,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Note } from "../../logic/note/note";
import NotebookCard from "./NotebookCard";
import "./NotebookView.css";

const BASE_URL = "notebook";
const NOTEBOOK_LIMIT = 50;

export default function NotebookView() {
  const [deck] = useDeckFromUrl();

  const [excludeSubDecks, setExcludeSubDecks] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [notes] = useNotesOf(deck, excludeSubDecks, NOTEBOOK_LIMIT);

  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);
  const [sortOrder] = useState<1 | -1>(1);
  const [sortedNotes, setSortedNotes] = useState<Note<NoteType>[]>(notes ?? []);

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
      (notes ?? []).slice(0).sort(sortOption.sortFunction(sortOrder))
    );
  }, [notes, sortOption, sortOrder, setSortedNotes]);

  return (
    <div className={BASE_URL}>
      <div className={`${BASE_URL}__toolbar`}>
        <SortSelect sortOption={sortOption} setSortOption={setSortOption} />
        <NotebookMenu
          excludeSubDecks={excludeSubDecks}
          setExcludeSubDecks={setExcludeSubDecks}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
        />
      </div>
      {deck?.notes && deck?.notes?.length > NOTEBOOK_LIMIT && (
        <div className={`${BASE_URL}__limit-notice`}>
          Currently there is a limit of {NOTEBOOK_LIMIT} notes displayed.{" "}
          {deck.notes.length - NOTEBOOK_LIMIT} notes are not shown.
        </div>
      )}
      {useCustomSort ? (
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            handlers.reorder({
              from: source.index,
              to: destination?.index || 0,
            });
            setCustomOrderTouched(true);
          }}
        >
          <Droppable droppableId="notebook" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${BASE_URL}__list`}
              >
                {state.map((card, index) => (
                  <NotebookCard
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
        <div className={`${BASE_URL}__list`}>
          {sortedNotes.map((note, index) => (
            <NotebookCard
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
    <CustomSelect
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

function NotebookMenu({
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

  useHotkeys([["Shift+Space", () => setShowAnswer(!showAnswer)]]);

  return (
    <Menu closeOnItemClick={false}>
      <MenuTrigger>
        <IconButton variant="default" aria-label={t("notebook.options.menu")}>
          <IconDots />
        </IconButton>
      </MenuTrigger>
      <MenuDropdown>
        <MenuItem
          leftSection={<IconTextCaption />}
          rightSection={
            <Switch
              checked={excludeSubDecks}
              onChange={(event) => {
                setExcludeSubDecks(event.currentTarget.checked);
              }}
            />
          }
          onClick={() => {
            setExcludeSubDecks(!excludeSubDecks);
          }}
        >
          {t("notebook.options.exclude-subdecks")}
        </MenuItem>
        <Tooltip
          label={
            <>
              Press <Kbd>Shift</Kbd> + <Kbd>Space</Kbd> to toggle all answers
            </>
          }
        >
          <MenuItem
            leftSection={<IconEye />}
            rightSection={
              <Switch
                checked={showAnswer}
                onChange={(event) => {
                  setShowAnswer(event.currentTarget.checked);
                }}
              />
            }
            onClick={() => {
              setShowAnswer(!showAnswer);
            }}
          >
            {t("notebook.options.show-answer")}
          </MenuItem>
        </Tooltip>
      </MenuDropdown>
    </Menu>
  );
}
