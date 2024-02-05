import classes from "./CardTable.module.css";
import cx from "clsx";
import React from "react";
import { Box, Table } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

interface CardTableHeadItemProps {
  name: string;
  id: string;
  sort: [string, boolean];
  setSort: (sort: [string, boolean]) => void;
}

export default function CardTableHeadItem({
  name,
  id,
  sort,
  setSort,
}: CardTableHeadItemProps) {
  return (
    <Table.Th
      className={classes.th}
      component="th"
      onClick={() => {
        setSort([id, sort[0] === id ? !sort[1] : true]);
      }}
    >
      <Box
        className={cx(classes.thInnerWrapper, {
          [classes.thInnerWrapperActive]: sort[0] === id,
          [classes.thInnerWrapperActiveDesc]: sort[0] === id && !sort[1],
        })}
        component="div"
      >
        <span>{name}</span>
        {<IconArrowUp size={16} />}
      </Box>
    </Table.Th>
  );
}
