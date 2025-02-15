import {
  Alert,
  Anchor,
  Button,
  Center,
  CheckIcon,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect } from "react";

export default function WelcomeView() {
  const [_, setRegistered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

  useEffect(() => {}, []);
  return (
    <Center py="4rem" px="0.5rem" w="100%">
      <Stack gap="2rem" maw="600px">
        <div style={{ position: "relative" }}>
          <Image
            src="logo.svg"
            alt="Skola Logo"
            maw="4rem"
            style={{
              position: "absolute",
              filter: "blur(20px)",
              opacity: 0.5,
              zIndex: -1,
            }}
          />
          <Image src="logo.svg" alt="Skola Logo" maw="4rem" />
        </div>
        <Stack gap="xs">
          <Title order={1}>Welcome to Skola!</Title>
          <Text fz="sm">A flash card learning app here in your browser.</Text>
          {[
            "No sign-up required",
            "Free and open source",
            "Directly in your browser",
            "No tracking",
          ].map((item) => (
            <Group key={item} align="center" gap="xs">
              <CheckIcon
                style={{ color: "var(--mantine-color-green-strong)" }}
                size={12}
              />{" "}
              <Text fz="sm">{item}</Text>
            </Group>
          ))}
        </Stack>
        <Alert color="gray" icon={<IconInfoCircle />}>
          Please note that this app is still in early development. You may
          encounter bugs and missing features. If you find any issues, consider
          reporting them on the{" "}
          <Anchor
            href="https://www.github.com/h16nning/skola"
            fz="sm"
            style={{ whiteSpace: "nowrap" }}
          >
            GitHub repository
          </Anchor>
          .
        </Alert>
        <Stack gap="xs">
          <Title order={3}>About the project</Title>
          <Text fz="sm">
            Skola is a project developed by a student aiming to provide an
            alternative to spaced repetition apps like Anki and SuperMemo. It is
            open-source and completely free to use. The focus lies on creating a
            fun to use and intuitive experience. You can find more information
            on the{" "}
            <Anchor href="https://www.github.com/h16nning/skola" fz="sm">
              GitHub repository
            </Anchor>
            .
          </Text>
        </Stack>
        <Stack gap="xs">
          <Title order={3}>About privacy</Title>
          <Text fz="sm">
            Privacy is a priority of this project. Skola saves decks and cards
            locally in your browser using the IndexedDB API. Furthermore local
            storage and cookies are being used to store relevant data. We do not
            collect any personal data. Currently, a syncing feature is under
            development allowing you to store your data in the cloud. However,
            this feature is totally optional.
          </Text>
        </Stack>
        <Group align="start">
          <Button
            onClick={() => setRegistered(true)}
            size="md"
            variant="gradient"
          >
            Get Started Now
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
