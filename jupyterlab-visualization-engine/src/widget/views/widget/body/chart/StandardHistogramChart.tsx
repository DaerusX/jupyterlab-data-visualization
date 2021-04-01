import * as Plottable from "plottable";
import { BucketForChart, Datasets } from "../../../../common/DataModel";
import * as utils from "../../../../common/utils";
import * as d3 from "d3";
import "plottable/plottable.css";
import {ChartTemplate} from "../../../../component/chart/ChartTemplate";
import {ControllerStatus} from "../../widgetCommon";

export interface StandardHistogramChartProps {
  datasets: Datasets;
  featureName: string;
  controllerStatus: ControllerStatus;
}

export class StandardHistogramChart extends ChartTemplate<
  StandardHistogramChartProps
> {

  private datasetNameList: string[] = [];

  constructor(props: StandardHistogramChartProps) {
    super(props);
  }

  renderChart() {
    this.datasetNameList = [];

    const widths: number[] = [];

    const bars = new Plottable.Plots.Rectangle();
    let min = Infinity;
    let max = -Infinity;
    let maxCount = 0;
    this.props.datasets.forEach((dataset) => {
      if (!this.props.controllerStatus.checkedDatasetList.includes(dataset.name)) {
        return
      }
      dataset.features.forEach((feature, featureName) => {
        if (
          featureName !== this.props.featureName ||
          !feature.stats.standardHistogram
        ) {
          return;
        }
        feature.stats.standardHistogram.buckets.forEach((bucket) => {
          const low = bucket.lowValue;
          const high = bucket.highValue;
          const count = bucket.sampleCount;
          if (low < min) {
            min = low;
          }
          if (high > max) {
            max = high;
          }
          if (count > maxCount) {
            maxCount = count;
          }
          if (isFinite(low) && isFinite(high)) {
            widths.push(high - low);
          }
        });
        bars.addDataset(
          new Plottable.Dataset(feature.stats.standardHistogram.buckets, {
            name: dataset.name,
          })
        );
      });
      this.datasetNameList.push(dataset.name);
    });
    let avgWidth =
      widths.length > 0 ? widths.reduce((a, b) => a + b) / widths.length : 0;
    // 至少为1
    if (avgWidth === 0) {
      avgWidth = 1;
    }
    const xDomain: number[] = [];
    if (isFinite(min)) {
      xDomain.push(min);
      if (isFinite(max)) {
        xDomain.push(max);
      }
    }
    const xScale = new Plottable.Scales.Linear();
    if (xDomain.length > 0) {
      xScale.domain(xDomain);
    }
    const yScale = StandardHistogramChart.getScale(false).domain([0]);
    const xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    const yAxis = new Plottable.Axes.Numeric(yScale, "left");

    xAxis.formatter(StandardHistogramChart.chartAxisScaleFormatter());
    yAxis.formatter(StandardHistogramChart.chartAxisScaleFormatter());

    bars
      .x((d: BucketForChart) => {
        let x = utils.getNumberFromField(d.lowValue);
        if (x === -Infinity || x === d.highValue) {
          const value = utils.getNumberFromField(d.highValue);
          if (!isFinite(value)) {
            x = 0;
            if (value === -Infinity) {
              x -= avgWidth;
            }
          } else {
            x = value - avgWidth;
          }
        }
        return x;
      }, xScale)
      .x2((d: BucketForChart) => {
        let x = utils.getNumberFromField(d.highValue);
        if (x === Infinity || x === d.lowValue) {
          const value = utils.getNumberFromField(d.lowValue);
          if (!isFinite(value)) {
            x = 0;
            if (value === Infinity) {
              x += avgWidth;
            }
          } else {
            x = value + avgWidth;
          }
        }
        return x;
      })
      .y(() => 0, yScale)
      .y2((d: BucketForChart) => this._getCountWithFloor(d, maxCount));

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

    bars
      .attr(
        "fill",
        (d: {}, i: number, dataset: Plottable.Dataset) =>
          dataset.metadata().name,
        colorScale
      )
      .attr("opacity", this.datasetNameList.length > 2 ? 0.4 : 1);


    this._renderChart(
      bars,
      xAxis,
      yAxis,
      null as any,
      null as any,
      (p: Plottable.Point) => bars.entitiesAt(p),
      (datum: any) =>
        utils
          .roundToPlaces(utils.getNumberFromField(datum.lowValue), 2)
          .toLocaleString() +
        "-" +
        utils
          .roundToPlaces(utils.getNumberFromField(datum.highValue), 2)
          .toLocaleString() +
        ": " +
        utils.getNumberFromField(datum.sampleCount).toLocaleString(),
      (datum: BucketForChart) =>
        new utils.FeatureSelection(
          this.props.featureName,
          undefined,
          utils.getNumberFromField(datum.lowValue),
          utils.getNumberFromField(datum.highValue)
        ),
      (foreground: d3.Selection<HTMLElement, {}, null, undefined>) =>
        foreground
          .append("rect")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("stroke-width", "1px"),
      (
        elem: d3.Selection<HTMLElement, {}, null, undefined>,
        entity: Plottable.IEntity<any>
      ) =>
        elem
          .attr(
            "x",
            entity.position.x -
              (entity.selection as any)._groups[0][0].width.baseVal.value / 2
          )
          .attr(
            "y",
            entity.position.y -
              (entity.selection as any)._groups[0][0].height.baseVal.value / 2
          )
          .attr(
            "width",
            (entity.selection as any)._groups[0][0].width.baseVal.value
          )
          .attr(
            "height",
            (entity.selection as any)._groups[0][0].height.baseVal.value
          )
    );
  }


}
