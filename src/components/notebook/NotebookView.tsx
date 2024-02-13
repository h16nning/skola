import { Button, Group, Menu, Stack } from "@mantine/core";
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
import { Card, CardType, useCardsOf } from "../../logic/card";
import { useDeckFromUrl } from "../../logic/deck";
import { CardSortFunction, CardSorts } from "../../logic/CardSorting";
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

  useEffect(() => {
    setSortedCards(cards?.sort(sortFunction(sortOrder)) ?? []);
  }, [cards, sortFunction, sortOrder]);

  return (
    <Section
      title={t("deck.notebook.title")}
      rightSection={
        <Group gap="xs">
          <Menu>
            <Menu.Target>
              <Button variant="default" leftSection={<IconArrowsSort />}>
                Sort
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconMenuOrder />} disabled>
                Custom
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTextCaption />}
                onClick={() => setSortFunction(() => CardSorts.bySortField)}
              >
                By Sort Field
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCalendar />}
                onClick={() => setSortFunction(() => CardSorts.byCreationDate)}
              >
                By Creation Date
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconSortAscending />}
                onClick={() => setSortOrder(1)}
              >
                Ascending
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSortDescending />}
                onClick={() => setSortOrder(-1)}
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
      <Stack gap="sm">
        {sortedCards.map((c) => (
          <NotebookCard card={c} key={c.id} />
        ))}
      </Stack>
    </Section>
  );
}
