import { Image } from "@tiptap/extension-image";
import { Selection } from "@tiptap/pm/state";

/**
 * Augment the official `@tiptap/core` module with extra commands, relevant for this extension, so
 * that the compiler knows about them.
 */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageDrop: {
      /**
       * Inserts an image into the editor with the given attributes.
       */
      insertImage: (attributes: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

const ImageDrop = Image.extend<{}>({
  addCommands() {
    // const { name: nodeTypeName } = this;
    const nodeTypeName = "image";

    return {
      ...this.parent?.(),
      insertImage(attributes: {
        src: string;
        alt?: string;
        title?: string;
      }) {
        return ({
          editor,
          commands,
        }: {
          editor: any;
          commands: any;
        }) => {
          const selectionAtEnd =
            Selection.atEnd(
              editor.state.doc,
            );

          return commands.insertContent(
            [
              {
                type: nodeTypeName,
                attrs: attributes,
              },
              // Insert a blank paragraph after the image when at the end of the document
              ...(editor.state.selection
                .to ===
              selectionAtEnd.to
                ? [
                    {
                      type: "paragraph",
                    },
                  ]
                : []),
            ],
          );
        };
      },
    };
  },
});

export { ImageDrop };
