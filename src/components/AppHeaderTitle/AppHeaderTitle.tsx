import { PropsWithChildren } from "react";
import "./AppHeaderTitle.css";

const BASE = "app-header-title";

export default function AppHeaderTitle({ children }: PropsWithChildren) {
  return (
    <div className={`${BASE}__wrapper`}>
      <h3 className={BASE}>{children}</h3>
    </div>
  );
}
