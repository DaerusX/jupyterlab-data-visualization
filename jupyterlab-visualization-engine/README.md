# mimerender_data_validator

A JupyterLab extension for rendering facets files.

## Prerequisites

* JupyterLab 1.0 or later

## Installation

```bash
jupyter labextension install mimerender_data_validator
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

##文件结构
src为前端组件
third-party为第三方文件，应忽略tslint规则
common为通用数据处理部分
component为组件模板
views为最终渲染的组件


