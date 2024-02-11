import { useCardsOf } from "../../logic/card";
import { useDeckFromUrl } from "../../logic/deck";
import NotebookCard from "./NotebookCard";
import { Button, Stack } from "@mantine/core";
import Section from "../settings/Section";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotebookView() {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [deck] = useDeckFromUrl();

  const [cards] = useCardsOf(deck);

  return (
    <Section
      title={t("deck.notebook.title")}
      rightSection={
        <Button
          leftSection={<IconPlus />}
          variant="default"
          onClick={() => navigate("/new/" + deck?.id)}
        >
          {t("deck.add-cards")}
        </Button>
      }
    >
      <Stack gap="sm">
        {cards?.map((c) => (
          <NotebookCard card={c} key={c.id} />
        ))}
      </Stack>
    </Section>
  );
}
