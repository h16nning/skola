import { ActionIcon, Group, Select, Space, Stack, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUtilsOfType } from "../../logic/TypeManager";
import { CardType, CardTypesLabels } from "../../logic/card";
import { useDeckFromUrl, useDecks } from "../../logic/deck";
import { AppHeaderContent } from "../Header/Header";
import MissingObject from "../custom/MissingObject";
import SelectDecksHeader from "../custom/SelectDecksHeader";
import EditorOptionsMenu from "./EditorOptionsMenu";

function NewCardsView() {
  const navigate = useNavigate();
  const [t] = useTranslation();

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
          <Title order={3}>{t("new-card.add")}</Title>
          <EditorOptionsMenu />
        </Group>
      </AppHeaderContent>
      <Group justify="space-between">
        <Group gap="xs" align="end">
          <ActionIcon onClick={() => navigate(-1)}>
            <IconChevronLeft />
          </ActionIcon>
          <SelectDecksHeader
            label={t("new-card.add-to-deck")}
            decks={decks}
            disableAll
            onSelect={(deckId) => navigate(`/new/${deckId}`)}
          />
        </Group>

        <Select
          value={cardType}
          onChange={(type) =>
            setCardType((type as CardType) ?? CardType.Normal)
          }
          label={t("new-card.card-type")}
          data={[
            { label: CardTypesLabels[CardType.Normal], value: CardType.Normal },
            {
              label: CardTypesLabels[CardType.DoubleSided],
              value: CardType.DoubleSided,
            },
            { label: CardTypesLabels[CardType.Cloze], value: CardType.Cloze },
            {
              label: CardTypesLabels[CardType.ImageOcclusion],
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
