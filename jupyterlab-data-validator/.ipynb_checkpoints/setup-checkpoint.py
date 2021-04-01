"""
Setup Module to setup Python Handlers for the jlab_ext_example extension.
"""
import os
from os.path import join as pjoin

from jupyter_packaging import (
    ensure_python, get_version
)
import setuptools

HERE = os.path.abspath(os.path.dirname(__file__))

# The name of the project
name="data-validator"

# Ensure a valid python version
ensure_python(">=3.5")

# Get the version
version = get_version(pjoin(name, "_version.py"))

# Representative files that should exist after a successful build

package_data_spec = {
    name: [
        "*"
    ]
}

data_files_spec = [
    ("etc/jupyter/jupyter_notebook_config.d",
     "jupyter-config", "data_validator.json"),
]


# with open("README.md", "r") as fh:
#     long_description = fh.read()

setup_args = dict(
    name=name,
    version=version,
    author="JupyterLab",
    description="A minimal JupyterLab extension with backend and frontend parts.",
    # long_description= long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyterlab~=2.0",
    ],
    zip_safe=False,
    include_package_data=True,
    license="MIT",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Framework :: Jupyter",
    ],
)


if __name__ == '__main__':
    setuptools.setup(**setup_args)
