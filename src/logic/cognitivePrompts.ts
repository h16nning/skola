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

export const COGNITIVE_PROMPTS: Record<
  CognitivePromptCategory,
  CognitivePrompt
> = {
  invert: {
    category: "invert",
    label: "Invert",
    description: "What's the opposite? What if this weren't true?",
    placeholder: "Explore the inverse or negation of this concept...",
    color: "violet",
  },
  connect: {
    category: "connect",
    label: "Connect",
    description: "How does this relate to something else you know?",
    placeholder: "Link this to another concept, field, or experience...",
    color: "blue",
  },
  process: {
    category: "process",
    label: "Process",
    description: "What are the steps or mechanisms involved?",
    placeholder: "Break down the process or explain how it works...",
    color: "teal",
  },
  analogy: {
    category: "analogy",
    label: "Analogy",
    description: "What is this like? Create a comparison.",
    placeholder: "This is like... because...",
    color: "orange",
  },
  critique: {
    category: "critique",
    label: "Critique",
    description: "What are the limitations or weaknesses?",
    placeholder: "Consider edge cases, exceptions, or counterarguments...",
    color: "red",
  },
  apply: {
    category: "apply",
    label: "Apply",
    description: "How would you use this in practice?",
    placeholder: "Describe a real-world application or example...",
    color: "green",
  },
};

export function getRandomPrompts(count: number = 3): CognitivePrompt[] {
  const allPrompts = Object.values(COGNITIVE_PROMPTS);
  const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allPrompts.length));
}
