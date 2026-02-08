import { Badge } from "@/components/ui/Badge";
import { CognitivePrompt, getRandomPrompts } from "@/logic/cognitivePrompts";
import { useMemo } from "react";
import "./CognitivePromptPills.css";

const BASE = "cognitive-prompt-pills";

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
    <div className={BASE}>
      {displayPrompts.map((prompt) => (
        <Badge
          key={prompt.category}
          variant={selectedPrompt === prompt ? "filled" : "light"}
          color="neutral"
          size="lg"
          className={`${BASE}__pill`}
          onClick={() => onToggle(prompt)}
        >
          {prompt.label}
        </Badge>
      ))}
    </div>
  );
}

export default CognitivePromptPills;
