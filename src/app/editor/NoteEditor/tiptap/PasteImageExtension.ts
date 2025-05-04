import { Extension } from "@tiptap/core";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

function compressImageToDataURL(
  file: File,
  maxWidth = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Failed to get canvas context");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const PasteImageExtension = Extension.create({
  name: "pasteImage",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view: EditorView, event: ClipboardEvent): boolean {
            const items = event.clipboardData?.items;
            const html = event.clipboardData?.getData("text/html");
            let handled = false;

            // Handle direct clipboard image paste
            if (items) {
              Array.from(items).forEach((item) => {
                if (item.type.startsWith("image/")) {
                  const file = item.getAsFile();
                  if (!file) return;

                  compressImageToDataURL(file).then((src) => {
                    const imageNode = view.state.schema.nodes.image?.create({
                      src,
                    });
                    if (imageNode) {
                      const tr = view.state.tr.replaceSelectionWith(imageNode);
                      view.dispatch(tr);
                    }
                  });

                  handled = true;
                }
              });
            }

            // Handle pasted HTML with <img src="..."> and preserve HTML between images
            if (html) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              const body = doc.body;

              const processNode = async (
                node: Node
              ): Promise<(Node | string)[]> => {
                if (
                  node.nodeType === Node.ELEMENT_NODE &&
                  (node as HTMLElement).tagName === "IMG"
                ) {
                  const img = node as HTMLImageElement;
                  const src = img.src;
                  if (src && !src.startsWith("data:")) {
                    try {
                      const response = await fetch(src);
                      const blob = await response.blob();
                      const base64 = await compressImageToDataURL(blob as File);
                      const newImg = document.createElement("img");
                      newImg.src = base64;
                      return [newImg];
                    } catch {
                      console.warn(
                        "Errore nel caricamento dell'immagine esterna:",
                        src
                      );
                      return [node];
                    }
                  } else {
                    return [node];
                  }
                } else if (node.hasChildNodes()) {
                  const fragment: (Node | string)[] = [];
                  for (const child of Array.from(node.childNodes)) {
                    const processed = await processNode(child);
                    fragment.push(...processed);
                  }
                  const wrapper = document.createElement(
                    (node as HTMLElement).tagName || "div"
                  );
                  fragment.forEach((f) =>
                    wrapper.appendChild(
                      typeof f === "string" ? document.createTextNode(f) : f
                    )
                  );
                  return [wrapper];
                } else {
                  return [node];
                }
              };

              processNode(body).then((nodes) => {
                const wrapper = document.createElement("div");
                nodes.forEach((n) =>
                  wrapper.appendChild(
                    typeof n === "string" ? document.createTextNode(n) : n
                  )
                );
                const htmlString = wrapper.innerHTML;
                const dom = parser.parseFromString(htmlString, "text/html");
                const slice = ProseMirrorDOMParser.fromSchema(
                  view.state.schema
                ).parse(dom.body);
                const tr = view.state.tr.replaceSelectionWith(slice);
                view.dispatch(tr);
              });

              handled = true;
            }

            return handled;
          },
        },
      }),
    ];
  },
});
