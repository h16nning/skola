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
import { CardSortFunction, CardSorts } from "../../logic/CardSorting";
import { Card, CardType, useCardsOf } from "../../logic/card";
import { useDeckFromUrl } from "../../logic/deck";
import NotebookCard from "./NotebookCard";

async function sortCards(
  cards: Card<CardType>[],
  sortFunction: CardSortFunction,
  sortOrder: 1 | -1,
  setSortedCards: (cards: Card<CardType>[]) => void
) {
  setSortedCards(cards.sort(sortFunction(sortOrder)));
}

export default function NotebookView() {
  const [deck] = useDeckFromUrl();

  const [excludeSubDecks, setExcludeSubDecks] = useState(false);

  const [cards] = useCardsOf(deck, excludeSubDecks);

  const [sortOrder] = useState<1 | -1>(1);
  const [sortedCards, setSortedCards] = useState<Card<CardType>[]>(cards ?? []);

  //only for custom sort
  const [useCustomSort, setUseCustomSort] = useState(false);
  const [customOrderTouched, setCustomOrderTouched] = useState(false);
  const [state, handlers] = useListState(sortedCards ?? []);

  useEffect(() => {
    if (useCustomSort && !customOrderTouched) {
      handlers.setState(sortedCards ?? []);
    }
  }, [sortedCards]);

  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);

  useEffect(() => {
    setUseCustomSort(sortOption.value === "custom_order");
    sortCards(cards ?? [], sortOption.sortFunction, sortOrder, setSortedCards);
  }, [cards, sortOption, sortOrder]);

  return (
    <Stack gap="sm">
      <Group gap="xs" justify="flex-end">
        <SortComboBox sortOption={sortOption} setSortOption={setSortOption} />
        <NotebookMenu
          excludeSubDecks={excludeSubDecks}
          setExcludeSubDecks={setExcludeSubDecks}
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
                    card={card}
                    index={index}
                    useCustomSort={true}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Stack gap="xs">
          {sortedCards.map((card, index) => (
            <NotebookCard
              key={card.id}
              card={card}
              index={index}
              useCustomSort={false}
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
  sortFunction: CardSortFunction;
}

const sortOptions: SortOption[] = [
  {
    value: "custom_order",
    icon: IconMenuOrder,
    label: "Custom",
    sortFunction: CardSorts.byCustomOrder,
  },
  {
    value: "sort_field",
    icon: IconTextCaption,
    label: "By Sort Field",
    sortFunction: CardSorts.bySortField,
  },
  {
    value: "creation_date",
    icon: IconCalendar,
    label: "By Creation Date",
    sortFunction: CardSorts.byCreationDate,
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
}: {
  excludeSubDecks: boolean;
  setExcludeSubDecks: (value: boolean) => void;
}) {
  return (
    <Menu closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon variant="default" aria-label="Notebook menu">
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconTextCaption />}
          rightSection={
            <Switch
              checked={excludeSubDecks}
              onClick={() => setExcludeSubDecks(!excludeSubDecks)}
            />
          }
          onClick={() => setExcludeSubDecks(!excludeSubDecks)}
        >
          Exclude subdecks
        </Menu.Item>

        <Menu.Item
          leftSection={<IconEye />}
          rightSection={<Switch checked={false} onClick={() => {}} />}
          onClick={() => {}}
        >
          Show Answer
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
