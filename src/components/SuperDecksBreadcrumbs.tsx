import React from "react";
import { Anchor, Breadcrumbs } from "@mantine/core";
import { Deck } from "../logic/deck";
import { useNavigate } from "react-router-dom";

interface SuperDecksBreadcrumbsProps {
  superDecks: Deck[] | undefined;
}
function SuperDecksBreadcrumbs({ superDecks }: SuperDecksBreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <Breadcrumbs>
      <Anchor
        key={0}
        component="button"
        type="button"
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
  );
}

export default SuperDecksBreadcrumbs;
