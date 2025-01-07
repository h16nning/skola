import { Rating } from "fsrs.js";
import classes from "./VisualFeedback.module.css";

export default function VisualFeedback({ rating }: { rating: Rating | null }) {
    console.log(rating);
    return (
        <div
            className={
                classes.visualFeedback +
                " " +
                (rating === null ? "" : classes[Rating[rating]])
            }
        />
    );
}
