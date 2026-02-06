import { Badge } from "@/components/ui/Badge";
import { Group } from "@/components/ui/Group";
import { CognitivePrompt, getRandomPrompts } from "@/logic/cognitivePrompts";
import { useMemo } from "react";
import "./CognitivePromptPills.css";

const BASE_URL = "cognitive-prompt-pills";

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
    <Group justify="center" gap="xs" className={BASE_URL}>
      {displayPrompts.map((prompt) => (
        <Badge
          key={prompt.category}
          variant={selectedPrompt === prompt ? "filled" : "light"}
          color="neutral"
          size="lg"
          className={`${BASE_URL}__pill`}
          onClick={() => onToggle(prompt)}
        >
          {prompt.label}
        </Badge>
      ))}
    </Group>
  );
}

export default CognitivePromptPills;
