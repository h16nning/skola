import { Group, Kbd, UnstyledButton, rem } from "@mantine/core";
import { useDebouncedState, useOs } from "@mantine/hooks";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { IconCards, IconSearch, IconSquare } from "@tabler/icons-react";
import cx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardType, useCardsWith } from "../../logic/card";
import selectCards from "../../logic/card_filter";
import { determineSuperDecks, getDeck, useDecks } from "../../logic/deck";
import classes from "./Spotlight.module.css";
import { useShowShortcutHints } from "../../logic/Settings";
interface CardWithPreview extends Card<CardType> {
  breadcrumb: string[];
}

const useSearchCard = (filter: string) => {
  const [filteredCards, setFilteredCards] = useState<CardWithPreview[]>([]);
  const [cards] = useCardsWith(
    (cards) => selectCards(cards, undefined, filter, ["sort_field", true]),
    [location, filter]
  );
  useEffect(() => {
    async function filterCards(cards: Card<CardType>[]) {
      const decksPromises = cards?.map(async (card) => {
        const deck = await getDeck(card.deck);
        const superDecks = await determineSuperDecks(deck);
        return [
          ...(superDecks[0] || []).map((sd) => sd.name),
          deck?.name || "Empty",
        ];
      });
      const decks = await Promise.all(decksPromises);
      setFilteredCards(
        cards.map((card, i) => ({
          ...card,
          breadcrumb: decks[i],
        }))
      );
    }
    filterCards(cards || []);
  }, [cards]);

  return filteredCards;
};

export default function SpotlightCard({
  minimalMode,
}: { minimalMode: boolean }) {
  const [filter, setFilter] = useDebouncedState("", 250);
  const os = useOs();
  const showShortcutHints = useShowShortcutHints();
  const navigate = useNavigate();
  const filteredCards = useSearchCard(filter);
  const [filteredDecks] = useDecks();
  const possibleActions = [
    {
      group: "Decks",
      actions: [
        ...(filteredDecks || []).map((deck) => {
          return {
            id: deck.id,
            label: deck.name,
            description: deck.description,
            onClick: () => navigate(`/deck/${deck.id}`),
            leftSection: (
              <IconCards
                style={{ width: rem(24), height: rem(24) }}
                stroke={1.5}
              />
            ),
          };
        }),
      ],
    },
    {
      group: "Cards",
      actions: [
        ...filteredCards.map((card) => {
          return {
            id: card.id,
            label: card.preview,
            description: card.breadcrumb.join(" > "),
            onClick: () => navigate(`/deck/${card.deck}`),
            leftSection: (
              <IconSquare
                style={{ width: rem(24), height: rem(24) }}
                stroke={1.5}
              />
            ),
          };
        }),
      ],
    },
  ];

  return (
    <>
      <Group justify="space-between">
        <UnstyledButton
          onClick={spotlight.open}
          className={cx({
            [classes.spotlightButton]: true,
            [classes.minimalMode]: minimalMode,
          })}
          variant="default"
          w="100%"
          c="dimmed"
        >
          {minimalMode ? (
            <IconSearch size={14} className={classes.spotlightButtonIcon} />
          ) : (
            <>
              <span className={classes.spotlightButtonSection}>
                <IconSearch size={14} className={classes.spotlightButtonIcon} />
                Search
              </span>
              {showShortcutHints && (
                <span className={classes.spotlightButtonSection}>
                  <Kbd c="dimmed" size="xs">
                    {os === "macos" ? "⌘" : "Ctrl"}
                  </Kbd>{" "}
                  +{" "}
                  <Kbd c="dimmed" size="xs">
                    K
                  </Kbd>
                </span>
              )}
            </>
          )}
        </UnstyledButton>
      </Group>
      <Spotlight
        actions={possibleActions}
        closeOnClickOutside
        nothingFound="Nothing found..."
        highlightQuery
        onQueryChange={setFilter}
        limit={10}
        scrollable={true}
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Search...",
        }}
      />
    </>
  );
}
