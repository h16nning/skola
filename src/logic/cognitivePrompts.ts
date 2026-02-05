import { t } from "i18next";

export type CognitivePromptCategory =
  | "invert"
  | "connect"
  | "process"
  | "analogy"
  | "critique"
  | "apply";

export interface CognitivePrompt {
  category: CognitivePromptCategory;
  label: string;
  description: string;
  placeholder: string;
  color: string;
}

export const UNIVERSAL_COGNITIVE_PROMPTS: Record<
  CognitivePromptCategory,
  CognitivePrompt
> = {
  invert: {
    category: "invert",
    label: t("learning.cognitive-prompts.invert.label"),
    description: t("learning.cognitive-prompts.invert.description"),
    placeholder: t("learning.cognitive-prompts.invert.placeholder"),
    color: "violet",
  },
  connect: {
    category: "connect",
    label: t("learning.cognitive-prompts.connect.label"),
    description: t("learning.cognitive-prompts.connect.description"),
    placeholder: t("learning.cognitive-prompts.connect.placeholder"),
    color: "blue",
  },
  process: {
    category: "process",
    label: t("learning.cognitive-prompts.process.label"),
    description: t("learning.cognitive-prompts.process.description"),
    placeholder: t("learning.cognitive-prompts.process.placeholder"),
    color: "teal",
  },
  analogy: {
    category: "analogy",
    label: t("learning.cognitive-prompts.analogy.label"),
    description: t("learning.cognitive-prompts.analogy.description"),
    placeholder: t("learning.cognitive-prompts.analogy.placeholder"),
    color: "orange",
  },
  critique: {
    category: "critique",
    label: t("learning.cognitive-prompts.critique.label"),
    description: t("learning.cognitive-prompts.critique.description"),
    placeholder: t("learning.cognitive-prompts.critique.placeholder"),
    color: "red",
  },
  apply: {
    category: "apply",
    label: t("learning.cognitive-prompts.apply.label"),
    description: t("learning.cognitive-prompts.apply.description"),
    placeholder: t("learning.cognitive-prompts.apply.placeholder"),
    color: "green",
  },
};

export function getRandomPrompts(count = 3): CognitivePrompt[] {
  const allPrompts = Object.values(UNIVERSAL_COGNITIVE_PROMPTS);
  const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allPrompts.length));
}
