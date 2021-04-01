/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Plottable from "plottable";
import * as React from "react";
import { BucketForChart, Datasets } from "../../common/DataModel";
import * as utils from "../../common/utils";
import * as d3 from "d3";
import "plottable/plottable.css";
import "../../../../style/chart.css";
import { QuantitativeScale } from "plottable";
import {ControllerStatus} from "../../views/widget/widgetCommon";

export interface ChartTemplateProps {
  datasets: Datasets;
  featureName: string;
  controllerStatus: ControllerStatus;
}

export abstract class ChartTemplate<
  P extends ChartTemplateProps,
  S = {}
> extends React.Component<P, S> {
  protected chartTable!: Plottable.Components.Table;
  protected xAxisTable!: Plottable.Components.Table;
  _onPointer: Plottable.Interactions.Pointer = new Plottable.Interactions.Pointer();
  _onPointerEnterFunction: Object = {};
  _onPointerExitFunction: Object = {};
  _onClick: Plottable.Interactions.Click = new Plottable.Interactions.Click();
  _onClickFunction: Object = {};

  constructor(props: P) {
    super(props);
  }

  public abstract renderChart(): void;

  protected static getScale(logScale: boolean): QuantitativeScale<number> {
    return logScale
      ? new Plottable.Scales.ModifiedLog()
      : new Plottable.Scales.Linear();
  }

  protected static chartAxisScaleFormatter() {
    // Use a short scale formatter if the value is above 1000.
    const shortScaleFormatter = Plottable.Formatters.shortScale(0);
    return (num: number) => {
      if (Math.abs(num) < 1000) {
        return String(num);
      }
      return shortScaleFormatter(num);
    };
  }

  protected _getCountWithFloor(
    // tslint:disable-next-line:no-any typescript/polymer temporary issue
    this: any,
    bucket: BucketForChart,
    maxCount: number
  ): number {
    // wouldn't be visible (this only happens in linear scale), then return
    // a count that would make the bucket barely visible in the chart.
    let count = utils.getNumberFromField(bucket.sampleCount);
    if (count > 0 && count / maxCount < this._minBarHeightRatio) {
      count = maxCount * this._minBarHeightRatio;
    }
    return count;
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

  _updateSelectionVisibility(this: any, selection: utils.FeatureSelection) {
    if (!this._selectionElem) {
      return;
    }
    this._selectionElem.style(
      "display",
      selection == null || selection.name !== this.feature ? "none" : "inline"
    );
  }

  protected redrawPlot() {
    this.chartTable.redraw();
    this.xAxisTable.redraw();
  }

  async componentDidMount() {
    setTimeout(() => {
      this.renderChart();
      window.addEventListener("resize", () => this.redrawPlot());
    }, 0);
  }
  async componentDidUpdate() {
    this.renderChart();
  }

  render() {
    return (
      <div className={"chart-wrapper"}>
        <div className={"chart"} >
          <div id={"chart-" + this.props.featureName} className={"chart"} />
          <div id={"xaxis-" + this.props.featureName} className={"xaxis"} />
          <div id={"tooltip-" + this.props.featureName} className={"tooltip"} />
        </div>
      </div>
    );
  }
}
