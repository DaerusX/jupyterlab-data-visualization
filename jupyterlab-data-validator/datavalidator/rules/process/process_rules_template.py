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
from datavalidator.third_party_facets_overview.feature_statistics_pb2 import *
import abc


class RulesProcessTemplate(object):
    @abc.abstractmethod
    def data_process(self, featstats, value, has_data):
        pass

    """Process function of categorical data (such as LOCATE_1A...LOCATE_2^10Z).
            """
    @abc.abstractmethod
    def categorical_data_process(self, featstats, value, has_data, histogram_categorical_levels_count):
        pass

    def _PopulateQuantilesHistogram(self, hist, nums):
        """Fills in the histogram with quantile information from the provided array.

        Args:
          hist: A Histogram proto message to fill in.
          nums: A list of numbers to create a quantiles histogram from.
        """
        if not nums:
            return
        num_quantile_buckets = 10
        quantiles_to_get = [
            x * 100 / num_quantile_buckets for x in range(num_quantile_buckets + 1)
        ]
        quantiles = np.percentile(nums, quantiles_to_get)
        hist.type = Histogram.QUANTILES
        quantiles_sample_count = float(len(nums)) / num_quantile_buckets
        for low, high in zip(quantiles, quantiles[1:]):
            hist.buckets.add(
                low_value=low, high_value=high, sample_count=quantiles_sample_count)
