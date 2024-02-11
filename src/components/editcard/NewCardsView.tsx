import React, { useMemo, useState } from "react";
import { ActionIcon, Group, Select, Space, Stack, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useDeckFromUrl, useDecks } from "../../logic/deck";
import MissingObject from "../custom/MissingObject";
import { CardType } from "../../logic/card";
import { useNavigate } from "react-router-dom";
import { getUtilsOfType } from "../../logic/CardTypeManager";
import SelectDecksHeader from "../custom/SelectDecksHeader";
import { AppHeaderContent } from "../Header/Header";
import EditorOptionsMenu from "./EditorOptionsMenu";

function NewCardsView() {
  const navigate = useNavigate();

  const [decks] = useDecks();
  const [deck, isReady] = useDeckFromUrl();
  const [cardType, setCardType] = useState<CardType>(CardType.Normal);

  const CardEditor = useMemo(() => {
    return deck ? getUtilsOfType(cardType).editor(null, deck, "new") : null;
  }, [deck, cardType]);

  if (isReady && !deck) {
    return <MissingObject />;
  }

  if (!deck) {
    return null;
  }

  return (
    <Stack w="100%" maw="600px" key="stack">
      <AppHeaderContent>
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <Space />
          <Title order={3}>Add card</Title>
          <EditorOptionsMenu />
        </Group>
      </AppHeaderContent>
      <Group justify="space-between">
        <Group gap="xs" align="end">
          <ActionIcon onClick={() => navigate(-1)}>
            <IconChevronLeft />
          </ActionIcon>
          <SelectDecksHeader label="Adding cards to" decks={decks} disableAll />
        </Group>

        <Select
          value={cardType}
          onChange={(type) =>
            setCardType((type as CardType) ?? CardType.Normal)
          }
          label="Card Type"
          data={[
            { label: "Normal", value: CardType.Normal },
            { label: "Double Sided", value: CardType.DoubleSided },
            { label: "Cloze (In Development)", value: CardType.Cloze },
            {
              label: "Image Occlusion (Not Working)",
              value: CardType.ImageOcclusion,
            },
          ]}
        />
      </Group>
      <Space h="md" />
      {CardEditor}
    </Stack>
  );
}

export default NewCardsView;
