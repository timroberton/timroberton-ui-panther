import { createSignal } from "solid-js";

const [fontsReady, setFontsReady] = createSignal<boolean>(false);

// if (typeof document !== undefined) {
//   document.fonts.onloadingdone = () => {
//     console.log("Fonts ready");
//     setFontsReady(true);
//   };
// }

export { fontsReady };
