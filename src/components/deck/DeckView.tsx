import React, { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import SubDeckSection from "./SubDeckSection";
import { IconBolt, IconChevronLeft, IconPlus } from "@tabler/icons-react";
import DeckMenu from "./DeckMenu";
import { useNavigate } from "react-router-dom";
import { useDeckFromUrl, useSuperDecks } from "../../logic/deck";
import DeckOptionsModal from "./DeckOptionsModal";
import MissingObject from "../MissingObject";
import SuperDecksBreadcrumbs from "../SuperDecksBreadcrumbs";
import { useCardsOf } from "../../logic/card";

function DeckView() {
  const navigate = useNavigate();
  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, failed, reload] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const cards = useCardsOf(deck);

  if (failed) {
    return <MissingObject />;
  }
  return (
    <>
      <Center>
        <Stack spacing="lg" sx={() => ({ width: "600px" })}>
          <Group spacing="xs" align="end" noWrap>
            <ActionIcon onClick={() => navigate(-1)}>
              <IconChevronLeft />
            </ActionIcon>
            <Stack spacing={0} w="100%">
              <SuperDecksBreadcrumbs superDecks={superDecks} />
              <Group position="apart" noWrap>
                <Title order={2}>{deck ? deck.name : ""}</Title>
                <Group spacing="xs">
                  <Button
                    leftIcon={<IconBolt />}
                    onClick={() => navigate("/learn/" + deck?.id)}
                  >
                    Learn
                  </Button>
                  <DeckMenu
                    deck={deck}
                    setDeckOptionsOpened={setDeckOptionsOpened}
                  />
                </Group>
              </Group>
            </Stack>
          </Group>

          <Space h="xl" />
          <Stack spacing={0}>
            <Group position="apart">
              <Group>
                <Text fz="sm" fw={600}>
                  {cards.length} Karten
                </Text>
                <Badge variant="dot" color="red">
                  16 due
                </Badge>
                <Badge variant="dot" color="blue">
                  10 new
                </Badge>
              </Group>
              <Button
                leftIcon={<IconPlus />}
                variant="default"
                onClick={() => navigate("/new/" + deck?.id)}
              >
                Add Cards
              </Button>
            </Group>
          </Stack>

          <Space h="xl" />
          <SubDeckSection deck={deck} reloadDeck={reload} />
          {deck ? (
            <DeckOptionsModal
              deck={deck}
              opened={deckOptionsOpened}
              setOpened={setDeckOptionsOpened}
            />
          ) : (
            ""
          )}
        </Stack>
      </Center>
    </>
  );
}
export default DeckView;
