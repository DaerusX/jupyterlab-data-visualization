import * as Plottable from "plottable";
import { BucketForChart, Datasets } from "../../../../common/DataModel";
import * as utils from "../../../../common/utils";
import * as d3 from "d3";
import "plottable/plottable.css";
import { ChartTemplate } from "../../../../component/chart/ChartTemplate";
import React from "react";
import { ControllerStatus } from "../../widgetCommon";

export interface StringBarChartProps {
  datasets: Datasets;
  featureName: string;
  controllerStatus: ControllerStatus;
}

export class StringBarChart extends ChartTemplate<StringBarChartProps> {
  private datasetNameList: string[] = [];

  constructor(props: StringBarChartProps) {
    super(props);
  }

  renderChart() {
    const labelList: string[] = [];

    const bars = new Plottable.Plots.Bar();

    const xScale = new Plottable.Scales.Linear();

    const yScale = StringBarChart.getScale(false);

    const yAxis = new Plottable.Axes.Numeric(yScale, "left");

    yAxis.formatter(StringBarChart.chartAxisScaleFormatter());
    let maxCount = 0;
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
        feature.stats.namedHistogram.buckets.forEach((bucket) => {
          const count = bucket.sampleCount;
          const label = utils.getPrintableLabel(bucket.label);
          if (bucket.label && labelList.indexOf(label) === -1) {
            labelList.push(label);
          }
          if (count > maxCount) {
            maxCount = count;
          }
        });
        bars.addDataset(
          new Plottable.Dataset(feature.stats.namedHistogram.buckets, {
            name: dataset.name,
          })
        );
      });
    });
    const xScaleCat = new Plottable.Scales.Category().domain(labelList);
    const xAxis = new Plottable.Axes.Category(xScaleCat, "bottom");

    bars
      .x((d: BucketForChart) => {
        if (d.label) {
          return labelList.indexOf(utils.getPrintableLabel(d.label));
        }
      }, xScale)
      .y((d: BucketForChart) => this._getCountWithFloor(d, maxCount), yScale);

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
      .attr("opacity", this.datasetNameList.length >= 2 ? 0.4 : 1);

    this._renderChart(
      bars,
      xAxis,
      yAxis as any,
      null as any,
      null as any,
      (p: Plottable.Point) => bars.entitiesAt(p),
      (datum: BucketForChart) =>
        utils.getPrintableLabel(datum.label) +
        ": " +
        utils.getNumberFromField(datum.sampleCount).toLocaleString(),
      (datum: BucketForChart) =>
        new utils.FeatureSelection(this.props.featureName, datum.label),
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
      [nullComp!, nullComp!, nullComp!],
      [nullComp!,  xAxis],
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
    const tooltip: d3.Selection<HTMLElement, {}, any, undefined> = d3.select(
      tooltipEl
    );

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

    chartSelection
      .on("mouseenter", () => {
        // Setup pointer interaction for tooltip and attach to the plot.
        this._onPointerEnterFunction = (p: any) => {
          // For line charts, give a tooltip for the closest point on
          // any line. For other charts, give a tooltip for all entries
          // in any dataset that is overlapping with the datum nearest
          // the pointer (for overlapping histograms for example).
          const entities = getEntities(p);
          if (entities.length > 0) {
            const title = entities
              .map((entity) => {
                return entity.dataset.metadata().name == null ||
                  this.datasetNameList.length === 1
                  ? tooltipCallback(entity.datum)
                  : entity.dataset.metadata().name +
                      ": " +
                      tooltipCallback(entity.datum);
              })
              .join("\n");
            tooltip.text(title);
            tooltip.style("opacity", "1");
          }
        };
        this._onPointer.onPointerMove(this._onPointerEnterFunction);
        this._onPointerExitFunction = function (p: {}) {
          tooltip.style("opacity", "0");
        };
        this._onPointer.onPointerExit(this._onPointerExitFunction);
        this._onPointer.attachTo(plot);
        if (this.chartSelection !== utils.CHART_SELECTION_LIST_QUANTILES) {
          const self = this;
          this._onClickFunction = (p: any) => {
            const entities = getEntities(p);
            if (entities.length > 0) {
              selectionPositioner(self._selectionElem, entities[0]);
              const selection: utils.FeatureSelection | null = selectionCallback(
                entities[0].datum
              );
              self._setSelection(selection);
            }
          };
          this._onClick.onClick(this._onClickFunction);
          this._onClick.attachTo(plot);
        }
      })
      .on("mouseleave", () => {
        this._onPointer.detach(plot);
        this._onClick.detach(plot);
      });

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

  render() {
    return (
      <div className={"chart-wrapper"}>
        <div className={"chart"}>
          <div
            id={"chart-" + this.props.featureName}
            className={"chart-string-bar"}
          />
          <div id={"xaxis-" + this.props.featureName} className={"xaxis"} />
          <div id={"tooltip-" + this.props.featureName} className={"tooltip"} />
        </div>
      </div>
    );
  }
}
