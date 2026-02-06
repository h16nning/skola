import type { IconProps } from "@tabler/icons-react";
import type React from "react";
import "./Stat.css";

const BASE = "stat";

interface StatProps {
  value: number | string;
  icon: React.FC<IconProps>;
  name: string;
  color: string;
}

export default function Stat({ name, value, icon: Icon, color }: StatProps) {
  return (
    <div className={BASE} data-color={color}>
      <div className={`${BASE}__content`}>
        <span className={`${BASE}__value`}>{value}</span>
        <div className={`${BASE}__label`}>
          <Icon className={`${BASE}__icon`} />
          <span className={`${BASE}__name`}>{name}</span>
        </div>
      </div>
    </div>
  );
}
