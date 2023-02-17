import { Header, ActionIcon, Flex, UnstyledButton } from "@mantine/core";
import { IconSettings } from "@tabler/icons";

import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <Header height="100" p="sm" withBorder={false}>
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
        gap="md"
        sx={() => ({ height: "100%" })}
      >
        <UnstyledButton fz="sm" fw={600} onClick={() => navigate("/")}>
          Super Anki
        </UnstyledButton>

        <ActionIcon onClick={() => navigate("/settings")}>
          <IconSettings />
        </ActionIcon>
      </Flex>
    </Header>
  );
}
