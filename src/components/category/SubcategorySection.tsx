import React from "react";
import Section from "../settings/Section";
import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import CategoryTable from "./CategoryTable";

interface SubcategorySectionProps {}

function SubcategorySection({}: SubcategorySectionProps) {
  return (
    <Section
      title={
        <Group position="apart">
          <span>Subcategories</span>
          <Button variant="default" leftIcon={<IconPlus />}>
            New Subcategory
          </Button>
        </Group>
      }
    >
      <CategoryTable
        categoryIDList={["dsfkj", "sdfklj", "sldkfj", "slödkfj", "sldfkj"]}
      />
    </Section>
  );
}

export default SubcategorySection;
