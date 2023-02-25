import React, { useState } from "react";
import {
  ActionIcon,
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Center,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import SubDeckSection from "./SubDeckSection";
import { IconBolt, IconChevronLeft, IconPlus } from "@tabler/icons";
import DeckMenu from "./DeckMenu";
import { useNavigate } from "react-router-dom";
import { useDeckFromUrl, useSuperDecks } from "../../logic/deck";
import DeckOptionsModal from "./DeckOptionsModal";
import LazySkeleton from "../../logic/LazySkeleton";
import MissingObject from "../MissingObject";

function DeckView() {
  const navigate = useNavigate();
  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, failed, reload] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);

  if (failed) {
    return <MissingObject />;
  }
  return (
    <>
      <Center>
        <Stack spacing="lg" sx={() => ({ width: "600px" })}>
          <Group position="apart">
            <Group spacing="xs" align="end">
              <ActionIcon onClick={() => navigate(-1)}>
                <IconChevronLeft />
              </ActionIcon>
              <Stack spacing={0}>
                <Breadcrumbs>
                  <Anchor
                    key={0}
                    component="button"
                    type="button"
                    onClick={() => navigate("/home")}
                  >
                    Home
                  </Anchor>
                  {superDecks?.map((s) => (
                    <Anchor
                      key={s.id}
                      component="button"
                      type="button"
                      onClick={() => navigate("/deck/" + s.id)}
                    >
                      {s.name}
                    </Anchor>
                  ))}
                </Breadcrumbs>
                <Title order={2}>{deck ? deck.name : "Test"}</Title>
              </Stack>
            </Group>
            <Group spacing="xs">
              <Button
                leftIcon={<IconBolt />}
                onClick={() => navigate("/learn")}
              >
                Learn
              </Button>
              <DeckMenu
                deck={deck}
                setDeckOptionsOpened={setDeckOptionsOpened}
              />
            </Group>
          </Group>

          <Space h="xl" />
          <Stack spacing={0}>
            <Group position="apart">
              <Group>
                <Text fz="sm" fw={600}>
                  216 Karten
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
