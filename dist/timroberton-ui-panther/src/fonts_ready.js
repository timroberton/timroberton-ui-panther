import { createSignal } from "solid-js";
const [fontsReady, setFontsReady] = createSignal(false);
// if (typeof document !== undefined) {
//   document.fonts.onloadingdone = () => {
//     console.log("Fonts ready");
//     setFontsReady(true);
//   };
// }
export { fontsReady };
