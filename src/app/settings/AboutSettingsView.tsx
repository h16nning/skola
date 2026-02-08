import { t } from "i18next";
import "./AboutSettingsView.css";

const BASE = "about-skola";

export default function AboutSettingsView() {
  return (
    <div className={BASE}>
      <p>{t("settings.about.description")}</p>
      <a
        href="https://www.github.com/h16nning/skola"
        target="_blank"
        rel="noopener noreferrer"
      >
        Link to Git Repository
      </a>
    </div>
  );
}
