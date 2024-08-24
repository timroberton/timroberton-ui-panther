import { createEffect } from "solid-js";
import {
  RectCoordsDims,
  TimChartInputs,
  getFigureHeight,
  renderChart,
} from "./deps";
import { fontsReady } from "./fonts_ready";

type Props = {
  chartInputs: TimChartInputs;
};

export function ChartHolderAutoHeight(p: Props) {
  let div: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  const fixedCanvasW = 4000;

  createEffect(() => {
    fontsReady();
    updateChart(canvas, p.chartInputs, fixedCanvasW);
  });

  return (
    <div ref={div!} class="w-full">
      <canvas ref={canvas!} class="w-full" width={fixedCanvasW} height={0} />
    </div>
  );
}

function updateChart(
  canvas: HTMLCanvasElement,
  chartInputs: TimChartInputs,
  fixedCanvasW: number
) {
  requestAnimationFrame(() => {
    let ctx = canvas.getContext("2d")!;
    const hFigure = getFigureHeight(ctx, chartInputs, fixedCanvasW, undefined);
    if (hFigure.ideal !== canvas.height) {
      canvas.height = hFigure.ideal;
      ctx = canvas.getContext("2d")!;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    const rcd = new RectCoordsDims([0, 0, canvas.width, canvas.height]);
    renderChart(ctx, chartInputs, rcd, undefined);
  });
}
