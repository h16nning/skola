import React from "react";
import { Text } from "@mantine/core";
import { swapMono } from "../logic/ui";

export default function GlobalApplicationInfo() {
  return (
    <Text
      size="xs"
      sx={(theme) => ({
        position: "absolute",
        bottom: "0.5rem",
        right: "0.5rem",
        color: swapMono(theme, 7, 1),
      })}
    >
      Skola (alpha version) | by Henning Thomas Flath
    </Text>
  );
}
