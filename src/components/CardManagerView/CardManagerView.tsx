import { Space, Group, Stack, TextInput, Title } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCardsWith } from "../../logic/card";
import selectCards, { SortOption } from "../../logic/card_filter";
import { useDecks } from "../../logic/deck";
import CardTable from "../CardTable/CardTable";
import { AppHeaderContent } from "../Header/Header";
import SelectDecksHeader from "../custom/SelectDecksHeader";
import classes from "./CardManagerView.module.css";
import EditorOptionsMenu from "../editcard/EditorOptionsMenu";
import { t } from "i18next";

const ALL_DECK_ID = "all";
function CardManagerView() {
  const navigate = useNavigate();
  const cardId = useParams().cardId;
  let deckId = useParams().deckId;
  if (deckId === ALL_DECK_ID) deckId = undefined;

  const location = useLocation();

  const [decks] = useDecks();

  const [filter, setFilter] = useDebouncedState<string>("", 250);

  const [sort, setSort] = useState<[SortOption, boolean]>(["sort_field", true]);

  const [cards] = useCardsWith(
    (cards) => selectCards(cards, deckId, filter, sort),
    [deckId, location, filter, sort]
  );

  return (
    <Stack style={{ overflow: "hidden", width: "100%", height: "100%" }}>
      <AppHeaderContent>
        <AppHeaderContent>
          <Group justify="space-between" gap="xs" wrap="nowrap">
            <Space />
            <Title order={3}>{t("manage-cards.title")}</Title>
            <EditorOptionsMenu />
          </Group>
        </AppHeaderContent>
      </AppHeaderContent>
      <Group align="end" gap="xs">
        <SelectDecksHeader
          label="Showing cards in"
          decks={decks}
          onSelect={(deckId) => navigate(`/cards/${deckId}`)}
        />
      </Group>
      <TextInput
        leftSection={<IconSearch size={16} />}
        defaultValue={filter}
        placeholder="Filter cards"
        maw="20rem"
        onChange={(event) => setFilter(event.currentTarget.value)}
      />
      <Group
        gap="md"
        grow
        align="start"
        style={{ overflowY: "scroll", height: "100%" }}
      >
        {cards && (
          <CardTable
            cardSet={cards ?? []}
            selectedIndex={cards.findIndex((card) => cardId === card?.id)}
            setSelectedIndex={(idx) => {
              navigate(`/cards/${deckId || ALL_DECK_ID}/${cards[idx].id}`);
            }}
            selectedCard={cards.find((card) => cardId === card?.id)}
            setSelectedCard={(card) => {
              // avoid navigating to the same card
              if (cardId !== card?.id)
                navigate(`/cards/${deckId || ALL_DECK_ID}/${card.id}`);
            }}
            sort={sort}
            setSort={setSort}
          />
        )}
        <Stack className={classes.cardBox}>
          <Outlet />
        </Stack>
      </Group>
    </Stack>
  );
}

export default CardManagerView;
