import * as Plottable from "plottable";
import {
  BucketForChart,
  Datasets,
  StringStats,
} from "../../../../common/DataModel";
import * as utils from "../../../../common/utils";
import * as d3 from "d3";
import "plottable/plottable.css";
import { ChartTemplate } from "../../../../component/chart/ChartTemplate";
import { ControllerStatus } from "../../widgetCommon";

export interface StringLineChartProps {
  datasets: Datasets;
  featureName: string;
  controllerStatus: ControllerStatus;
}

export class StringLineChart extends ChartTemplate<StringLineChartProps> {
  private datasetNameList: string[] = [];

  constructor(props: StringLineChartProps) {
    super(props);
  }

  renderChart() {
    this.datasetNameList = [];
    const labelList: string[] = [];
    const labelMap = new Map<string, number>();
    const totals: number[] = [];
    const lines = new Plottable.Plots.Line();

    const xScale = new Plottable.Scales.Linear().domain([0]);
    const yScale = StringLineChart.getScale(false).domain([0]);
    const xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    const yAxis = new Plottable.Axes.Numeric(yScale, "left");

    this.props.datasets.forEach((dataset) => {
      if (
        !this.props.controllerStatus.checkedDatasetList.includes(dataset.name)
      ) {
        return;
      }
      this.datasetNameList.push(dataset.name);
      dataset.features.forEach((feature, featureName) => {
        if (
          featureName !== this.props.featureName ||
          !feature.stats.namedHistogram
        ) {
          return;
        }

        const sortBuckets: Array<BucketForChart> = [];
        const percBuckets: Array<BucketForChart> = [];
        let lastIndex = -1;
        let count = 0;
        totals.push(
          (feature.stats as StringStats).avgLength * feature.stats.numNonMissing
        );
        feature.stats.namedHistogram.buckets.forEach((bucket) => {
          const label = utils.getPrintableLabel(bucket.label);
          if (bucket.label && labelList.indexOf(label) === -1) {
            labelList.push(label);
            labelMap.set(label, count);
            count++;
          }

          sortBuckets.push(bucket);
        });

        sortBuckets.sort(
          (genericBucketA: BucketForChart, genericBucketB: BucketForChart) => {
            const a = genericBucketA;
            const b = genericBucketB;

            return labelMap.get(a.label!)! - labelMap.get(b.label!)!;
          }
        );
        sortBuckets.forEach((genericBucket: BucketForChart, j: number) => {
          const percBucket = genericBucket;
          const indexOfBucketLabel = labelMap.get(
            utils.getPrintableLabel(percBucket.label)
          );
          if (indexOfBucketLabel === undefined) {
            return;
          }
          // If the next element on the X axis is not in this dataset,
          // then add empty entries for each element in the complete
          // union of all datasets that are missing from this dataset.
          for (let i = lastIndex + 1; i < indexOfBucketLabel!; i++) {
            const emptyPercBucket: BucketForChart = {
              label: labelList[i],
              highValue: i,
              lowValue: i,
              sampleCount:
                percBuckets.length === 0
                  ? 0
                  : percBuckets[percBuckets.length - 1].sampleCount,
            };
            percBuckets.push(emptyPercBucket);
          }

          lastIndex = indexOfBucketLabel;

          if (j === 0) {
            percBucket.sampleCount = utils.getNumberFromField(
              percBucket.sampleCount
            );
          } else {
            // const indexOfPrev =
            //   indexOfBucketLabel > 0 ? indexOfBucketLabel - 1 : j - 1;
            percBucket.sampleCount = utils.getNumberFromField(
              percBucket.sampleCount
            );
          }
          percBucket.lowValue = indexOfBucketLabel;
          percBucket.highValue = indexOfBucketLabel;
          percBuckets.push(percBucket);
          lines.addDataset(
            new Plottable.Dataset(percBuckets, { name: dataset.name })
          );
        });
      });
    });

    let colorScale = new Plottable.Scales.Color();
    colorScale.domain(this.datasetNameList);
    // Categorical colors from the material design spec.
    colorScale.range([
      "#4285F4",
      "#F09300",
      "#0F9D58",
      "#9C27B0",
      "#607D8B",
      "#0B8043",
      "#757575",
    ]);

    lines
      .x((d: BucketForChart) => utils.getNumberFromField(d.lowValue), xScale)
      .y(
        (d: BucketForChart) => utils.getNumberFromField(d.sampleCount),
        yScale
      );
    lines
      .attr("stroke", (d, i, dataset) => dataset.metadata().name, colorScale)
      .attr("opacity", this.datasetNameList.length >= 2 ? 0.4 : 1);

    this._renderChart(
      lines,
      xAxis,
      yAxis,
      null as any,
      null as any,
      (p: Plottable.Point) => lines.entitiesAt(p),
      (datum: BucketForChart) =>
        utils.getPrintableLabel(datum.label) +
        ": " +
        utils
          .roundToPlaces(utils.getNumberFromField(datum.sampleCount), 4)
          .toLocaleString(),
      (datum: BucketForChart) =>
        new utils.FeatureSelection(this.props.featureName, datum.label),
      (foreground: d3.Selection<HTMLElement, {}, null, undefined>) =>
        foreground
          .append("circle")
          .attr("r", 3)
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("stroke-width", "1px"),
      (
        elem: d3.Selection<HTMLElement, {}, null, undefined>,
        entity: Plottable.IEntity<any>
      ) => elem.attr("cx", entity.position.x).attr("cy", entity.position.y)
    );
  }

