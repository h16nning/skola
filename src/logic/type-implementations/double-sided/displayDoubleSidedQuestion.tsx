import { Card } from "@/logic/card/card";
import { NoteContent } from "@/logic/note/NoteContent";
import { NoteType } from "@/logic/note/note";
import { Title } from "@mantine/core";

export default function displayDoubleSidedQuestion(
  card: Card<NoteType.DoubleSided>,
  content?: NoteContent<NoteType.DoubleSided>
) {
  function FrontComponent() {
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{
          __html:
            (card.content.frontIsField1 ? content?.field1 : content?.field2) ??
            "error",
        }}
      ></Title>
    );
  }
  return <FrontComponent />;
}
