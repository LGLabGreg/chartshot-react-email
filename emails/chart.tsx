import type { ChartSpec } from "@lglab/chartshot";
import { ChartImage } from "@lglab/chartshot/react";
import { Img } from "react-email";
import { charts, keylessUrl } from "./charts";

interface ChartProps {
  spec: ChartSpec;
  /** The chart's own size. Its text is drawn at this size. */
  width: number;
  height: number;
  /** The widest the image shows in the email. Wider than `width` makes the chart's text larger. */
  maxWidth: number;
  alt: string;
}

/** A chart image: signed with your key if you have one, keyless otherwise. */
export function Chart({ spec, width, height, maxWidth, alt }: ChartProps) {
  const sized = { ...spec, width, height, scale: 3 } as ChartSpec;
  const style = {
    display: "block",
    width: "100%",
    maxWidth,
    height: "auto",
    border: "none",
    outline: "none",
    textDecoration: "none",
  };
  // expiresIn null: the URL keeps working, so an old email still shows its chart.
  if (charts) return <ChartImage charts={charts} spec={sized} expiresIn={null} alt={alt} style={style} />;
  return <Img src={keylessUrl(sized)} width={width} height={height} alt={alt} style={style} />;
}
