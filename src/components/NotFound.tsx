import { IconHome } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import "./NotFound.css";
import { t } from "i18next";

const BASE = "not-found";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={`${BASE}`}>
      <div className={`${BASE}__content`}>
        <h1 className={`${BASE}__title`}>{t("not-found.title")}</h1>
        <p className={`${BASE}__message`}>{t("not-found.message")}</p>
        <Button
          variant="destructive"
          leftSection={<IconHome />}
          onClick={() => navigate("/home")}
        >
          {t("not-found.go-back-home")}
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
