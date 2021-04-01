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
import pandas as pd
from datavalidator.third_party_facets_overview.feature_statistics_pb2 import *

class AnalyzeRules:
    def NdarrayToEntry(self, x):
        """Converts an ndarray to the Entry format."""
        row_counts = []
        for row in x:
            try:
                rc = np.count_nonzero(~np.isnan(row))
                if rc != 0:
                    row_counts.append(rc)
            except TypeError:
                try:
                    row_counts.append(row.size)
                except AttributeError:
                    row_counts.append(1)

        data_type = self.DtypeToType(x.dtype)
        converter = self.DtypeToNumberConverter(x.dtype)
        flattened = x.ravel()
        orig_size = len(flattened)

        # Remove all None and nan values and count how many were removed.
        flattened = flattened[flattened != np.array(None)]
        if converter:
            flattened = converter(flattened)
        if data_type == FeatureNameStatistics.STRING:
            flattened_temp = []
            for x in flattened:
                try:
                    if str(x) != 'nan':
                        flattened_temp.append(x)
                except UnicodeEncodeError:
                    if x.encode('utf-8') != 'nan':
                        flattened_temp.append(x)
            flattened = flattened_temp
        else:
            flattened = flattened[~np.isnan(flattened)].tolist()
        missing = orig_size - len(flattened)
        return {
            'vals': flattened,
            'counts': row_counts,
            'missing': missing,
            'type': data_type
        }

    def DtypeToNumberConverter(self, dtype):
        """Converts a Numpy dtype to a converter method if applicable.

          The converter method takes in a numpy array of objects of the provided
          dtype
          and returns a numpy array of the numbers backing that object for
          statistical
          analysis. Returns None if no converter is necessary.

        Args:
          dtype: The numpy dtype to make a converter for.

        Returns:
          The converter method or None.
        """
        if np.issubdtype(dtype, np.datetime64):

            def DatetimesToNumbers(dt_list):
                return np.array([pd.Timestamp(dt).value for dt in dt_list])

            return DatetimesToNumbers
        elif np.issubdtype(dtype, np.timedelta64):

            def TimedetlasToNumbers(td_list):
                return np.array([pd.Timedelta(td).value for td in td_list])

            return TimedetlasToNumbers
        else:
            return None

    def DtypeToType(self, dtype):
        """Converts a Numpy dtype to the FeatureNameStatistics.Type proto enum."""
        if dtype.char in np.typecodes['AllFloat']:
            return FeatureNameStatistics.FLOAT
        elif (dtype.char in np.typecodes['AllInteger'] or dtype == np.bool or
              np.issubdtype(dtype, np.datetime64) or
              np.issubdtype(dtype, np.timedelta64)):
            return FeatureNameStatistics.INT
        else:
            return FeatureNameStatistics.STRING
