import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import {
  ActionIcon,
  Combobox,
  Group,
  InputBase,
  Menu,
  Stack,
  Switch,
  Text,
  useCombobox,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconCalendar,
  IconDots,
  IconEye,
  IconMenuOrder,
  IconTextCaption,
  TablerIconsProps,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NoteSortFunction, NoteSorts } from "../../logic/NoteSorting";
import { CardType } from "../../logic/card";
import { useDeckFromUrl } from "../../logic/deck";
import { Note, useNotesOf } from "../../logic/note";
import NotebookCard from "./NotebookCard";

export default function NotebookView() {
  const [deck] = useDeckFromUrl();

  const [excludeSubDecks, setExcludeSubDecks] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [notes] = useNotesOf(deck, excludeSubDecks);

  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);
  const [sortOrder] = useState<1 | -1>(1);
  const [sortedNotes, setSortedNotes] = useState<Note<CardType>[]>(notes ?? []);

  //only for custom sort
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
    setSortedNotes((notes ?? []).sort(sortOption.sortFunction(sortOrder)));
  }, [notes, sortOption, sortOrder, setSortedNotes]);

  return (
    <Stack gap="sm">
      <Group gap="xs" justify="flex-end">
        <SortComboBox sortOption={sortOption} setSortOption={setSortOption} />
        <NotebookMenu
          excludeSubDecks={excludeSubDecks}
          setExcludeSubDecks={setExcludeSubDecks}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
        />
      </Group>
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
              <div {...provided.droppableProps} ref={provided.innerRef}>
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
        <Stack gap="xs">
          {sortOption.label}
          {sortedNotes.map((note, index) => (
            <NotebookCard
              key={note.id}
              note={note}
              index={index}
              useCustomSort={false}
              showAnswer={showAnswer}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

interface SortOption {
  value: string;
  icon: React.FC<TablerIconsProps>;
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

function SortComboBox({
  sortOption,
  setSortOption,
}: {
  sortOption: SortOption;
  setSortOption: Function;
}) {
  const combobox = useCombobox({});

  const options = sortOptions.map((s) => (
    <Combobox.Option
      value={s.value}
      key={s.value}
      active={sortOption.value === s.value}
      onClick={() => {
        setSortOption(s);
        combobox.closeDropdown();
      }}
      style={{
        backgroundColor:
          sortOption.value === s.value
            ? "var(--mantine-primary-color-filled)"
            : "",
        color:
          sortOption.value === s.value
            ? "var(--mantine-primary-color-contrast)"
            : "",
      }}
    >
      <Group gap="xs" wrap="nowrap" w="100%">
        <s.icon width="1.2rem" strokeWidth="1.5px" />
        <Text fz="sm" fw={500} style={{ whiteSpace: "nowrap" }}>
          {s.label}
        </Text>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      withinPortal={false}
      width={200}
      transitionProps={{ duration: 200, transition: "fade" }}
    >
      <Combobox.Target targetType="button">
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {sortOption.label}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
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
  return (
    <Menu closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon variant="default" aria-label={t("notebook.options.menu")}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconTextCaption />}
          rightSection={
            <Switch
              checked={excludeSubDecks}
              onChange={(event) => {
                setExcludeSubDecks(event.currentTarget.checked);
              }}
            />
          }
          onClick={(event) => {
            event.preventDefault();
            setExcludeSubDecks(!excludeSubDecks);
          }}
        >
          {t("notebook.options.exclude-subdecks")}
        </Menu.Item>

        <Menu.Item
          leftSection={<IconEye />}
          rightSection={
            <Switch
              checked={showAnswer}
              onChange={(event) => {
                setShowAnswer(event.currentTarget.checked);
              }}
            />
          }
          onClick={(event) => {
            event.preventDefault();
            setShowAnswer(!showAnswer);
          }}
        >
          {t("notebook.options.show-answer")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
