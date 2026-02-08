import "./AnswerCardButton.css";

const BASE = "answer-card-button";

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
      className={`${BASE} ${BASE}--${color}`}
      onClick={() => action()}
    >
      <span className={`${BASE}__time-info`}>{timeInfo}</span>
      <span className={`${BASE}__label`}>{label}</span>
    </button>
  );
}
