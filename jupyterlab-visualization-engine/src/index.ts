import { IRenderMime } from "@jupyterlab/rendermime-interfaces";
import "../style/index.css";

import { JSONObject } from "@lumino/coreutils";

import { Widget } from "@lumino/widgets";

import TestWidgetComponent from "./widget/views/widget/Widget";

import ReactDom from "react-dom";
import * as React from "react";

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = "application/vnd.datav.v1+json";

/**
 * The class name added to the extension.
 */
const CLASS_NAME = "mimerenderer-datav";

/**
 * A widget for rendering facets.
 */
export class OutputWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
  }

  /**
   * Render facets into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    let data = model.data[this._mimeType] as JSONObject;
    this.node.textContent = JSON.stringify(data);
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      const testWidget = React.createElement(
        TestWidgetComponent,
        (data as any).data.values
      );
      ReactDom.render(testWidget, this.node);
      resolve();
    });
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for facets data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: (options) => new OutputWidget(options),
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: "datav:plugin",
  rendererFactory,
  rank: 0,
  dataType: "json",
  fileTypes: [
    {
      name: "datav",
      mimeTypes: [MIME_TYPE],
      extensions: [".datav", ".datav.json"],
    },
  ],
  documentWidgetFactoryOptions: {
    name: "DataV",
    primaryFileType: "datav",
    fileTypes: ["datav", "json"],
    defaultFor: ["datav"],
  },
};

export default extension;
