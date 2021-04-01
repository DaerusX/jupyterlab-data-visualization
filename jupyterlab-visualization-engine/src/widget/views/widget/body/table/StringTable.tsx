import * as React from "react";
import TableTemplate from "../../../../component/table/TableTemplate";
import { Datasets } from "../../../../common/DataModel";
import { StringColumns } from "../../../../component/table/TableColumns";
import { ControllerStatus } from "../../widgetCommon";

interface StringTableProps {
  datasets: Datasets;
  featureName: string;
  index: number;
  controllerStatus: ControllerStatus;
}

export default class StringTable extends React.Component<StringTableProps> {
  constructor(props: StringTableProps | Readonly<StringTableProps>) {
    super(props);
  }

  render() {
    return (
      <div style={{ marginTop: !!this.props.index ? "20px" : 0 }}>
        <TableTemplate
          tableConfig={{
            showHeader: !this.props.index,
            title: !!this.props.index ? undefined : () => "StringFeatures",
          }}
          datasets={this.props.datasets}
          featureName={this.props.featureName}
          extendColumns={StringColumns}
          controllerStatus={this.props.controllerStatus}
          type={'String'}
        />
      </div>
    );
  }
}
