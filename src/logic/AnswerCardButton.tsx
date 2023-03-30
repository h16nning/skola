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
    <Button color={color} onClick={() => action()} size="lg">
      <Stack spacing={0} align="center">
        <Text fz="xs" fw={400}>
          {timeInfo}
        </Text>
        <Text fz="sm">{label}</Text>
      </Stack>
    </Button>
  );
}
