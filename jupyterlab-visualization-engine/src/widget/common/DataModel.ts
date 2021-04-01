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
 * 本模块借用了facets_overview的数据处理部分内容自定义了DataModel类
 */
import {
  CommonStatistics,
  DatasetFeatureStatistics,
  DatasetFeatureStatisticsList,
  FeatureNameStatistics,
  Histogram,
} from "../third-party/feature_statistics_pb";
import * as utils from "./utils";

export enum Type {
  INT = 0,
  FLOAT = 1,
  STRING = 2,
  BYTES = 3,
  STRUCT = 4,
}

export interface BucketForChart {
  lowValue: number;
  highValue: number;
  label?: string;
  sampleCount: number;
}

export interface HistogramForChart {
  buckets: BucketForChart[];
}

export interface CommonStats {
  numNonMissing: number;
  numMissing: number;
  minNumValues: number;
  maxNumValues: number;
  avgNumValues: number;
  totalNumValues: number;
  histogram?: HistogramForChart;
}

export interface StringStats {
  numNonMissing: number;
  numMissing: number;
  unique: number;
  topValue: string;
  frequency: number;
  avgLength: number;
  standardHistogram?: HistogramForChart;
  quantileHistogram?: HistogramForChart;
  namedHistogram?: HistogramForChart;
}

export interface NumericStats {
  numNonMissing: number;
  numMissing: number;
  mean: number;
  stdDev: number;
  numZeros: number;
  min: number;
  median: number;
  max: number;
  standardHistogram?: HistogramForChart;
  quantileHistogram?: HistogramForChart;
  namedHistogram?: HistogramForChart;
}

export interface BytesStats {
  numNonMissing: number;
  numMissing: number;
  unique: number;
  minNumBytes: number;
  maxNumBytes: number;
  avgNumBytes: number;
  standardHistogram?: HistogramForChart;
  quantileHistogram?: HistogramForChart;
  namedHistogram?: HistogramForChart;
}

export type Stats = NumericStats | StringStats | BytesStats;

export declare interface Feature {
  type: Type;
  stats: Stats;
}

export declare interface Dataset {
  name: string;
  features: Map<string, Feature>;
}

export declare type Datasets = Array<Dataset>;

export class DataModel {
  public datasets: Datasets = [];
  // Feature Spec 特征规范 指由类型、长度、关键字指定的特征 比如 定长整数day1
  private featuresBySpec: string[][];
  private data: DatasetFeatureStatisticsList;
  constructor(data: DatasetFeatureStatisticsList) {
    this.data = data;
    this.featuresBySpec = this.classifyFeatures(data);
    this.initHandler();
  }

  private initHandler() {
    let name: string;
    let type: number;
    for (const dataset of this.data.getDatasetsList()) {
      let tempFeatures = new Map<string, Feature>();
      for (const feature of dataset.getFeaturesList()) {
        name = feature.getName();
        type = feature.getType();
        switch (type) {
          case FeatureNameStatistics.Type.INT:
          case FeatureNameStatistics.Type.FLOAT:
            DataModel.dataFillingForNum(name, feature, type, tempFeatures);
            break;
          case FeatureNameStatistics.Type.STRING:
            DataModel.dataFillingForStr(name, feature, type, tempFeatures);
            break;
        }
      }
      this.datasets.push({
        name: dataset.getName(),
        features: tempFeatures,
      });
    }
  }

  private static dataFillingForNum(
    name: string,
    feature: FeatureNameStatistics,
    type: Type,
    tempFeatures: Map<string, Feature>
  ) {
    const num = feature.getNumStats();
    if (!num) {
      return;
    }
    const common = num.getCommonStats();
    let numStats: NumericStats;
    if (common && common.getNumNonMissing() > 0) {
      numStats = {
        numNonMissing: common!.getNumNonMissing(),
        numMissing: common!.getNumMissing(),
        mean: num.getMean(),
        stdDev: num.getStdDev(),
        numZeros: num.getNumZeros(),
        min: num.getMin(),
        median: num.getMedian(),
        max: num.getMax(),
      };
      num.getHistogramsList().forEach((histogram, index) => {
        if (histogram.getName()) {
          let buckets: BucketForChart[] = [];
          histogram.getBucketsList().forEach((bucket) => {
            buckets.push({
              lowValue: bucket.getLowValue(),
              highValue: bucket.getHighValue(),
              sampleCount: bucket.getSampleCount(),
            });
          });
          numStats.namedHistogram = { buckets };
        } else {
          if (histogram.getType() === Histogram.HistogramType.STANDARD) {
            let buckets: BucketForChart[] = [];
            histogram.getBucketsList().forEach((bucket) => {
              buckets.push({
                lowValue: bucket.getLowValue(),
                highValue: bucket.getHighValue(),
                sampleCount: bucket.getSampleCount(),
              });
            });
            numStats.standardHistogram = { buckets };
          } else {
            let buckets: BucketForChart[] = [];
            histogram.getBucketsList().forEach((bucket) => {
              buckets.push({
                lowValue: bucket.getLowValue(),
                highValue: bucket.getHighValue(),
                sampleCount: bucket.getSampleCount(),
              });
            });
            numStats.quantileHistogram = { buckets };
          }
        }
      });
      tempFeatures.set(name, { type: type, stats: numStats });
    }
  }

