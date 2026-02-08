import type { IconProps } from "@tabler/icons-react";
import { t } from "i18next";
import "./EmptyNotice.css";

const BASE = "empty-notice";

interface EmptyNoticeProps {
  icon: React.FC<IconProps>;
  title?: string;
  description?: string;
  hideTitle?: boolean;
  className?: string;
}

function EmptyNotice({
  icon: Icon,
  description,
  title,
  hideTitle,
  className = "",
}: EmptyNoticeProps) {
  const classes = [BASE, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className={`${BASE}__icon`}>
        <Icon />
      </div>
      {!hideTitle && (
        <span className={`${BASE}__title`}>
          {title || t("global.no-items-title")}
        </span>
      )}
      <span className={`${BASE}__description`}>{description}</span>
    </div>
  );
}

export default EmptyNotice;
