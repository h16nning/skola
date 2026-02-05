import { CognitivePrompt } from "@/logic/cognitivePrompts";
import { Box } from "@mantine/core";
import classes from "./CognitivePromptConnector.module.css";
import CognitivePromptPills from "./CognitivePromptPills";

interface CognitivePromptConnectorProps {
  onToggle: (prompt: CognitivePrompt) => void;
  selectedPrompt?: CognitivePrompt | null;
}

function CognitivePromptConnector({
  onToggle,
  selectedPrompt,
}: CognitivePromptConnectorProps) {
  const getPromptColor = () => {
    if (!selectedPrompt) return "var(--mantine-color-gray-5)";

    const colorName = selectedPrompt.color;
    return `var(--mantine-color-${colorName}-6)`;
  };

  const lineColor = getPromptColor();

  return (
    <Box className={classes.connector}>
      <Box className={classes.lineTop} style={{ backgroundColor: lineColor }} />
      <CognitivePromptPills
        onToggle={onToggle}
        selectedPrompt={selectedPrompt}
      />
      {selectedPrompt && (
        <Box
          className={classes.lineBottom}
          style={{ backgroundColor: lineColor }}
        />
      )}
    </Box>
  );
}

export default CognitivePromptConnector;
