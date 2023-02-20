import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Center, Divider, Group, Stack } from "@mantine/core";

interface LearnViewProps {}

function LearnView({}: LearnViewProps) {
  const navigate = useNavigate();
  const [showingAnswer, setShowingAnswer] = useState<Boolean>(false);
  return (
    <Center>
      <Stack w="600px">
        <Group>
          <Button onClick={() => navigate("/")} variant="default">
            Quit Learning
          </Button>
        </Group>
        <Card>
          <Stack>
            Front
            <Divider />
            {showingAnswer ? "Back" : ""}
          </Stack>
        </Card>
        <Group>
          {showingAnswer ? (
            <Group spacing="xs">
              <Button bg="red" onClick={() => answer(4)}>
                Again
              </Button>
              <Button bg="yellow" onClick={() => answer(3)}>
                Hard
              </Button>
              <Button bg="green" onClick={() => answer(2)}>
                Normal
              </Button>
              <Button bg="blue" onClick={() => answer(1)}>
                Easy
              </Button>
            </Group>
          ) : (
            <Button onClick={() => setShowingAnswer(true)}>Show Answer</Button>
          )}
        </Group>
      </Stack>
    </Center>
  );

  function answer(difficulty: number) {
    setShowingAnswer(false);
  }

  function nextCard() {}
}

export default LearnView;
