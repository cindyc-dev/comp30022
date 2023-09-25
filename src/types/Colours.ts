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

export const EVENT_COLOUR_MAP: Record<Colour, string> = {
  red: "bg-red-100",
  orange: "bg-orange-100",
  blue: "bg-blue-100",
  green: "bg-green-100",
  yellow: "bg-yellow-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
};
