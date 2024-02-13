import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Button, Group, Menu, Stack } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconArrowsSort,
  IconCalendar,
  IconMenuOrder,
  IconPlus,
  IconSortAscending,
  IconSortDescending,
  IconTextCaption,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CardSortFunction, CardSorts } from "../../logic/CardSorting";
import { Card, CardType, useCardsOf } from "../../logic/card";
import { useDeckFromUrl } from "../../logic/deck";
import Section from "../settings/Section";
import NotebookCard from "./NotebookCard";

export default function NotebookView() {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [deck] = useDeckFromUrl();

  const [cards] = useCardsOf(deck);

  const [sortFunction, setSortFunction] = useState<CardSortFunction>(
    () => CardSorts.byCreationDate
  );

  const [sortOrder, setSortOrder] = useState<1 | -1>(1);
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

  useEffect(() => {
    setSortedCards(cards?.sort(sortFunction(sortOrder)) ?? []);
  }, [cards, sortFunction, sortOrder]);

  return (
    <Section
      title={t("deck.notebook.title")}
      rightSection={
        <Group gap="xs">
          {/*FIX MESHOULD PROBABLY USE SELECT*/}
          <Menu>
            <Menu.Target>
              <Button variant="default" leftSection={<IconArrowsSort />}>
                Sort
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconMenuOrder />}
                className={useCustomSort ? "active" : ""}
                onClick={() => {
                  setSortedCards([]);
                  setUseCustomSort(true);
                  setSortFunction(() => CardSorts.byCustomOrder);
                  setCustomOrderTouched(false);
                }}
              >
                Custom
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTextCaption />}
                className={
                  sortFunction.name === CardSorts.bySortField.name
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setUseCustomSort(false);
                  setSortFunction(() => CardSorts.bySortField);
                }}
              >
                By Sort Field
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCalendar />}
                className={
                  sortFunction.name === CardSorts.byCreationDate.name
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setUseCustomSort(false);
                  setSortFunction(() => CardSorts.byCreationDate);
                }}
              >
                By Creation Date
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconSortAscending />}
                className={sortOrder === -1 ? "active" : ""}
                onClick={() => setSortOrder(-1)}
                disabled={useCustomSort}
              >
                Ascending
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSortDescending />}
                className={sortOrder === 1 ? "active" : ""}
                onClick={() => setSortOrder(1)}
                disabled={useCustomSort}
              >
                Descending
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button
            leftSection={<IconPlus />}
            variant="default"
            onClick={() => navigate("/new/" + deck?.id)}
          >
            {t("deck.add-cards")}
          </Button>
        </Group>
      }
    >
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
    </Section>
  );
}
