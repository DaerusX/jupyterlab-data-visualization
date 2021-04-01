import * as React from "react";
import { Datasets } from "../../../common/DataModel";
import NumericTable from "./table/NumericTable";
import StringTable from "./table/StringTable";
import * as utils from "../../../common/utils";
import "../../../../../style/canvas.css";
import { ControllerStatus } from "../widgetCommon";

interface WidgetBodyProps {
  datasets: Datasets;
  featureList: utils.FeatureSpecAndList[];
  controllerStatus: ControllerStatus;
}
interface WidgetBodyState {
  numericFeatureList: Array<string>;
  stringFeatureList: Array<string>;
}

export class WidgetBody extends React.Component<
  WidgetBodyProps,
  WidgetBodyState
> {
  constructor(props: WidgetBodyProps) {
    super(props);
    this.getClassifiedFeatureList = this.getClassifiedFeatureList.bind(this);
    let tempData = this.getClassifiedFeatureList();
    this.state = {
      numericFeatureList: tempData.numericFeatureList,
      stringFeatureList: tempData.stringFeatureList,
    };
  }

  // componentDidMount(): void {
  //
  // }

  getClassifiedFeatureList() {
    const { featureList } = this.props;
    const numericTopSpec = utils.FS_VAR_LEN_FLOATS;
    const numericBottomSpec = utils.FS_SCALAR_INT;
    const stringTopSpec = utils.FS_VAR_LEN_STRS;
    const stringBottomSpec = utils.FS_SCALAR_STR;
    let numericFeatureList: Array<string> = [];
    let stringFeatureList: Array<string> = [];

    for (const featuresOfOneSpec of featureList) {
      if (
        featuresOfOneSpec.spec! > numericTopSpec ||
        featuresOfOneSpec.spec! < numericBottomSpec
      ) {
        continue;
      }
      const featureNameList = featuresOfOneSpec.features;
      if (featureNameList) {
        numericFeatureList = numericFeatureList.concat(featureNameList);
      }
    }
    for (const featuresOfOneSpec of this.props.featureList) {
      if (
        featuresOfOneSpec.spec! > stringTopSpec ||
        featuresOfOneSpec.spec! < stringBottomSpec
      ) {
        continue;
      }
      const featureNameList = featuresOfOneSpec.features;
      if (featureNameList) {
        stringFeatureList = stringFeatureList.concat(featureNameList);
      }
    }
    return {
      numericFeatureList: numericFeatureList,
      stringFeatureList: stringFeatureList,
    };
  }

  // componentDidUpdate(): void {
  //   this.getClassifiedFeatureList()
  // }

  render() {
    this.getClassifiedFeatureList();
    return (
      <div>
        <div className="tableList">
          {this.state.numericFeatureList.map((feature, index) => (
            <NumericTable
              key={feature + index}
              controllerStatus={this.props.controllerStatus}
              datasets={this.props.datasets}
              featureName={feature}
              index={index}
            />
          ))}
        </div>
        <div className="tableList">
          {this.state.stringFeatureList.map((feature, index) => (
            <StringTable
              key={feature + index}
              controllerStatus={this.props.controllerStatus}
              datasets={this.props.datasets}
              featureName={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }
}
