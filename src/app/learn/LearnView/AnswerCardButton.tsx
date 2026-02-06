import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import "./AnswerCardButton.css";

const BASE_URL = "answer-card-button";

interface AnswerCardButtonProps {
  label: string;
  timeInfo: string;
  color: string;
  action: Function;
}

export default function AnswerCardButton({
  label,
  timeInfo,
  color,
  action,
}: AnswerCardButtonProps) {
  return (
    <button
      type="button"
      className={`${BASE_URL} ${BASE_URL}--${color}`}
      onClick={() => action()}
    >
      <Stack gap="xs" align="center">
        <Text size="xs" weight="normal" style={{ lineHeight: 1 }}>
          {timeInfo}
        </Text>
        <Text size="sm" weight="semibold" style={{ lineHeight: 1.25 }}>
          {label}
        </Text>
      </Stack>
    </button>
  );
}
