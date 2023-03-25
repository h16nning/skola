import React, { useEffect } from "react";
import { Box, Stack, Title, Text, Card, Group, Image, Button, Anchor } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";

export default function WelcomeView() {

  const [registered, setRegistered] = useLocalStorage({ key: 'registered', defaultValue: false });

  useEffect(() => {

  }, [])
  return (
    <Box component="div" py="4rem" px="sm" w="100%" h="100vh" sx={() => ({overflowY: "scroll"})}>
      <Box component="div" mx="auto" maw="600px">
      <Stack spacing="2rem" >
        <Image src="logo.svg" alt="Skola Logo" maw="4rem"/>
        <Stack spacing="xs">
        <Title order={1}>Welcome to Skola!</Title>
        <Text fz="sm">An open-source and free flash card learning app in your browser.</Text>
        </Stack>
        <Card>
          <Group spacing="md" align="center" noWrap sx={(theme) => ({})}>
            <IconInfoCircle />
            <Text fz="sm">Please note that this app is still in very early development and lacks important features and will have bugs!</Text>
          </Group>
        </Card>
        <Stack spacing="xs">
          <Title order={3}>About the project</Title>
          <Text fz="sm">
            This project aims to provide an alternative to spaced repetition apps like Anki and SuperMemo. It is open-source and free to use.
            The focus lies on creating an intuitive and easy to use experience. It is a web app written in React and Typescript and uses the Mantine UI library as well as dexie.js. You can find more information on the <Anchor href="https://www.github.com/h16nning/skola">GitHub page</Anchor>.
          </Text>
        </Stack>
        <Stack spacing="xs">
          <Title order={3}>A note on your privacy</Title>
          <Text fz="sm">
            Privacy is a key focus of this project. Skola saves decks and cards locally in your browser using the IndexedDB API.
            Furthermore local storage and cookies are being used to store relevant (not personal data).
            We do not collect any personal data. However, we do use Google Analytics to collect anonymous usage data (i.e. the number of site visitors per day).
            The google analytics data is not shared with any third parties or used for any other purpose than to improve the app.
            There aren't any tracking mechanisms used on this site.
            You agree to the above by using this app.
          </Text>
        </Stack>
        <Group align="start">
          <Button onClick={() => setRegistered(true)}>Get started</Button></Group>
      </Stack>
      </Box>
    </Box>
  );
}