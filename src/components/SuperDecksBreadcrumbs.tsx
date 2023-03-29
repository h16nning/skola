import React from "react";
import { Anchor, Box, Breadcrumbs } from "@mantine/core";
import { Deck } from "../logic/deck";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { swapMono } from "../logic/ui";

interface SuperDecksBreadcrumbsProps {
  superDecks: Deck[] | undefined;
}
function SuperDecksBreadcrumbs({ superDecks }: SuperDecksBreadcrumbsProps) {
  const navigate = useNavigate();
  const { width } = useViewportSize();
  return (
    <Box
      component="div"
      sx={(theme) => ({
        width: width / 3,
        position: "relative",
        "&:after": {
          content: "''",
          //fading out the last breadcrumb
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "2rem",
          background: `linear-gradient(to left, ${
            theme.colorScheme === "light" ? theme.white : theme.colors.dark[7]
          }, transparent)`,
        },
      })}
    >
      <Breadcrumbs
        sx={() => ({
          whiteSpace: "nowrap",
          overflowX: "scroll",
          overflowY: "visible",
          //hiding scrollbars on ios
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          paddingRight: "1.5rem",
        })}
      >
        <Anchor
          key={0}
          component="button"
          type="button"
          lh="1.5"
          onClick={() => navigate("/home")}
        >
          Home
        </Anchor>
        {superDecks?.map((s) => (
          <Anchor
            key={s.id}
            component="button"
            type="button"
            onClick={() => navigate("/deck/" + s.id)}
          >
            {s.name}
          </Anchor>
        ))}
      </Breadcrumbs>
    </Box>
  );
}

export default SuperDecksBreadcrumbs;
