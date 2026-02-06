import { Stack } from "@/components/ui/Stack";
import { t } from "i18next";

export default function AboutSettingsView() {
  return (
    <Stack gap="xl" align="start">
      <p style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "var(--theme-neutral-700)", margin: 0 }}>
        {t("settings.about.description")}
      </p>
      <a
        href="https://www.github.com/h16nning/super-anki"
        style={{
          fontSize: "0.875rem",
          color: "var(--theme-primary-600)",
          textDecoration: "none",
          fontWeight: 500,
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link to Git Repository
      </a>
    </Stack>
  );
}
