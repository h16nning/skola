import { Button, Center, Group, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import NewCategoryModal from "./category/NewCategoryModal";
import CategoryTable from "./category/CategoryTable";

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
          <CategoryTable
            categoryIDList={["slkdfj", "ösdlkfj", "söldkfj", "söldkfj"]}
          />
        </Stack>
      </Center>
      <NewCategoryModal
        opened={newCategoryModalOpened}
        setOpened={setNewCategoryModalOpened}
      />
    </>
  );
}
