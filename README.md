DEMO
===========================
#### 项目描述  
本项目为用于JupyterLab的数据集可视化项目，基于facets_overview开发，接收Dataframe格式数据并进行简易分析和作图，demo图如下  
![image](https://github.com/DaerusX/jupyterlab-data-visualization/blob/main/test_files/demo.gif)

#### 项目特点　　
对数据进行单变量分析，缺失值、空值、零值统计  
简易操作，封装良好，当前demo版本只暴露一个方法，见test_files  
支持多数据集读入和横向对比  
同框作图，多数据集同时作图

#### 环境依赖  
pip 或 conda  ~
node ~  
jupyter lab v2.~

####  部署步骤  
##### 安装python包data-validator  
确保已经安装了requirement中要求的python包  
在data-validator目录下
```bash
pip install -e .
```

##### 安装JupyterLab插件

```bash
jupyter labextension install mimerender_data_validator
```

###### Development

在jupyterlab-visualization-engine目录下  

```bash
npm install
jupyter labextension link .
```

开发后重新部署  
To rebuild the package and the JupyterLab app:

```bash
npm run build 或 jplm build
jupyter lab build
```


## 目录结构描述
├── Readme.md　　　　　　　　　　// help  
├── LICENSE　　　　　　　　　　　　　  
├── jupyter-data-validator　　　// python包  
├── jupyter-visualization-engine　　// jupyter-mimerenderer插件  
├── test_filese　　　　　　// 测试文件  


