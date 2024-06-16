import withSolid from "rollup-preset-solid";
import dts from "rollup-plugin-dts";

export default [
  withSolid(),
  {
    input: "dist/types/mod.d.ts",
    output: [{ file: "dist/esm/mod.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
