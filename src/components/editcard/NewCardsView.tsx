import React, { useMemo, useState } from "react";
import { ActionIcon, Group, Select, Space, Stack } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useDeckFromUrl, useDecks } from "../../logic/deck";
import MissingObject from "../custom/MissingObject";
import { CardType } from "../../logic/card";
import { useNavigate } from "react-router-dom";
import { getUtilsOfType } from "../../logic/CardTypeManager";
import SelectDecksHeader from "../custom/SelectDecksHeader";

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
    <Stack sx={{ width: "600px" }} key="stack">
      <Group position="apart">
        <Group spacing="xs" align="end">
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
            { label: "Cloze", value: CardType.Cloze },
            { label: "Image Occlusion", value: CardType.ImageOcclusion },
          ]}
        />
      </Group>
      <Space h="md" />
      {CardEditor}
    </Stack>
  );
}

export default NewCardsView;
