import * as React from "react";
import TableTemplate from "../../../../component/table/TableTemplate";
import { Datasets } from "../../../../common/DataModel";
import { NumericColumns } from "../../../../component/table/TableColumns";
import { ControllerStatus } from "../../widgetCommon";

interface NumericTableProps {
  datasets: Datasets;
  featureName: string;
  index: number;
  controllerStatus: ControllerStatus;
}

export default class NumericTable extends React.Component<NumericTableProps> {
  constructor(props: NumericTableProps | Readonly<NumericTableProps>) {
    super(props);
  }

  render() {
    return (
      <TableTemplate
        tableConfig={{
          showHeader: !this.props.index,
          title: !!this.props.index ? undefined : () => "NumericFeatures",
        }}
        datasets={this.props.datasets}
        featureName={this.props.featureName}
        extendColumns={NumericColumns}
        controllerStatus={this.props.controllerStatus}
        type={'Number'}
      />
    );
  }
}
