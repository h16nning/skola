import classes from "./NotebookView.module.css";
import { useCardsOf } from "../../logic/card";
import { useDeckFromUrl } from "../../logic/deck";
import NotebookCard from "./NotebookCard";
import { Button, Stack, Title } from "@mantine/core";
import Section from "../settings/Section";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function NotebookView() {
  const navigate = useNavigate();
  const [deck, isReady, params] = useDeckFromUrl();

  const [cards] = useCardsOf(deck);

  return (
    <Section
      title="Notebook View"
      rightSection={
        <Button
          leftSection={<IconPlus />}
          variant="default"
          onClick={() => navigate("/new/" + deck?.id)}
        >
          Add Cards
        </Button>
      }
    >
      <Stack gap="sm">
        {cards?.map((c) => (
          <NotebookCard card={c} />
        ))}
      </Stack>
    </Section>
  );
}
