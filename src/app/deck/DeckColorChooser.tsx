import { COLORS, ColorIdentifier } from "@/lib/ColorIdentifier";
import "./DeckColorChooser.css";
import { InputLabel } from "@/components/ui/InputLabel";

const BASE = "deck-color-chooser";

interface DeckColorChooserProps {
  deckColor: ColorIdentifier;
  setDeckColor: (color: ColorIdentifier) => void;
}

export default function DeckColorChooser({
  deckColor,
  setDeckColor,
}: DeckColorChooserProps) {
  return (
    <div className={BASE}>
      <InputLabel>Deck Color</InputLabel>
      <div className={`${BASE}__color-options`}>
        {COLORS.map((color) => (
          <button
            type="button"
            key={color}
            className={`${BASE}__color-button ${
              color === deckColor ? `${BASE}__color-button--selected` : ""
            }`}
            style={{
              backgroundColor: `light-dark(var(--theme-${color}-400), var(--theme-${color}-100))`,
              borderColor: `light-dark(var(--theme-${color}-500), var(--theme-${color}-200))`,
            }}
            onClick={() => setDeckColor(color)}
          />
        ))}
      </div>
    </div>
  );
}
