import { COLOURS, Colour, BG_COLOUR_MAP } from "~/types/Colours";

interface ColourPickerProps {
  colour: Colour;
  setColour: (colour: Colour) => void;
  colourOptions?: Colour[];
}

function ColourPicker({
  colour,
  setColour,
  colourOptions = COLOURS,
}: ColourPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colourOptions.map((option) => {
        return (
          <div
            className={`btn btn-circle btn-sm ${BG_COLOUR_MAP[option]} ${
              option === colour && "outline outline-2 outline-primary"
            }`}
            onClick={() => setColour(option)}
          ></div>
        );
      })}
    </div>
  );
}

export default ColourPicker;
