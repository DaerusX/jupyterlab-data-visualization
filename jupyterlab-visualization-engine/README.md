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

## 目录结构描述
├── node_modules　　　　　　　　// npm包    
├── lib　　　　　　　　　　　　 // 打包结果  
├── src　　　// 前端插件组件源文件  
　├────third-party　//第三方文件，包括protobuf用社区工具生成的js、ts文件，以及facets提供的plottablec插件，应忽略tslint规则  
　├──── common　　　　　　// 通用数据处理部分，包括数据接收，数据转换，以及通用处理方法  
　├──── component　　　　　　// 图和表的模板组件，引入了ant-design做表和plottablejs作图   
　├──── views　　　　　　// 视图组件  
 　　├──── widget　　　　　　// 输出区域渲染组件  
　　　├────header　　　　　　// 全局控制区  
　　　├────body　　　　　// 展示区  
　　　　├────header　　　　　// 局部控制区  
　　　　├────table　　　　　// 表格(ant-design)  
　　　　├────chart　　　　　// 图(plottablejs)  
　　　├──── Widget.tsx　　　　　　// 输出区域index(react)  
　├──── index.ts　　　　　　// Jupyter mimerenderer插件 index,包括渲染类型定义、插件挂载区域定义、插件挂载 
