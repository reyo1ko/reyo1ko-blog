export type IconName =
  | "home"
  | "article"
  | "tools"
  | "folder"
  | "arrow"
  | "menu"
  | "close"
  | "search"
  | "convert"
  | "text"
  | "image"
  | "random";
const patterns: Record<IconName, string[]> = {
  convert: ["0000010", "1111111", "0000010", "0000000", "0100000", "1111111", "0100000"],
  text: ["1111111", "0001000", "0001000", "0001000", "0001000", "0001000", "0011100"],
  image: ["1111111", "1000001", "1010001", "1000101", "1001011", "1010101", "1111111"],
  random: ["1111111", "1000001", "1010001", "1001001", "1000101", "1000001", "1111111"],
  home: ["0001000", "0011100", "0111110", "1100011", "0100010", "0101010", "0111110"],
  article: ["0111110", "0100010", "0101110", "0100010", "0101110", "0100010", "0111110"],
  tools: ["1100011", "1100011", "0110110", "0011100", "0110110", "1100011", "1000001"],
  folder: ["0110000", "0111110", "0100010", "0100010", "0100010", "0111110", "0000000"],
  arrow: ["0001000", "0000100", "0000010", "1111111", "0000010", "0000100", "0001000"],
  menu: ["0000000", "1111111", "0000000", "1111111", "0000000", "1111111", "0000000"],
  close: ["1000001", "0100010", "0010100", "0001000", "0010100", "0100010", "1000001"],
  search: ["0111000", "1000100", "1000100", "1000100", "0111000", "0000010", "0000001"],
};
export default function PixelIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={"pixel-icon " + className}
      viewBox="0 0 9 9"
      fill="currentColor"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {patterns[name].flatMap((row, y) =>
        row
          .split("")
          .map((v, x) =>
            v === "1" ? (
              <rect key={x + "-" + y} x={x + 1} y={y + 1} width="1" height="1" />
            ) : null,
          ),
      )}
    </svg>
  );
}

export function toolIcon(href: string): IconName {
  if (/pixelizar/.test(href)) return "image";
  if (/lottery/.test(href)) return "random";
  if (/Conversion|convertBase/.test(href)) return "convert";
  if (/diffChecker|maskingTool|hankakuZenkaku|newLine|urlEncodeDecode/.test(href))
    return "text";
  if (/compression/.test(href)) return "article";
  return "tools";
}
