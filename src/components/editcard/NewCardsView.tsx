import React, { useMemo, useState } from "react";
import { ActionIcon, Group, Select, Space, Stack, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useDeckFromUrl } from "../../logic/deck";
import MissingObject from "../custom/MissingObject";
import { CardType } from "../../logic/card";
import { useNavigate } from "react-router-dom";
import { swapLight } from "../../logic/ui";
import { getUtils } from "../CardTypeManager";

function NewCardsView() {
  const navigate = useNavigate();

  const [deck, failed] = useDeckFromUrl();
  const [cardType, setCardType] = useState<CardType>(CardType.Normal);

  const CardEditor = useMemo(() => {
    return deck ? getUtils(cardType).editor(null, deck, "new") : null;
  }, [deck, cardType]);

  if (failed) {
    return <MissingObject />;
  }

  if (!deck) {
    return null;
  }

  return (
    <Stack sx={{ width: "600px" }} key="stack">
      <Group position="apart">
        <Group spacing="xs">
          <ActionIcon onClick={() => navigate(-1)}>
            <IconChevronLeft />
          </ActionIcon>
          <Stack spacing={0}>
            <Text
              sx={(theme) => ({
                color: swapLight(theme),
                fontSize: theme.fontSizes.sm,
              })}
            >
              Adding Cards to
            </Text>
            <Text fw="500">{deck?.name}</Text>
          </Stack>
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
