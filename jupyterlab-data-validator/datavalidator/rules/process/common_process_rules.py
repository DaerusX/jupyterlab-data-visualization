"""
Common Rules of generating data to proto
"""

import numpy as np
from .process_rules_template import RulesProcessTemplate


class CommonProcessRules(RulesProcessTemplate):
    def common_data_process(self, commonstats, value, has_data, num_examples):
        # Add the common stats regardless of the feature type.
        if has_data:
            commonstats.num_missing = value['missing']
            commonstats.num_non_missing = (num_examples - commonstats.num_missing)
            commonstats.min_num_values = int(np.min(value['counts']).astype(int))
            commonstats.max_num_values = int(np.max(value['counts']).astype(int))
            commonstats.avg_num_values = np.mean(value['counts'])
            if 'feat_lens' in value and value['feat_lens']:
                self._PopulateQuantilesHistogram(
                    commonstats.feature_list_length_histogram, value['feat_lens'])
            self._PopulateQuantilesHistogram(commonstats.num_values_histogram,
                                             value['counts'])
        else:
            commonstats.num_non_missing = 0
            commonstats.num_missing = num_examples