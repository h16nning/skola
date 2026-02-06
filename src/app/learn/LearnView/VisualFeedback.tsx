import { Rating } from "fsrs.js";
import "./VisualFeedback.css";

const BASE_URL = "visual-feedback";

export default function VisualFeedback({ rating }: { rating: Rating | null }) {
  return (
    <div
      className={`${BASE_URL} ${rating !== null ? `${BASE_URL}--${Rating[rating].toLowerCase()}` : ""}`}
    />
  );
}
