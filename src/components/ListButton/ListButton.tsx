import { IconChevronRight } from "@tabler/icons-react";
import React from "react";
import classes from "./ListButton.module.css";

const BASE_URL = "list-button";

interface ListButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  onContextMenu?: () => void;
}

function ListButton({ children, onClick, onContextMenu }: ListButtonProps) {
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={classes.listButton}
      type="button"
    >
      <div className={`${BASE_URL}__content`}>
        {children}
        <IconChevronRight className={classes.rightArrow} />
      </div>
    </button>
  );
}

export default ListButton;
