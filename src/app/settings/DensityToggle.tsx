import { InputDescription } from "@/components/ui/InputDescription";
import { InputLabel } from "@/components/ui/InputLabel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { setSetting } from "@/logic/settings/setSetting";
import {
  IconAdjustments,
  IconLayoutDistributeVertical,
  IconSquare,
} from "@tabler/icons-react";
import { t } from "i18next";
import { SettingsValues } from "../../logic/settings/Settings";
import "./DensityToggle.css";

const BASE = "density-toggle";

export default function DensityToggle() {
  const [densityPreference] = useSetting("densityPreference");

  const handleDensityChange = (value: string) => {
    setSetting(
      "densityPreference",
      (value as SettingsValues["densityPreference"]) || "auto"
    );

    const html = document.documentElement;
    if (value === "auto") {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      if (isTouch) {
        html.removeAttribute("data-density");
      } else {
        html.setAttribute("data-density", "compact");
      }
    } else if (value === "compact") {
      html.setAttribute("data-density", "compact");
    } else {
      html.removeAttribute("data-density");
    }
  };

  return (
    <div className={BASE}>
      <InputLabel>{t("settings.appearance.density")}</InputLabel>
      <InputDescription>
        {t("settings.appearance.density-description")}
      </InputDescription>
      <SegmentedControl
        value={densityPreference}
        onChange={handleDensityChange}
        data={[
          {
            value: "relaxed",
            label: (
              <div className={`${BASE}__option`}>
                <IconLayoutDistributeVertical size={16} />
                <span className={`${BASE}__option-text`}>
                  {t("settings.appearance.density-relaxed")}
                </span>
              </div>
            ),
          },
          {
            value: "compact",
            label: (
              <div className={`${BASE}__option`}>
                <IconSquare size={16} />
                <span className={`${BASE}__option-text`}>
                  {t("settings.appearance.density-compact")}
                </span>
              </div>
            ),
          },
          {
            value: "auto",
            label: (
              <div className={`${BASE}__option`}>
                <IconAdjustments size={16} />
                <span className={`${BASE}__option-text`}>
                  {t("settings.appearance.density-auto")}
                </span>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
