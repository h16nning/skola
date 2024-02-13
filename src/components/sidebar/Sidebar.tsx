import classes from "./Sidebar.module.css";
import cx from "clsx";
import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Group,
  NavLink,
  Stack,
  Title,
  Tooltip,
  Image,
  useMantineTheme,
  Box,
  Text,
  rem,
  Button,
  Kbd,
} from "@mantine/core";
import {
  IconBolt,
  IconCards,
  IconChartBar,
  IconHome,
  IconPlus,
  IconSettings,
  IconX,
  IconSearch,
  IconSquare,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDebouncedState, useMediaQuery } from "@mantine/hooks";
import { t } from "i18next";
import DeckTree from "./DeckTree";
import {
  determineSuperDecks,
  getDeck,
  useDecks,
  useTopLevelDecks,
} from "../../logic/deck";
import NewDeckModal from "../deck/NewDeckModal";

import { Spotlight, spotlight } from "@mantine/spotlight";
import { Card, CardType, useCardsWith } from "../../logic/card";
import selectCards from "../../logic/card_filter";
import { getUtils } from "../../logic/CardTypeManager";

const InteractiveNavLink = ({
  label,
  path,
  icon,
  minimalMode,
  fullscreenMode,
  closeMenu,
}: {
  label: string;
  path: string;
  icon: JSX.Element;
  minimalMode: boolean;
  fullscreenMode: boolean;
  closeMenu: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Tooltip
      label={label}
      disabled={!minimalMode || fullscreenMode}
      position="right"
      keepMounted={false}
    >
      <NavLink
        classNames={{
          root: classes.sidebarItem,
          body: classes.sidebarItemBody,
          label: classes.sidebarItemLabel,
          section: classes.sidebarItemIcon,
        }}
        variant="subtle"
        label={label}
        leftSection={icon}
        onClick={() => {
          navigate(path);
          fullscreenMode && closeMenu();
        }}
        active={location.pathname.startsWith(path)}
      />
    </Tooltip>
  );
};

interface CardWithPreview extends Card<CardType> {
  computedPreview: string;
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
      const previews = cards?.map(async (card) => {
        return await getUtils(card).displayPreview(card);
      });
      const decksPromises = cards?.map(async (card) => {
        const deck = await getDeck(card.deck);
        const superDecks = await determineSuperDecks(deck);
        return [
          ...(superDecks[0] || []).map((sd) => sd.name),
          deck?.name || "Empty",
        ];
      });
      const cp = await Promise.all(previews);
      const decks = await Promise.all(decksPromises);
      setFilteredCards(
        cards.map((card, i) => ({
          ...card,
          computedPreview: cp[i],
          breadcrumb: decks[i],
        }))
      );
    }
    filterCards(cards || []);
  }, [cards]);

  return filteredCards;
};

function SpotlightCard({}) {
  const [filter, setFilter] = useDebouncedState("", 250);
  const navigate = useNavigate();
  const filteredCards = useSearchCard(filter);
  const [filteredDecks] = useDecks();
  const newActions = [
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
            label: card.computedPreview,
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
        <Button
          onClick={spotlight.open}
          leftSection={<IconSearch size={14} />}
          variant="default"
          w="100%"
          c="dimmed"
          rightSection={
            <>
              <Kbd c="dimmed">⌘</Kbd> + <Kbd c="dimmed">K</Kbd>
            </>
          }
        >
          Search
        </Button>
      </Group>
      <Spotlight
        actions={newActions}
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

function Sidebar({
  menuOpened,
  menuHandlers,
}: {
  menuOpened: boolean;
  menuHandlers: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
}) {
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const theme = useMantineTheme();

  const fullscreenMode = !!useMediaQuery(
    "(max-width: " + theme.breakpoints.xs + ")"
  );
  const isXsLayout = useMediaQuery("(min-width: " + theme.breakpoints.sm + ")");
  const minimalMode = !!useMediaQuery(
    "(max-width: " +
      theme.breakpoints.lg +
      ") and (min-width: " +
      theme.breakpoints.xs +
      ")"
  );

  const landscapeMode = useMediaQuery("(orientation: landscape)");
  const [decks, isReady] = useTopLevelDecks();

  return (
    <Box
      p="0.5rem"
      className={cx(
        classes.sidebar,
        minimalMode && classes.minimalMode,
        landscapeMode && classes.landscapeMode,
        fullscreenMode && classes.fullscreenMode,
        fullscreenMode && menuOpened && classes.fullscreenModeOpened
      )}
    >
      <Stack gap="xs">
        <Group className={classes.topRow}>
          <Group gap="xs" align="center">
            <Image src="/logo.svg" alt="Skola Logo" maw="1.5rem" />
            <Title order={5}>Skola</Title>
          </Group>
          {fullscreenMode ? (
            <ActionIcon
              onClick={menuHandlers.close}
              style={{ alignSelf: "end" }}
              variant="subtle"
            >
              <IconX />
            </ActionIcon>
          ) : null}
        </Group>
        <SpotlightCard />

        <InteractiveNavLink
          label={t("home.title")}
          path="/home"
          icon={<IconHome />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
        <InteractiveNavLink
          label={t("today.title")}
          path="/today"
          icon={<IconBolt />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
        <InteractiveNavLink
          label={t("statistics.title")}
          path="/stats"
          icon={<IconChartBar />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />

        <InteractiveNavLink
          label={t("manage-cards.title")}
          path="/cards"
          icon={<IconCards />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
        <InteractiveNavLink
          label={t("settings.title")}
          path="/settings"
          icon={<IconSettings />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
      </Stack>
      {isXsLayout && !minimalMode && (
        <>
          <Text c="dimmed" p="xs" pt="md" fz="sm">
            {t("sidebar.decks-title")}
          </Text>
          {isReady &&
            decks?.map((deck) => <DeckTree deck={deck} key={deck.id} />)}
          <NavLink
            label={
              <Text c="dimmed" fz="xs">
                {t("sidebar.decks-add")}
              </Text>
            }
            onClick={() => setNewDeckModalOpened(true)}
            leftSection={<IconPlus size={"1rem"} color={"gray"} />}
          />
          <NewDeckModal
            opened={newDeckModalOpened}
            setOpened={setNewDeckModalOpened}
          />
        </>
      )}
    </Box>
  );
}

export default Sidebar;
