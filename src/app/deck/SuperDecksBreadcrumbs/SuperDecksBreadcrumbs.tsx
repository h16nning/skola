import { IconCards, IconHome } from "@tabler/icons-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "../../../components/ui";
import { Deck } from "../../../logic/deck/deck";
import { useViewportSize } from "../../../lib/hooks/useViewportSize";
import classes from "./SuperDecksBreadcrumbs.module.css";

const BASE_URL = "super-decks-breadcrumbs";

interface SuperDecksBreadcrumbsProps {
  superDecks: Deck[] | undefined;
}

function SuperDecksBreadcrumbs({ superDecks }: SuperDecksBreadcrumbsProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { width } = useViewportSize();

  return (
    <div
      className={`${BASE_URL}__wrapper ${classes.wrapper}`}
      style={{
        width: width / 3,
        flexGrow: 2,
      }}
    >
      <Breadcrumbs className={classes.breadcrumbs}>
        <BreadcrumbItem onClick={() => navigate("/home")}>
          <IconHome size="1em" /> {t("home.title")}
        </BreadcrumbItem>

        {superDecks && superDecks.length > 0 && (
          <>
            {superDecks.map((deck, idx) => (
              <React.Fragment key={deck.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  onClick={() => navigate("/deck/" + deck.id)}
                  isActive={idx === superDecks.length - 1}
                >
                  <IconCards size="1rem" /> {deck.name}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </>
        )}
      </Breadcrumbs>
    </div>
  );
}

export default SuperDecksBreadcrumbs;
