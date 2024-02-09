import React from "react";
import { Button, Stack, Text } from "@mantine/core";

interface AnswerCardButtonProps {
  label: string;
  timeInfo: string;
  color: string;

  action: Function;
}

export default function AnswerCardButton({
  label,
  timeInfo,
  color,
  action,
}: AnswerCardButtonProps) {
  return (
    <Button
      color={color}
      onClick={() => action()}
      h="2.5rem"
      px={0}
      fullWidth
      miw="0"
    >
      <Stack gap="0" align="center">
        <Text fz="xs" fw={400} lh="1">
          {timeInfo}
        </Text>
        <Text fz="sm" fw={600} lh="1.25">
          {label}
        </Text>
      </Stack>
    </Button>
  );
}
