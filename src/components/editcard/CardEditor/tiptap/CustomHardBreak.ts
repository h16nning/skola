import HardBreak from "@tiptap/extension-hard-break";

export const CustomHardBreak = HardBreak.extend({
  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => {
        return this.editor.commands.setHardBreak();
      },
    };
  },
});
