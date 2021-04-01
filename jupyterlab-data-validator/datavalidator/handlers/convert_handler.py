# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

from IPython.display import display
import base64


class ConvertHandler:
    def data_convert(self, proto):
        protostr = base64.b64encode(proto.SerializeToString()).decode("utf-8")
        display({
            "application/vnd.datav.v1+json": {
                "description": "data analyze and visualize",
                "data": {
                    "values":
                        {
                            "protostr": protostr
                        }
                }
            }
        }, raw=True)
