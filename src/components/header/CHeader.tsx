import {
    useMantineTheme,
    Burger,
    Header,
    MediaQuery,
    Text,
    ActionIcon,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons";

import React from "react";

export default function CHeader(props: {
    showSidebar: boolean;
    setShowSidebar: Function;
}) {
    const theme = useMantineTheme();
    return (
        <Header height={{ base: 50, md: 70 }} p="md">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                    <Burger
                        opened={props.showSidebar}
                        onClick={() => props.setShowSidebar((o: boolean) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                    />
                </MediaQuery>

                <Text>Application header</Text>
                <ActionIcon size="lg" variant="default">
                    <IconSettings size={20} />
                </ActionIcon>
            </div>
        </Header>
    );
}
