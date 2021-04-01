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
Rules of generating string data to proto
"""

import numpy as np
from datavalidator.third_party_facets_overview.feature_statistics_pb2 import *
from .process_rules_template import RulesProcessTemplate


class StringProcessRules(RulesProcessTemplate):
    def categorical_data_process(self, featstats, value, has_data, histogram_categorical_levels_count):
        if has_data:
            strs = []
            for item in value['vals']:
                strs.append(item if hasattr(item, '__len__') else
                            item.encode('utf-8') if hasattr(item, 'encode') else str(
                                item))

            featstats.avg_length = np.mean(np.vectorize(len)(strs))
            vals, counts = np.unique(strs, return_counts=True)
            featstats.unique = len(vals)
            sorted_vals = sorted(zip(counts, vals), reverse=True)
            sorted_vals = sorted_vals[:histogram_categorical_levels_count]
            for val_index, val in enumerate(sorted_vals):
                try:
                    if (sys.version_info.major < 3 or
                            isinstance(val[1], (bytes, bytearray))):
                        printable_val = val[1].decode('UTF-8', 'strict')
                    else:
                        printable_val = val[1]
                except (UnicodeDecodeError, UnicodeEncodeError):
                    printable_val = '__BYTES_VALUE__'
                bucket = featstats.rank_histogram.buckets.add(
                    low_rank=val_index,
                    high_rank=val_index,
                    sample_count=np.asscalar(val[0]),
                    label=printable_val)
                if val_index < 2:
                    featstats.top_values.add(
                        value=bucket.label, frequency=bucket.sample_count)
        return featstats
