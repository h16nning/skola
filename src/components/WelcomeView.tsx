import {
  Alert,
  Anchor,
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import React, { useEffect } from "react";

export default function WelcomeView() {
  const [_, setRegistered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

  useEffect(() => {}, []);
  return (
    <Center py="4rem" px="0.5rem" w="100%">
      <Stack gap="2rem" maw="600px">
        <Image src="logo.svg" alt="Skola Logo" maw="4rem" />
        <Stack gap="xs">
          <Title order={1}>Welcome to Skola!</Title>
          <Text fz="sm">
            An open-source and free flash card learning app in your browser.
          </Text>
        </Stack>
        <Alert color="gray" icon={<IconInfoCircle />}>
          Please note that this app is still in early development. You may encounter bugs and missing features. If you find any issues, consider reporting them on the{" "} <Anchor href="https://www.github.com/h16nning/skola">GitHub repository</Anchor>.
        </Alert>
        <Stack gap="xs">
          <Title order={3}>About the project</Title>
          <Text fz="sm">
            Skola aims to provide an alternative to spaced repetition apps like Anki and SuperMemo. It is open-source and completely free to use. The focus lies on creating a fun to use and intuitive experience. You can find more information on the <Anchor href="https://www.github.com/h16nning/skola">GitHub repository</Anchor>.
          </Text>
        </Stack>
        <Stack gap="xs">
          <Title order={3}>About privacy</Title>
          <Text fz="sm">
            Privacy is a focus of this project. Skola saves decks and cards
            locally in your browser using the IndexedDB API. Furthermore local
            storage and cookies are being used to store relevant data. We do not
            collect any personal data.
            <b>You agree to the above by using this app.</b>
          </Text>
        </Stack>
        <Group align="start">
          <Button
            onClick={() => setRegistered(true)}
            size="md"
            variant="gradient"
          >
            Get started
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
