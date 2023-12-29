import classes from "./SuperDecksBreadcrumbs.module.css";
import React from "react";
import { Anchor, Box, Breadcrumbs } from "@mantine/core";
import { Deck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";

interface SuperDecksBreadcrumbsProps {
  superDecks: Deck[] | undefined;
}
function SuperDecksBreadcrumbs({ superDecks }: SuperDecksBreadcrumbsProps) {
  const navigate = useNavigate();
  const { width } = useViewportSize();
  return (
    <Box component="div" className={classes.wrapper} w={width / 3}>
      <Breadcrumbs className={classes.breadcrumbs}>
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
