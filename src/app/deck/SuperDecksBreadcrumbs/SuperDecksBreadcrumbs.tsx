import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui";
import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { Deck } from "@/logic/deck/deck";
import { IconHome } from "@tabler/icons-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface SuperDecksBreadcrumbsProps {
  deck?: Deck;
  superDecks: Deck[] | undefined;
}

function SuperDecksBreadcrumbs({
  deck,
  superDecks,
}: SuperDecksBreadcrumbsProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { width } = useViewportSize();

  return (
    <div
      style={{
        width: width / 3,
        flexGrow: 2,
      }}
    >
      <Breadcrumbs>
        <BreadcrumbItem onClick={() => navigate("/home")} isActive>
          <IconHome size="1em" /> {t("home.title")}
        </BreadcrumbItem>

        {superDecks &&
          superDecks.length > 0 &&
          superDecks.map((deck) => (
            <React.Fragment key={deck.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem onClick={() => navigate("/deck/" + deck.id)}>
                {deck.name}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        <BreadcrumbSeparator />
        {deck && (
          <BreadcrumbItem onClick={() => navigate("/deck/" + deck.id)}>
            {deck.name}
          </BreadcrumbItem>
        )}
      </Breadcrumbs>
    </div>
  );
}

export default SuperDecksBreadcrumbs;
