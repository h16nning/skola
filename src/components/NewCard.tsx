import React, { useState } from "react";
import {
  Button,
  Center,
  Group,
  Select,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import CardTextEditor from "./CardTextEditor";
import { useDeckFromUrl } from "../logic/deck";
import MissingObject from "./MissingObject";
import { CardType } from "../logic/card";

interface NewCardProps {}

function NewCard({}: NewCardProps) {
  const [deck, failed, reloadDeck] = useDeckFromUrl();
  const [cardType, setCardType] = useState<string | null>(CardType.Normal);

  if (failed) {
    return <MissingObject />;
  }

  return (
    <Center>
      <Stack sx={{ width: "600px" }}>
        <Group position="apart">
          <Stack spacing={0}>
            <Text fz="sm" c="gray">
              Adding Cards to
            </Text>
            <Text fw="600">{deck?.name}</Text>
          </Stack>
          <Select
            value={cardType}
            onChange={setCardType}
            label="Card Type"
            data={[
              { label: "Normal", value: CardType.Normal },
              { label: "Cloze", value: CardType.Cloze },
              { label: "Image Occlusion", value: CardType.ImageOcclusion },
            ]}
          />
        </Group>
        <Space h="md" />
        <Stack spacing={0}>
          <Text fz="sm" fw={700}>
            Front Side
          </Text>
          <CardTextEditor />
        </Stack>
        <Stack spacing={0}>
          <Text fz="sm" fw={700}>
            Back Side
          </Text>
          <CardTextEditor />
        </Stack>
        <Group position="right">
          <Button leftIcon={<IconPlus />}>Add Card</Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default NewCard;
