import type { ReactNode } from "react";
import "./Section.css";

const BASE = "settings-section";

type SectionProps = {
  title: string | ReactNode;
  children: ReactNode;
  rightSection?: ReactNode;
  className?: string;
};

export default function Section({
  title,
  children,
  rightSection,
  className = "",
}: SectionProps) {
  return (
    <div className={`${BASE} ${className}`}>
      <div className={`${BASE}__header`}>
        <h4 className={`${BASE}__title`}>{title}</h4>
        {rightSection && (
          <div className={`${BASE}__right-section`}>{rightSection}</div>
        )}
      </div>
      <div className={`${BASE}__content`}>{children}</div>
    </div>
  );
}
