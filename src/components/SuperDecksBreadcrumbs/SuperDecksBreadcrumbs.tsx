import classes from "./SuperDecksBreadcrumbs.module.css";
import React from "react";
import { Anchor, Box, Breadcrumbs, Group, Title } from "@mantine/core";
import { Deck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { IconHome, IconCardsFilled, IconCards } from "@tabler/icons-react";

interface SuperDecksBreadcrumbsProps {
  superDecks: Deck[] | undefined;
}
function SuperDecksBreadcrumbs({ superDecks }: SuperDecksBreadcrumbsProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { width } = useViewportSize();

  return (
    <Box
      component="div"
      className={classes.wrapper}
      w={width / 3}
      style={{ flexGrow: 2 }}
    >
      <Breadcrumbs className={classes.breadcrumbs}>
        <Anchor
          key={0}
          component="button"
          type="button"
          lh="1.5"
          onClick={() => navigate("/home")}
        >
          <Group wrap="nowrap" gap="xs">
            <IconHome size="1em" /> {t("home.title")}
          </Group>
        </Anchor>
        {superDecks?.map((s, idx) => (
          <Anchor
            key={s.id}
            component="button"
            type="button"
            style={{
              fontWeight: idx === superDecks.length - 1 ? "bold" : "normal",
              color: idx === superDecks.length - 1 ? "red" : "blue",
            }}
            onClick={() => navigate("/deck/" + s.id)}
          >
            <Group wrap="nowrap" gap="xs">
              <IconCards size="1rem" /> {s.name}
            </Group>
          </Anchor>
        ))}
      </Breadcrumbs>
    </Box>
  );
}

export default SuperDecksBreadcrumbs;
