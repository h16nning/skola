import { Box, Table } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import cx from "clsx";
import { NoteSortFunction } from "../../logic/NoteSorting";
import classes from "./CardTable.module.css";

interface CardTableHeadItemProps {
  name: string;
  sortFunction: NoteSortFunction;
  sort: [NoteSortFunction, boolean];
  setSort: (sort: [NoteSortFunction, boolean]) => void;
}

export default function CardTableHeadItem({
  name,
  sortFunction,
  sort,
  setSort,
}: CardTableHeadItemProps) {
  return (
    <Table.Th
      className={classes.th}
      component="th"
      onClick={() => {
        setSort([sortFunction, sort[0] === sortFunction ? !sort[1] : true]);
      }}
    >
      <Box
        className={cx(classes.thInnerWrapper, {
          [classes.thInnerWrapperActive]: sort[0] === sortFunction,
          [classes.thInnerWrapperActiveDesc]:
            sort[0] === sortFunction && !sort[1],
        })}
        component="div"
      >
        <span>{name}</span>
        {<IconArrowUp size={16} />}
      </Box>
    </Table.Th>
  );
}
