import React, { useState } from "react";
import { Button, Stack } from "@mantine/core";
import SettingsInput from "./SettingsInput";
import { IconTrash } from "@tabler/icons-react";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import { db } from "../../logic/db";

export default function GeneralSettingsView() {
  const [deleteAllDataModalOpened, setDeleteAllDataModalOpened] =
    useState<boolean>(false);
  return (
    <>
      <Stack spacing="xl" align="start">
        <SettingsInput
          label={"Name"}
          description="This name will be used to customize user experience"
          settingsKey={"name"}
          inputType={"text"}
        />
        <SettingsInput
          label={"Enable Developer Mode"}
          description={
            "This will enable additional options for debugging and creating custom plugins and themes."
          }
          settingsKey="developerMode"
          inputType={"switch"}
        />
        <Button
          leftIcon={<IconTrash />}
          variant="filled"
          color="red"
          onClick={() => setDeleteAllDataModalOpened(true)}
        >
          Delete all Data
        </Button>
      </Stack>
      <DangerousConfirmModal
        dangerousAction={() => db.delete()}
        dangerousDependencies={[]}
        dangerousTitle="Delete all Data"
        dangerousDescription="This will delete all of your data including your cards, decks and settings. There is absolutely no way to recover. Are you sure you want to continue?"
        opened={deleteAllDataModalOpened}
        setOpened={setDeleteAllDataModalOpened}
      />
    </>
  );
}
