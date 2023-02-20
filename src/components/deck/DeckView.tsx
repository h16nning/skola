import React, { useEffect, useState } from "react";
import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Center,
  Group,
  Skeleton,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import SubdeckSection from "./SubdeckSection";
import { IconBolt, IconPlus } from "@tabler/icons";
import DeckMenu from "./DeckMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { Deck, getDeck } from "../../logic/deck";
import DeckOptionsModal from "./DeckOptionsModal";

function useDeckFromUrl(): [Deck | undefined, boolean] {
  const [deck, setDeck] = useState<Deck | undefined>();
  const [failed, setFailed] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    const id = location.pathname.split("/")[2];
    if (id) {
      void tryFetchDeck(id);
    } else {
      setFailed(true);
    }
  }, [location]);
  async function tryFetchDeck(id: string) {
    const d = await getDeck(id);
    if (d === undefined) {
      setFailed(true);
    }
    setDeck(d);
  }

  return [deck, failed];
}

function DeckView() {
  const navigate = useNavigate();
  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, failed] = useDeckFromUrl();

  if (failed) {
    return <FailedDeckView />;
  } else {
    return (
      <>
        <Center>
          <Stack spacing="lg" sx={() => ({ width: "600px" })}>
            <Stack spacing={0}>
              <Breadcrumbs>
                {[
                  <Anchor key={1} href="/">
                    Home
                  </Anchor>,
                  <Anchor key={2} href="/">
                    Test
                  </Anchor>,
                ]}
              </Breadcrumbs>
              <Group position="apart">
                {deck ? (
                  <Title order={2}>{deck.name}</Title>
                ) : (
                  <Skeleton width="200px" height="30px" />
                )}
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
            </Stack>

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
                  onClick={() => navigate("/new")}
                >
                  Add Cards
                </Button>
              </Group>
            </Stack>

            <Space h="xl" />
            <SubdeckSection deck={deck} />
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
}

function FailedDeckView() {
  return <Text>Sadly no deck exists here :(</Text>;
}
export default DeckView;
