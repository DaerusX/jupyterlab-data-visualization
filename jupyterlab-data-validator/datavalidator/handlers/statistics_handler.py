# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

import numpy as np
from ..third_party_facets_overview.feature_statistics_pb2 import *
from ..rules.analyze.analyze_rules import AnalyzeRules
from ..rules.process import *


class StatisticsHandler:
    def __init__(self):
        self.fs_proto = FeatureNameStatistics
        self.datasets_proto = DatasetFeatureStatisticsList
        self.histogram_proto = Histogram

    def ProtoFromDataFrames(self, dataframes,
                            histogram_categorical_levels_count=None):
        """Creates a feature statistics proto from a set of pandas dataframes.

        Args:
          dataframes: A list of dicts describing tables for each dataset for the
              proto. Each entry contains a 'table' field of the dataframe of the
                data
              and a 'name' field to identify the dataset in the proto.
          histogram_categorical_levels_count: int, controls the maximum number of
              levels to display in histograms for categorical features.
              Useful to prevent codes/IDs features from bloating the stats object.
              Defaults to None.
        Returns:
          The feature statistics proto for the provided tables.
        """
        datasets = []
        for dataframe in dataframes:
            table = dataframe['table']
            table_entries = {}
            for col in table:
                table_entries[col] = AnalyzeRules().NdarrayToEntry(table[col])
            datasets.append({
                'entries': table_entries,
                'size': len(table),
                'name': dataframe['name']
            })
        return self.GetDatasetsProto(
            datasets,
            histogram_categorical_levels_count=histogram_categorical_levels_count)

    def GetDatasetsProto(self, datasets, features=None,
                         histogram_categorical_levels_count=None):
        """Generates the feature stats proto from dictionaries of feature values.

        Args:
          datasets: An array of dictionaries, one per dataset, each one containing:
              - 'entries': The dictionary of features in the dataset from the parsed
                examples.
              - 'size': The number of examples parsed for the dataset.
              - 'name': The name of the dataset.
          features: A list of strings that is a whitelist of feature names to create
              feature statistics for. If set to None then all features in the
                dataset
              are analyzed. Defaults to None.
          histogram_categorical_levels_count: int, controls the maximum number of
              levels to display in histograms for categorical features.
              Useful to prevent codes/IDs features from bloating the stats object.
              Defaults to None.

        Returns:
          The feature statistics proto for the provided datasets.
        """
        features_seen = set()
        whitelist_features = set(features) if features else None
        all_datasets = self.datasets_proto()

        # Initialize each dataset
        for dataset in datasets:
            all_datasets.datasets.add(
                name=dataset['name'], num_examples=dataset['size'])
        # This outer loop ensures that for each feature seen in any of the provided
        # datasets, we check the feature once against all datasets.
        for outer_dataset in datasets:
            for key, value in outer_dataset['entries'].items():
                # If we have a feature whitelist and this feature is not in the
                # whitelist then do not process it.
                # If we have processed this feature already, no need to do it again.
                if ((whitelist_features and key not in whitelist_features) or
                        key in features_seen):
                    continue
                features_seen.add(key)
                # Default to type int if no type is found, so that the fact that all
                # values are missing from this feature can be displayed.
                feature_type = value['type'] if 'type' in value else self.fs_proto.INT
                # Process the found feature for each dataset.
                for j, dataset in enumerate(datasets):
                    feat = all_datasets.datasets[j].features.add(
                        type=feature_type, name=key.encode('utf-8'))
                    value = dataset['entries'].get(key)
                    has_data = value is not None and (value['vals'].size != 0
                                                      if isinstance(
                        value['vals'], np.ndarray) else
                                                      value['vals'])
                    commonstats = None
                    featstats = None
                    # For numeric features, calculate numeric statistics.
                    if feat.type in (self.fs_proto.INT, self.fs_proto.FLOAT):
                        featstats = feat.num_stats
                        featstats = NumberProcessRules().data_process(featstats, value, has_data)
                    elif feat.type == self.fs_proto.STRING:
                        featstats = feat.string_stats
                        featstats = StringProcessRules().categorical_data_process(featstats, value, has_data,
                                                                                  histogram_categorical_levels_count)
                    commonstats = featstats.common_stats
                    CommonProcessRules().common_data_process(commonstats, value, has_data,
                                                             all_datasets.datasets[j].num_examples)

        return all_datasets
