import cpu from "./cpu.svg";
import gpu from "./gpu.svg";
import ram from "./ram.svg";
import ssd from "./ssd.svg";
import motherboard from "./motherboard.svg";
import psu from "./psu.svg";
import cooler from "./cooler.svg";
import pcCase from "./case.svg";

export { default as logo } from "./logo.svg";
export { default as hero } from "./hero.svg";

// Category name -> image. Replace these with real product photos when you have them.
export const categoryImages = {
  Processors: cpu,
  "Graphics Cards": gpu,
  Memory: ram,
  Storage: ssd,
  Motherboards: motherboard,
  "Power Supplies": psu,
  Cooling: cooler,
  Cases: pcCase,
};
