export const COLOURS = [
  "red",
  "orange",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
];

export type Colour = (typeof COLOURS)[number];

export const BG_COLOUR_MAP: Record<Colour, string> = {
  red: "bg-red-300",
  orange: "bg-orange-300",
  blue: "bg-blue-300",
  green: "bg-green-300",
  yellow: "bg-yellow-300",
  purple: "bg-purple-300",
  pink: "bg-pink-300",
};
