import { CognitivePrompt } from "@/logic/cognitivePrompts";
import CognitivePromptPills from "./CognitivePromptPills";
import "./CognitivePromptConnector.css";

const BASE = "cognitive-prompt-connector";

interface CognitivePromptConnectorProps {
  onToggle: (prompt: CognitivePrompt) => void;
  selectedPrompt?: CognitivePrompt | null;
}

function CognitivePromptConnector({
  onToggle,
  selectedPrompt,
}: CognitivePromptConnectorProps) {
  return (
    <div className={BASE}>
      {selectedPrompt ? (
        <div className={`${BASE}__line-top`} />
      ) : (
        <div className={`${BASE}__spacer`} />
      )}
      <CognitivePromptPills
        onToggle={onToggle}
        selectedPrompt={selectedPrompt}
      />
      {selectedPrompt && <div className={`${BASE}__line-bottom`} />}
    </div>
  );
}

export default CognitivePromptConnector;
