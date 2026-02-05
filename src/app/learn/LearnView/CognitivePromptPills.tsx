import { CognitivePrompt, getRandomPrompts } from "@/logic/cognitivePrompts";
import { Badge, Group } from "@mantine/core";
import { useMemo } from "react";
import classes from "./CognitivePromptPills.module.css";

interface CognitivePromptPillsProps {
  onToggle: (prompt: CognitivePrompt) => void;
  selectedPrompt?: CognitivePrompt | null;
}

function CognitivePromptPills({
  onToggle,
  selectedPrompt,
}: CognitivePromptPillsProps) {
  const prompts = useMemo(() => getRandomPrompts(3), []);

  const displayPrompts = selectedPrompt ? [selectedPrompt] : prompts;

  return (
    <Group justify="center" gap="xs" mt="md" className={classes.pillsContainer}>
      {displayPrompts.map((prompt) => (
        <Badge
          key={prompt.category}
          variant={selectedPrompt === prompt ? "filled" : "light"}
          color={prompt.color}
          size="lg"
          className={classes.pill}
          onClick={() => onToggle(prompt)}
        >
          {prompt.label}
        </Badge>
      ))}
    </Group>
  );
}

export default CognitivePromptPills;
