import React from "react";
import { Box } from "@mantine/core";
import { swapMono } from "../logic/ui";
import { IconArrowUp } from "@tabler/icons-react";

interface CardTableHeadItemProps {
  name: string;
  id: string;
  sort: [string, boolean];
  setSort: (sort: [string, boolean]) => void;
}

export default function CardTableHeadItem({
  name,
  id,
  sort,
  setSort,
}: CardTableHeadItemProps) {
  return (
    <Box
      component="th"
      sx={(theme) => ({
        borderBottom: "none !important",
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm,
        fontSize: theme.fontSizes.xs + " !important",
        lineHeight: "1rem",
        "&&": { fontWeight: 500 }, //override table default
        color:
          (theme.colorScheme === "light" ? theme.black : theme.white) +
          " !important",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: swapMono(theme, 1, 7),
        },
        "&:active": { transform: "scale(0.97)" },
      })}
      onClick={() => {
        setSort([id, sort[0] === id ? !sort[1] : true]);
      }}
    >
      <Box
        component="div"
        sx={(theme) => ({
          display: "inline-flex",
          alignItems: "center",
          lineHeight: "1rem",
          gap: "0.25rem",
          height: "1rem",
          "& svg": {
            color: swapMono(theme, 6, 6),
            opacity: sort[0] === id ? 1 : 0,
            transition: "transform 0.2s ease, opacity 0.1s ease",
            transform: sort[0] === id && !sort[1] ? "rotate(180deg)" : "none",
          },
        })}
      >
        <span>{name}</span>
        {<IconArrowUp size={16} />}
      </Box>
    </Box>
  );
}
