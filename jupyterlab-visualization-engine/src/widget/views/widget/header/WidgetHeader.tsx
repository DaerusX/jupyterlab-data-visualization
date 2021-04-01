import * as React from "react";
import { Checkbox } from "antd";
import "../../../../../style/canvas.css";

interface WidgetHeaderProps {
  onCheckBoxChange: Function;
  datasetList: Array<string>;
}

export class WidgetHeader extends React.Component<WidgetHeaderProps> {
  onCheckBoxChange(checkedValues: Array<any>) {
    this.props.onCheckBoxChange(checkedValues);
  }
  render() {
    return (
      <div className={"button-list"}>
        <Checkbox.Group
          defaultValue={this.props.datasetList}
          options={this.props.datasetList}
          onChange={this.onCheckBoxChange.bind(this)}
        />
      </div>
    );
  }
}
