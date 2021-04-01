#创建lab前端插件的步骤

确保已经安装了cookiecutter

```bash
pip install cookiecutter
```

利用命令创建lab插件的脚手架工程

```bash
cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts --checkout v2.0
```

目前使用的为jupyterlab >= 2.0.0版本的插件形式

安装lab前端插件步骤

1、进入插件目录下，执行jupyter labextension install .
2、在目录下执行yarn watch（可以监听ts变化，目前不支持css文件的变化监听）

注意：
1、如需要修改插件的版本号在package.json中的version字段
2、前端插件中的组件如果需要绑定到jupyterlab的上，必须对Widget设置id字段

#创建python插件

```bash
cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts --checkout v2.0
```
后端插件要有__init__.py文件，里面包含需要扩展的方法

MANIFEST.in文件用于python对应的代码库文件
_version.py文件用于描述版本

其中还需要包含setup.py文件用于安装

需要一个json文件配置nb的插件如：
```
{
  "NotebookApp": {
    "nbserver_extensions": {
      "data-validator": true
    }
  }
}
```
