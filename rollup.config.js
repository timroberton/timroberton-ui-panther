import withSolid from "rollup-preset-solid";

export default withSolid({
  input: "lib/mod.ts",
  targets: ["esm"],
  printInstructions: true,
});
