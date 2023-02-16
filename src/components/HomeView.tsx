import { Button, Card, Center, Group, Stack, Table } from "@mantine/core";
import CategoryPreview from "./category/CategoryPreview";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import NewCategoryModal from "./category/NewCategoryModal";
import newCategoryModal from "./category/NewCategoryModal";

export default function HomeView() {
  const [newCategoryModalOpened, setNewCategoryModalOpened] = useState(false);

  return (
    <>
      <Center>
        <Stack spacing="md" sx={{ width: "600px" }}>
          <Group position="right">
            <Button
              onClick={() => setNewCategoryModalOpened(true)}
              variant="default"
              leftIcon={<IconPlus />}
            >
              New Category
            </Button>
          </Group>
          <Stack spacing="xs" sx={{ width: "600px" }}>
            <CategoryPreview id="sdfsfd" i={0} />
            <CategoryPreview id="sdfsfd" i={1} />
            <CategoryPreview id="sdfsfd" i={2} />
            <CategoryPreview id="sdfsfd" i={3} />
            <CategoryPreview id="sdfsfd" i={4} />
          </Stack>
        </Stack>
      </Center>
      <NewCategoryModal
        opened={newCategoryModalOpened}
        setOpened={setNewCategoryModalOpened}
      >
        Test
      </NewCategoryModal>
    </>
  );
}
