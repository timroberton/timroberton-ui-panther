import * as TWEEN from "@tweenjs/tween.js";
import { createEffect } from "solid-js";
import {
  RectCoordsDims,
  TimChartInputs,
  renderChart,
} from "@jsr/timroberton__panther";

type Props<T extends Object> = {
  getChartInputs: (obj: T) => TimChartInputs;
  getChartRcd?: (obj: T) => RectCoordsDims;
  obj: T;
  aspectRatio?: number;
};

export function ChartHolderAnimated<T extends Object>(p: Props<T>) {
  let canvas: HTMLCanvasElement;

  const fixedCanvasW = 4000;
  const fixedCanvasH = p.aspectRatio ? 4000 / p.aspectRatio : 4000;

  const tween = new TWEEN.Tween(p.obj).easing(TWEEN.Easing.Cubic.InOut);

  function render(obj: T) {
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rcd =
      p.getChartRcd?.(obj) ??
      new RectCoordsDims([0, 0, canvas.width, canvas.height]);
    renderChart(ctx, p.getChartInputs(obj), rcd);
  }

  createEffect(() => {
    if (tween.isPlaying()) {
      tween.stop();
    }
    tween
      .to(p.obj, 500)
      .onUpdate(function (object) {
        render(object);
      })
      .startFromCurrentValues();
    play();
    render(p.obj);
  });

  function play() {
    if (!tween.isPlaying()) {
      return;
    }
    requestAnimationFrame(play);
    tween.update();
  }

  return (
    <canvas
      ref={canvas!}
      class="w-full"
      width={fixedCanvasW}
      height={fixedCanvasH}
    />
  );
}