  private static dataFillingForStr(
    name: string,
    feature: FeatureNameStatistics,
    type: Type,
    tempFeatures: Map<string, Feature>
  ) {
    const str = feature.getStringStats();
    if (!str) {
      return;
    }
    const common = str.getCommonStats();
    let strStats: StringStats;
    if (common && common.getNumNonMissing()) {
      strStats = {
        numNonMissing: common!.getNumNonMissing(),
        numMissing: common!.getNumMissing(),
        unique: str.getUnique(),
        topValue: str.getTopValuesList()[0].getValue(),
        frequency: str.getTopValuesList()[0].getFrequency(),
        avgLength: str.getAvgLength(),
      };
      const rankHistogram = str.getRankHistogram();
      if (!rankHistogram) {
        return;
      }
      let buckets: BucketForChart[] = [];
      rankHistogram.getBucketsList().forEach((bucket, index) => {
        buckets.push({
          lowValue: bucket.getLowRank(),
          highValue: bucket.getHighRank(),
          label: bucket.getLabel(),
          sampleCount: bucket.getSampleCount(),
        });
      });
      strStats.namedHistogram = { buckets };
      tempFeatures.set(name, { type: type, stats: strStats });
    }
  }

  /**
   * 将二维数组featuresBySpec转成对象数组返回
   */
  public getNonEmptyFeatureSpecLists(): utils.FeatureSpecAndList[] {
    const ret: utils.FeatureSpecAndList[] = [];
    for (let i = 0; i < utils.FS_NUM_VALUES; i++) {
      if (this.featuresBySpec[i].length !== 0) {
        const featureSpecList = new utils.FeatureSpecAndList();
        featureSpecList.features = this.featuresBySpec[i];
        featureSpecList.spec = i;
        ret.push(featureSpecList);
      }
    }
    return ret;
  }

  /**
   * 给features归类，如 map[FS_FIXED_LEN_FLOATS] = [feature1, feature3]
   * map[FS_VAR_LEN_STRUCT] = [feature 2]
   */
  private classifyFeatures(data: DatasetFeatureStatisticsList): string[][] {
    const map: string[][] = [];
    for (let spec = 0; spec < utils.FS_NUM_VALUES; spec++) {
      map[spec] = [];
    }
    const features = this.getUniqueFeatures(data);
    features.forEach((feature) => {
      const spec = this.getFeatureSpecForFeature(feature.getName());
      map[spec].push(feature.getName());
    });
    return map;
  }

  /**
   * Returns the FeatureSpec for a provided feature.
   * 给定feature关键字,遍历当前数据集，返还最一般的spec，没有这个feature则返回UNKOWN
   * 强度：变长（最一般）<定长<标量
   */
  getFeatureSpecForFeature(feature: string): utils.FeatureSpec {
    const datasetNames = this.getDatasetNames();
    let spec: utils.FeatureSpec = utils.FS_UNKNOWN;

    for (let datasetIdx = 0; datasetIdx < datasetNames.length; datasetIdx++) {
      const stats = this.getFeature(feature, datasetNames[datasetIdx])!;
      const newSpec =
        stats == null
          ? utils.FS_UNKNOWN
          : utils.getSpecFromFeatureStats(
              stats.getType()!,
              this.getFeatureCommonStats(feature, datasetNames[datasetIdx])!
            );

      // Update the overall FeatureSpec based on previous datasets and the
      // current dataset.
      spec = utils.updateSpec(spec, newSpec);
    }
    if (spec === utils.FS_NUM_VALUES) {
      spec = utils.FS_UNKNOWN;
    }
    return spec;
  }

  /**
   * 给定feature, dataset返回该数据集中该特征的通用统计（见proto分析）
   */
  getFeatureCommonStats(
    featureName: string | null,
    datasetName: string
  ): CommonStatistics | null | undefined {
    const featureStats = this.getFeature(featureName, datasetName);
    if (featureStats == null) {
      return null;
    }
    return utils.getCommonStats(featureStats);
  }

  /**
   * 遍历dataset, 依据给定的关键词返回feature
   */
  getFeature(
    featureName: string | null,
    datasetName: string
  ): FeatureNameStatistics | null {
    if (!featureName) {
      return null;
    }
    if (!this.data) {
      return null;
    }
    const dataset = this.getDataset(datasetName);
    if (!dataset) {
      return null;
    }
    for (const feature of dataset.getFeaturesList()) {
      if (feature.getName() === featureName) {
        return feature;
      }
    }
    return null;
  }

  /***
   * Retrieve a dataset by its name, or null if not found.
   */
  getDataset(name: string): DatasetFeatureStatistics | null {
    if (!this.data) {
      return null;
    }
    for (const dataset of this.data.getDatasetsList()) {
      if (dataset.getName() === name) {
        return dataset;
      }
    }
    return null;
  }

  /***
   * Return an array containing the names of all datasets.
   */
  getDatasetNames(): string[] {
    if (!this.data) {
      return [];
    }
    const datasets = this.data.getDatasetsList()!;
    return datasets.map((dataset) => dataset.getName());
  }

  private getUniqueFeatures(
    data: DatasetFeatureStatisticsList
  ): FeatureNameStatistics[] {
    const featureMap: { [name: string]: FeatureNameStatistics } = {};
    for (const dataset of data.getDatasetsList()) {
      for (const feature of dataset.getFeaturesList()) {
        featureMap[feature.getName()] = feature;
      }
    }
    return Object.keys(featureMap).map((name) => featureMap[name]);
  }

  public getEntries(
    stats: FeatureNameStatistics,
    showWeighted: boolean,
    hasCustom: boolean
  ): utils.CssFormattedString[] {
    return utils.getStatsEntries(stats, showWeighted, hasCustom);
  }
}
