from datavalidator.visualization.data_visualization import data_visualize
import pandas as pd

df =  pd.DataFrame({'num' : [1, 2, 3, 4], 'str' : ['a', 'a', 'b', None]})
data_visualize([{'name': 'test', 'table': df}])


