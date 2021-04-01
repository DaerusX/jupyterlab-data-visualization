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
"""
Rules of generating numeric data to proto
"""

import numpy as np
from datavalidator.third_party_facets_overview.feature_statistics_pb2 import *
from .process_rules_template import RulesProcessTemplate


class NumberProcessRules(RulesProcessTemplate):
    def data_process(self, featstats, value, has_data):
        if has_data:
            nums = value['vals']
            featstats.std_dev = np.asscalar(np.std(nums))
            featstats.mean = np.asscalar(np.mean(nums))
            featstats.min = np.asscalar(np.min(nums))
            featstats.max = np.asscalar(np.max(nums))
            featstats.median = np.asscalar(np.median(nums))
            featstats.num_zeros = len(nums) - np.count_nonzero(nums)

            nums = np.array(nums)
            num_nan = len(nums[np.isnan(nums)])
            num_posinf = len(nums[np.isposinf(nums)])
            num_neginf = len(nums[np.isneginf(nums)])

            # Remove all non-finite (including NaN) values from the numeric
            # values in order to calculate histogram buckets/counts. The
            # inf values will be added back to the first and last buckets.
            nums = nums[np.isfinite(nums)]
            counts, buckets = np.histogram(nums)
            hist = featstats.histograms.add()
            hist.type = Histogram.STANDARD
            hist.num_nan = num_nan
            for bucket_count in range(len(counts)):
                bucket = hist.buckets.add(
                    low_value=buckets[bucket_count],
                    high_value=buckets[bucket_count + 1],
                    sample_count=np.asscalar(counts[bucket_count]))
                # Add any negative or positive infinities to the first and last
                # buckets in the histogram.
                if bucket_count == 0 and num_neginf > 0:
                    bucket.low_value = float('-inf')
                    bucket.sample_count += num_neginf
                elif bucket_count == len(counts) - 1 and num_posinf > 0:
                    bucket.high_value = float('inf')
                    bucket.sample_count += num_posinf
            if not hist.buckets:
                if num_neginf:
                    hist.buckets.add(
                        low_value=float('-inf'),
                        high_value=float('-inf'),
                        sample_count=num_neginf)
                if num_posinf:
                    hist.buckets.add(
                        low_value=float('inf'),
                        high_value=float('inf'),
                        sample_count=num_posinf)
            self._PopulateQuantilesHistogram(featstats.histograms.add(), nums.tolist())
        return featstats
