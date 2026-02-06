import { CognitivePrompt } from "@/logic/cognitivePrompts";
import CognitivePromptPills from "./CognitivePromptPills";
import "./CognitivePromptConnector.css";

const BASE_URL = "cognitive-prompt-connector";

interface CognitivePromptConnectorProps {
  onToggle: (prompt: CognitivePrompt) => void;
  selectedPrompt?: CognitivePrompt | null;
}

function CognitivePromptConnector({
  onToggle,
  selectedPrompt,
}: CognitivePromptConnectorProps) {
  return (
    <div className={BASE_URL}>
      {selectedPrompt ? (
        <div className={`${BASE_URL}__line-top`} />
      ) : (
        <div className={`${BASE_URL}__spacer`} />
      )}
      <CognitivePromptPills
        onToggle={onToggle}
        selectedPrompt={selectedPrompt}
      />
      {selectedPrompt && <div className={`${BASE_URL}__line-bottom`} />}
    </div>
  );
}

export default CognitivePromptConnector;
