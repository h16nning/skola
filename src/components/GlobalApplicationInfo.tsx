import React from "react";
import { Text } from "@mantine/core";

export default function GlobalApplicationInfo() {
  return (
    <Text
      size="xs"
      style={{
        position: "absolute",
        bottom: "0.5rem",
        right: "0.5rem",
        color: "gray",
      }}
    >
      Skola (alpha version) | by Henning Thomas Flath
    </Text>
  );
}
