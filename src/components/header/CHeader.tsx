import {Header, Text, ActionIcon, Flex, UnstyledButton} from "@mantine/core";
import { Icon3dCubeSphere, IconSettings } from "@tabler/icons";

import { useNavigate } from "react-router-dom";

export default function CHeader() {
    const navigate = useNavigate();

    return (
        <Header height={{ base: 50, md: 70 }} p="md">
            <Flex
                justify="space-between"
                align="center"
                direction="row"
                wrap="nowrap"
                gap="md"
                style={{ height: "100%" }}
            >
                <UnstyledButton fw={700} onClick={() => navigate("/")}>
                    Super Anki
                </UnstyledButton>

                <ActionIcon onClick={() => navigate("/settings")}>
                    <IconSettings />
                </ActionIcon>
            </Flex>
        </Header>
    );
}
