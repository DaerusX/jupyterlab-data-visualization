from src.third_party_facets_overview import GenericFeatureStatisticsGenerator
import pandas as pd
from src.data_validator_pkg import transform
import base64

df =  pd.DataFrame({'num' : [1, 2, 3, 4], 'str' : ['a', 'a', 'b', None]})
proto = GenericFeatureStatisticsGenerator().ProtoFromDataFrames([{'name': 'test', 'table': df}])
protostr = base64.b64encode(proto.SerializeToString()).decode("utf-8")


transform({
    "application/vnd.datav.v1+json": {
        "description": "A simple bar chart with embedded data.",
        "data": {
            "values":
                {
                    "protostr": protostr
                }
        }
    }
}, raw=True)