  protected _renderChart<T>(
    this: any,
    plot: Plottable.Plot,
    xAxis: Plottable.Axis<T>,
    yAxis: Plottable.Axis<T>,
    xLabel: Plottable.Components.AxisLabel,
    yLabel: Plottable.Components.AxisLabel,
    getEntities: (point: Plottable.Point) => Plottable.Plots.IPlotEntity[],
    tooltipCallback: (datum: any) => string,
    selectionCallback: (datum: any) => utils.FeatureSelection,
    selectionCreator: (
      foreground: d3.Selection<HTMLElement, {}, null, undefined>
    ) => {},
    selectionPositioner: (
      elem: d3.Selection<HTMLElement, {}, null, undefined>,
      entity: Plottable.IEntity<any>
    ) => any
  ) {
    const chartEl = document.getElementById("chart-" + this.props.featureName);
    const xaxisEl = document.getElementById("xaxis-" + this.props.featureName);
    const tooltipEl = document.getElementById(
      "tooltip-" + this.props.featureName
    );
    if (!chartEl || !xaxisEl || !tooltipEl) {
      return;
    }
    // Create separate Plottable tables, with the chart and Y axis in one table
    // and the X axis in another table so they can be rendered to separate
    // SVGs with separate bounding boxes. This allows the chart to have a
    // constant size regardless of the size needed for the X axis strings.
    const nullComp: Plottable.Component | null = null;
    this.chartTable = new Plottable.Components.Table([
      [yLabel, yAxis, plot],
      [nullComp!, nullComp!, nullComp!],
    ]);
    this.xAxisTable = new Plottable.Components.Table([
      [nullComp!, nullComp!],
      [nullComp!, xAxis],
    ]);

    // Render the chart. Use immediate rendering mode so that the chart can be
    // rendered first and the width of the X axis component used to position
    // the Y axis component.
    Plottable.RenderController.renderPolicy(
      Plottable.RenderController.Policy.immediate
    );
    const chartSelection: d3.Selection<
      HTMLElement,
      {},
      any,
      undefined
    > = d3.select(chartEl);
    const axisSelection: d3.Selection<
      HTMLElement,
      {},
      any,
      undefined
    > = d3.select(xaxisEl);
    d3.select(tooltipEl);
    // Remove the chart component but not anything else as this would disable
    // tooltips by removing the mouse dispatcher's measure rect.
    chartSelection.selectAll(".component").remove();
    axisSelection.selectAll(".component").remove();
    this.chartTable.renderTo(chartEl);

    this._selectionElem = selectionCreator(
      (plot.foreground() as unknown) as d3.Selection<
        HTMLElement,
        {},
        null,
        undefined
      >
    );
    this._updateSelectionVisibility(this.selection);

    // Add padding equal to the Y axis component to the X axis table to align
    // the axes.
    if (yAxis != null) {
      this.xAxisTable.columnPadding(
        this.chartTable.componentAt(0, 1).width() +
          (this.chartTable.componentAt(0, 0)
            ? this.chartTable.componentAt(0, 0).width()
            : 0)
      );
    }
    this.xAxisTable.renderTo(xaxisEl);
  }
}
