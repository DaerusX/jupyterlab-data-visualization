/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 本模块使用了facets_overview的数据转换代码
 */
import { DatasetFeatureStatisticsList, Histogram, RankHistogram } from '../third-party/feature_statistics_pb'
export type GenericHistogram = Histogram|RankHistogram;
export type GenericHistogramBucket = Histogram.Bucket|RankHistogram.Bucket;


export class InputManager {
    public static convertInputToProto(
        inValue: DatasetFeatureStatisticsList | Uint8Array | string | null):
        DatasetFeatureStatisticsList |
        null {
        // When using a polymer element within Angular, before a property is
        // bound to a value, it may be bound to an empty Object. Treat this
        // as null.
        if (!inValue ||
            (inValue.constructor === Object &&
                Object.keys(inValue).length === 0)) {
            return null;
        }

        // If the input proto is an array then treat it is binary and convert it
        // to the proto object.
        if (inValue instanceof Uint8Array) {
            return DatasetFeatureStatisticsList.deserializeBinary(inValue);
        }

        // If it is a string, then deserialize it to the proto object.
        if (typeof inValue === 'string' || inValue instanceof String) {
            const chars = atob(inValue as string);
            const bytes = new Uint8Array(chars.length);
            for (let i = 0; i < chars.length; i++) {
                bytes[i] = chars.charCodeAt(i);
            }
            return DatasetFeatureStatisticsList.deserializeBinary(bytes);
        }

        // If provided with a plain object and the proto class has a fromObject
        // method then convert the object into the proto.
        if (inValue.constructor === Object &&
            typeof (DatasetFeatureStatisticsList as any).fromObject ===
            'function') {
            return (DatasetFeatureStatisticsList as any).fromObject(inValue);
        }

        // In this case, a proto object has already been provided as input so
        // no conversion is necessary.
        return inValue;
    }

    public static cleanProto(datasets: DatasetFeatureStatisticsList):
        DatasetFeatureStatisticsList {
        // For all deprecated fields in the feature statistics proto, if that
        // field is set and its non-deprecated version is not set, then copy the
        // deprecated field into the non-deprecated field.
        datasets.getDatasetsList().forEach(dataset => {
            dataset.getFeaturesList().forEach(feature => {
                // If the feature's path step list is set, then use this path to create
                // the feature's name, separated by forward slashes.
                const path = feature.getPath();
                if (path != null) {
                    const steps = path.getStepList();
                    if (steps != null) {
                        feature.setName(steps.join('/'));
                    }
                }

                let hists: GenericHistogram[] = [];
                if (feature.getStringStats()) {
                    const h = feature.getStringStats()!.getRankHistogram();
                    if (h) {
                        hists.push(h);
                    }
                    const topValuesList = feature.getStringStats()!.getTopValuesList();
                    if (topValuesList) {
                        topValuesList.forEach(topVal => {
                            const deprecatedFreq = topVal.getDeprecatedFreq();
                            if (deprecatedFreq && !topVal.getFrequency()) {
                                topVal.setFrequency(deprecatedFreq);
                            }
                        });
                    }
                } else if (feature.getNumStats()) {
                    const newHists = feature.getNumStats()!.getHistogramsList();
                    if (newHists) {
                        hists = hists.concat(newHists);
                    }
                }
                hists.forEach(h => {
                    const buckets: Histogram.Bucket[] =
                        h.getBucketsList()! as Histogram.Bucket[];
                    if (buckets) {
                        buckets.forEach((b: GenericHistogramBucket) => {
                            const deprecatedCount = b.getDeprecatedCount();
                            if (deprecatedCount && !b.getSampleCount()) {
                                b.setSampleCount(deprecatedCount);
                            }
                        });
                    }
                });
            });
        });
        return datasets;
    }

}

