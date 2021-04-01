import * as React from "react";
import { Button } from "antd";

export class CanvasHeader extends React.Component {
  render() {
    return (
      <div className={"button-list"}>
          <Button>Example1</Button>
          <Button>Example2</Button>
          <Button>Example3</Button>
      </div>
    );
  }
}
