import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Center, Group, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconHome } from "@tabler/icons";

function MissingObject() {
  const navigate = useNavigate();
  return (
    <Center>
      <Stack w="600">
        <Text color="red" fw="bold" fz="20px">
          Something went wrong!
        </Text>
        <Text>Unfortunately what you are looking for couldn't be found.</Text>
        <Group position="left">
          <Button
            variant="default"
            leftIcon={<IconHome />}
            onClick={() => navigate("/home")}
          >
            Go home
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default MissingObject;
