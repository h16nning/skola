import React from "react";
import { Button, Center, Group, Space, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import CardTextEditor from "./CardTextEditor";
interface NewCardProps {}

function NewCard({}: NewCardProps) {
  return (
    <Center>
      <Stack sx={{ width: "600px" }}>
        <Group>
          <Stack spacing={0}>
            <Text fz="sm" c="gray">
              Adding Cards to
            </Text>
            <Text fw="600">Kategorie-Name</Text>
          </Stack>
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
