import React from "react";
import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Center,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import SubcategorySection from "./SubcategorySection";
import { IconBolt, IconPlus } from "@tabler/icons";
import CategoryMenu from "./CategoryMenu";
import LinkButton from "../custom/LinkButton";
import { useNavigate } from "react-router-dom";

function CategoryView() {
  const navigate = useNavigate();

  return (
    <Center>
      <Stack spacing="lg" sx={() => ({ width: "600px" })}>
        <Stack spacing={0}>
          <Breadcrumbs>
            {[<Anchor href="/">Home</Anchor>, <Anchor href="/">Test</Anchor>]}
          </Breadcrumbs>
          <Group position="apart">
            <Title order={2}>Category</Title>
            <Group spacing="xs">
              <Button leftIcon={<IconBolt />}>Learn</Button>
              <CategoryMenu />
            </Group>
          </Group>
        </Stack>

        <Space h="xl" />
        <Stack spacing={0}>
          <Group position="apart">
            <Group>
              <Text fw={700}>216 Karten</Text>
              <Badge variant="dot" color="red">
                16 due
              </Badge>
              <Badge variant="dot" color="blue">
                10 new
              </Badge>
            </Group>
            <Button
              leftIcon={<IconPlus />}
              variant="default"
              onClick={() => navigate("/new")}
            >
              Add Cards
            </Button>
          </Group>

          <Stack align="start" spacing={0}>
            <LinkButton>Manage Cards</LinkButton>
            <LinkButton>Statistics</LinkButton>
          </Stack>
        </Stack>

        <Space h="xl" />
        <SubcategorySection />
      </Stack>
    </Center>
  );
}

export default CategoryView;
