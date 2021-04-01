# Thisdataframes=Nonethon script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


from datavalidator.handlers.statistics_handler import StatisticsHandler
from datavalidator.handlers.convert_handler import ConvertHandler


def data_visualize(dataframes):
    proto = StatisticsHandler().ProtoFromDataFrames(dataframes)
    ConvertHandler().data_convert(proto)
