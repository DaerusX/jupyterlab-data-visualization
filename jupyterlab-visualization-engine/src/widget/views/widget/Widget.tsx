import * as React from "react";
import { InputManager } from "../../common/InputManager";
import { DataModel } from "../../common/DataModel";
import { WidgetBody } from "./body/WidgetBody";
import { WidgetHeader } from "./header/WidgetHeader";
import * as utils from "../../common/utils";
import {ControllerStatus} from "./widgetCommon";
import "../../../../style/widget.css"



interface WidgetProps {
  protostr: string;
}
interface WidgetState {
  controllerStatus: ControllerStatus;
  dataModel: DataModel | null;
  featureList: utils.FeatureSpecAndList[];
}

export default class TestWidgetComponent extends React.Component<
  WidgetProps,
  WidgetState
> {
  private datasetNameList: Array<string>;

  constructor(props: WidgetProps) {
    super(props);
    this.fetchDataModel = this.fetchDataModel.bind(this);
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
    this.resetState = this.resetState.bind(this);
    let tempData = this.fetchDataModel();
    this.datasetNameList = tempData.validDatasetList;
    this.state = {
      controllerStatus: {
        checkedDatasetList: tempData.validDatasetList,
      },
      dataModel: tempData.dataModel,
      featureList: tempData.featureList,
    };
  }

  // componentDidMount(): void {
  //   this.fetchDataModel();
  // }

  fetchDataModel() {
    const { protostr } = this.props;
    let proto = InputManager.convertInputToProto(protostr);
    let dataM = InputManager.cleanProto(proto as any);
    let tempDataModel = new DataModel(dataM);
    let tempValidDatasetList: Array<string> = [];
    tempDataModel.datasets.forEach((dataset) => {
      tempValidDatasetList.push(dataset.name);
    });
    return {
      dataModel: tempDataModel,
      validDatasetList: tempValidDatasetList,
      featureList: tempDataModel.getNonEmptyFeatureSpecLists(),
    };
  }

  resetState() {
    let tempData = this.fetchDataModel();

    this.setState({
      controllerStatus: {
        checkedDatasetList: tempData.validDatasetList,
      },
      dataModel: tempData.dataModel,
      featureList: tempData.featureList,
    });
  }

  onCheckBoxChange(checkedDatasetList: Array<string>) {
    this.setState({
      controllerStatus: {
        checkedDatasetList: checkedDatasetList,
      },
    });
  }

  componentDidUpdate(prevProps: WidgetProps): void {
    if (this.props.protostr !== prevProps.protostr) {
      this.resetState();
    }
  }

  render() {
    if (this.state.dataModel) {
      return (
        <div className={"widget-wrapper"}>
          <WidgetHeader
            onCheckBoxChange={this.onCheckBoxChange}
            datasetList={this.datasetNameList}
          />
          <WidgetBody
            controllerStatus={this.state.controllerStatus}
            datasets={this.state.dataModel.datasets}
            featureList={this.state.featureList}
          />
        </div>
      );
    }
  }
}
