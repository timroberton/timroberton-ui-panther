// import { RectCoordsDims, TimFigureInputs, renderFigure } from "./deps";
// import * as TWEEN from "@tweenjs/tween.js";
// import { createEffect } from "solid-js";
// import { fontsReady } from "./fonts_ready";
// type Props<T extends Object> = {
//   getFigureInputs: (obj: T) => TimFigureInputs;
//   getFigureRcd?: (obj: T) => RectCoordsDims;
//   obj: T;
//   aspectRatio?: number;
// };
// export function ChartHolderAnimated<T extends Object>(p: Props<T>) {
//   let canvas: HTMLCanvasElement;
//   const fixedCanvasW = 4000;
//   const fixedCanvasH = p.aspectRatio ? 4000 / p.aspectRatio : 4000;
//   const tween = new TWEEN.Tween(p.obj).easing(TWEEN.Easing.Cubic.InOut);
//   function render(obj: T) {
//     const ctx = canvas.getContext("2d")!;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     const rcd =
//       p.getFigureRcd?.(obj) ??
//       new RectCoordsDims([0, 0, canvas.width, canvas.height]);
//     renderFigure(ctx, p.getFigureInputs(obj), rcd, 1);
//   }
//   createEffect(() => {
//     fontsReady();
//     if (tween.isPlaying()) {
//       tween.stop();
//     }
//     tween
//       .to(p.obj, 500)
//       .onUpdate(function (object) {
//         render(object);
//       })
//       .startFromCurrentValues();
//     play();
//     render(p.obj);
//   });
//   function play() {
//     if (!tween.isPlaying()) {
//       return;
//     }
//     requestAnimationFrame(play);
//     tween.update();
//   }
//   return (
//     <canvas
//       ref={canvas!}
//       class="w-full"
//       width={fixedCanvasW}
//       height={fixedCanvasH}
//     />
//   );
// }
