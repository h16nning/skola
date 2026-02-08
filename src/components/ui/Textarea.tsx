import {
  type ReactNode,
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import "./Textarea.css";

const BASE = "textarea";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  minRows?: number;
  maxRows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      description,
      error,
      className = "",
      id,
      minRows = 3,
      maxRows,
      rows,
      style,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    const textareaStyle = {
      minHeight: minRows ? `${minRows * 1.5}em` : undefined,
      maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined,
      ...style,
    };

    return (
      <div className={classes}>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <textarea
          ref={ref}
          id={inputId}
          className={`${BASE}__field`}
          rows={rows}
          style={textareaStyle}
          {...props}
        />
        <InputError>{error}</InputError>
      </div>
    );
  }
);
