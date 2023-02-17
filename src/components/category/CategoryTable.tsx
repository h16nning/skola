import React from "react";
import { Stack } from "@mantine/core";
import CategoryPreview from "./CategoryPreview";

interface CategoryTableProps {
  categoryIDList: Array<String>;
}

function CategoryTable({ categoryIDList }: CategoryTableProps) {
  return (
    <Stack spacing={0}>
      {categoryIDList.map((id, index) => (
        <CategoryPreview id={id} i={index} />
      ))}
    </Stack>
  );
}

export default CategoryTable;
