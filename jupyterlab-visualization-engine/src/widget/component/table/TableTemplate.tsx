import * as React from "react";
import {Datasets, StringStats} from "../../common/DataModel";
import * as TableColumns from "./TableColumns";
import {Table} from "antd";
import "antd/dist/antd.css";
import {StandardHistogramChart} from "../../views/widget/body/chart/StandardHistogramChart";
import {ControllerStatus} from "../../views/widget/widgetCommon";
import {StringBarChart} from "../../views/widget/body/chart/StringBarChart";
import {StringLineChart} from "../../views/widget/body/chart/StringLineChart";
import "../../../../style/table.css"

interface TableTemplateProps {
  datasets: Datasets;
  featureName: string;
  extendColumns: Array<{ title: string; key: string }>;
  tableConfig?: object;
  controllerStatus: ControllerStatus;
  type: "Number" | "String";
}

interface TableTemplateStates {
  columns: Array<Object>;
  data: Array<Object>;
}

export default class TableTemplate extends React.Component<
  TableTemplateProps,
  TableTemplateStates
> {
  private num: number = 0;

  constructor(props: TableTemplateProps) {
    super(props);

    const tempData: Array<Object> = this.initDataSourceHandler();
    this.state = {
      columns: [],
      data: tempData,
    };
    this.initColumnsHandler();
  }

  protected initDataSourceHandler() {
    const { datasets, featureName } = this.props;
    let tempData: Array<Object> = [];
    datasets.forEach((dataset) => {
      if (
        this.props.controllerStatus.checkedDatasetList.includes(dataset.name)
      ) {
        const features = dataset.features;
        if (!features) {
          return;
        }

        const feature = features.get(featureName);
        if (feature) {
          this.num = (feature.stats as StringStats).unique;
          tempData.push({
            key: featureName + dataset.name,
            feature: featureName,
            dataset: dataset.name,
            ...feature.stats,
            chart: this.props.datasets,
          });
        }
      } else {
        return;
      }
    });
    return tempData;
  }

  protected initColumnsHandler() {
    for (const col of TableColumns.BaseColumns) {
      this.state.columns.push({
        title: col.title,
        key: col.key,
        dataIndex: col.key,
        width: 75,
        align: "center",
        ellipsis: true,
      });
    }
    for (const col of TableColumns.CommonColumns) {
      this.state.columns.push({
        title: col.title,
        key: col.key,
        dataIndex: col.key,
        width: 75,
        align: "center",
        ellipsis: true,
      });
    }
    for (const col of this.props.extendColumns) {
      this.state.columns.push({
        title: col.title,
        key: col.key,
        dataIndex: col.key,
        width: 80,
        align: "center",
        ellipsis: true,
      });
    }
    for (const col of TableColumns.ChartColumns) {
      this.state.columns.push({
        title: col.title,
        key: col.key,
        dataIndex: col.key,
        align: "center",
        width: 350,
        render: (value: any, row: any, index: number) => {
          if (!value) {
            return null;
          }
          return {
            children:
              this.props.type === "Number" ? (
                <StandardHistogramChart
                  datasets={value}
                  featureName={this.props.featureName}
                  controllerStatus={this.props.controllerStatus}
                />
              ) : this.num > 10 ? (
                <StringLineChart
                  datasets={value}
                  featureName={this.props.featureName}
                  controllerStatus={this.props.controllerStatus}
                />
              ) : (
                <StringBarChart
                  datasets={value}
                  featureName={this.props.featureName}
                  controllerStatus={this.props.controllerStatus}
                />
              ),
            props: {
              rowSpan: index === 0 ? this.state.data.length : 0,
            },
          };
        },
      });
    }
  }

  componentDidUpdate(prevProps: Readonly<TableTemplateProps>): void {
    if (
      this.props.controllerStatus.checkedDatasetList !==
      prevProps.controllerStatus.checkedDatasetList
    ) {
      const tempData = this.initDataSourceHandler();
      this.setState({
        data: tempData,
      });
    }
  }

  protected getRowClassName = (record: any, index: number) => {
    return index % 2 === 0 ? "table-odd-row" : "table-even-row";
  };


  render() {
    return (
      <Table
        {...this.props.tableConfig}
        columns={this.state.columns}
        dataSource={this.state.data}
        pagination={{ hideOnSinglePage: true }}
        rowClassName={this.getRowClassName}
        bordered
      />
    );
  }
}
