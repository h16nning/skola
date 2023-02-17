import { Alert, Badge, Group, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Category, getCategory } from "../../logic/category";
import { useNavigate } from "react-router-dom";
import TableRowButton from "../custom/TableRowButton";

type CategoryPreviewProps = {
  id: String;
  i: number;
};

export default function CategoryPreview({ id, i }: CategoryPreviewProps) {
  const [category, setCategory] = useState<Category>();
  const navigate = useNavigate();

  useEffect(() => {
    setCategory(getCategory(id));
  }, [id]);
  return (
    <TableRowButton
      i={i}
      onClick={() => {
        navigate("/category/" + id);
      }}
    >
      {category ? (
        <Group position="apart" w="100%" noWrap={true}>
          <Text>{category.name}</Text>
          <Group spacing="xs" noWrap={true}>
            <Badge variant="dot" color="red">
              3 fällig
            </Badge>
            <Badge variant="dot" color="blue">
              7 neu
            </Badge>
          </Group>
        </Group>
      ) : (
        <Alert title="Error" color="red" variant="filled">
          This card failed to load
        </Alert>
      )}
    </TableRowButton>
  );
}
