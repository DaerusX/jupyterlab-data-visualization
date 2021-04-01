// package: featureStatistics
// file: feature_statistics.proto

import * as jspb from "google-protobuf";

export class DatasetFeatureStatisticsList extends jspb.Message {
  clearDatasetsList(): void;
  getDatasetsList(): Array<DatasetFeatureStatistics>;
  setDatasetsList(value: Array<DatasetFeatureStatistics>): void;
  addDatasets(value?: DatasetFeatureStatistics, index?: number): DatasetFeatureStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DatasetFeatureStatisticsList.AsObject;
  static toObject(includeInstance: boolean, msg: DatasetFeatureStatisticsList): DatasetFeatureStatisticsList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DatasetFeatureStatisticsList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DatasetFeatureStatisticsList;
  static deserializeBinaryFromReader(message: DatasetFeatureStatisticsList, reader: jspb.BinaryReader): DatasetFeatureStatisticsList;
}

export namespace DatasetFeatureStatisticsList {
  export type AsObject = {
    datasetsList: Array<DatasetFeatureStatistics.AsObject>,
  }
}

export class Path extends jspb.Message {
  clearStepList(): void;
  getStepList(): Array<string>;
  setStepList(value: Array<string>): void;
  addStep(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Path.AsObject;
  static toObject(includeInstance: boolean, msg: Path): Path.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Path, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Path;
  static deserializeBinaryFromReader(message: Path, reader: jspb.BinaryReader): Path;
}

export namespace Path {
  export type AsObject = {
    stepList: Array<string>,
  }
}

export class DatasetFeatureStatistics extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getNumExamples(): number;
  setNumExamples(value: number): void;

  getWeightedNumExamples(): number;
  setWeightedNumExamples(value: number): void;

  clearFeaturesList(): void;
  getFeaturesList(): Array<FeatureNameStatistics>;
  setFeaturesList(value: Array<FeatureNameStatistics>): void;
  addFeatures(value?: FeatureNameStatistics, index?: number): FeatureNameStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DatasetFeatureStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: DatasetFeatureStatistics): DatasetFeatureStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DatasetFeatureStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DatasetFeatureStatistics;
  static deserializeBinaryFromReader(message: DatasetFeatureStatistics, reader: jspb.BinaryReader): DatasetFeatureStatistics;
}

export namespace DatasetFeatureStatistics {
  export type AsObject = {
    name: string,
    numExamples: number,
    weightedNumExamples: number,
    featuresList: Array<FeatureNameStatistics.AsObject>,
  }
}

export class FeatureNameStatistics extends jspb.Message {
  hasName(): boolean;
  clearName(): void;
  getName(): string;
  setName(value: string): void;

  hasPath(): boolean;
  clearPath(): void;
  getPath(): Path | undefined;
  setPath(value?: Path): void;

  getType(): FeatureNameStatistics.TypeMap[keyof FeatureNameStatistics.TypeMap];
  setType(value: FeatureNameStatistics.TypeMap[keyof FeatureNameStatistics.TypeMap]): void;

  hasNumStats(): boolean;
  clearNumStats(): void;
  getNumStats(): NumericStatistics | undefined;
  setNumStats(value?: NumericStatistics): void;

  hasStringStats(): boolean;
  clearStringStats(): void;
  getStringStats(): StringStatistics | undefined;
  setStringStats(value?: StringStatistics): void;

  hasBytesStats(): boolean;
  clearBytesStats(): void;
  getBytesStats(): BytesStatistics | undefined;
  setBytesStats(value?: BytesStatistics): void;

  hasStructStats(): boolean;
  clearStructStats(): void;
  getStructStats(): StructStatistics | undefined;
  setStructStats(value?: StructStatistics): void;

  clearCustomStatsList(): void;
  getCustomStatsList(): Array<CustomStatistic>;
  setCustomStatsList(value: Array<CustomStatistic>): void;
  addCustomStats(value?: CustomStatistic, index?: number): CustomStatistic;

  getFieldIdCase(): FeatureNameStatistics.FieldIdCase;
  getStatsCase(): FeatureNameStatistics.StatsCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeatureNameStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: FeatureNameStatistics): FeatureNameStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FeatureNameStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeatureNameStatistics;
  static deserializeBinaryFromReader(message: FeatureNameStatistics, reader: jspb.BinaryReader): FeatureNameStatistics;
}

export namespace FeatureNameStatistics {
  export type AsObject = {
    name: string,
    path?: Path.AsObject,
    type: FeatureNameStatistics.TypeMap[keyof FeatureNameStatistics.TypeMap],
    numStats?: NumericStatistics.AsObject,
    stringStats?: StringStatistics.AsObject,
    bytesStats?: BytesStatistics.AsObject,
    structStats?: StructStatistics.AsObject,
    customStatsList: Array<CustomStatistic.AsObject>,
  }

  export interface TypeMap {
    INT: 0;
    FLOAT: 1;
    STRING: 2;
    BYTES: 3;
    STRUCT: 4;
  }

  export const Type: TypeMap;

  export enum FieldIdCase {
    FIELD_ID_NOT_SET = 0,
    NAME = 1,
    PATH = 8,
  }

  export enum StatsCase {
    STATS_NOT_SET = 0,
    NUM_STATS = 3,
    STRING_STATS = 4,
    BYTES_STATS = 5,
    STRUCT_STATS = 7,
  }
}

export class WeightedCommonStatistics extends jspb.Message {
  getNumNonMissing(): number;
  setNumNonMissing(value: number): void;

  getNumMissing(): number;
  setNumMissing(value: number): void;

  getAvgNumValues(): number;
  setAvgNumValues(value: number): void;

  getTotNumValues(): number;
  setTotNumValues(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeightedCommonStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: WeightedCommonStatistics): WeightedCommonStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WeightedCommonStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeightedCommonStatistics;
  static deserializeBinaryFromReader(message: WeightedCommonStatistics, reader: jspb.BinaryReader): WeightedCommonStatistics;
}

export namespace WeightedCommonStatistics {
  export type AsObject = {
    numNonMissing: number,
    numMissing: number,
    avgNumValues: number,
    totNumValues: number,
  }
}

export class CustomStatistic extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasNum(): boolean;
  clearNum(): void;
  getNum(): number;
  setNum(value: number): void;

  hasStr(): boolean;
  clearStr(): void;
  getStr(): string;
  setStr(value: string): void;

  hasHistogram(): boolean;
  clearHistogram(): void;
  getHistogram(): Histogram | undefined;
  setHistogram(value?: Histogram): void;

  hasRankHistogram(): boolean;
  clearRankHistogram(): void;
  getRankHistogram(): RankHistogram | undefined;
  setRankHistogram(value?: RankHistogram): void;

  getValCase(): CustomStatistic.ValCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CustomStatistic.AsObject;
  static toObject(includeInstance: boolean, msg: CustomStatistic): CustomStatistic.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CustomStatistic, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CustomStatistic;
  static deserializeBinaryFromReader(message: CustomStatistic, reader: jspb.BinaryReader): CustomStatistic;
}

export namespace CustomStatistic {
  export type AsObject = {
    name: string,
    num: number,
    str: string,
    histogram?: Histogram.AsObject,
    rankHistogram?: RankHistogram.AsObject,
  }

  export enum ValCase {
    VAL_NOT_SET = 0,
    NUM = 2,
    STR = 3,
    HISTOGRAM = 4,
    RANK_HISTOGRAM = 5,
  }
}

export class NumericStatistics extends jspb.Message {
  hasCommonStats(): boolean;
  clearCommonStats(): void;
  getCommonStats(): CommonStatistics | undefined;
  setCommonStats(value?: CommonStatistics): void;

  getMean(): number;
  setMean(value: number): void;

  getStdDev(): number;
  setStdDev(value: number): void;

  getNumZeros(): number;
  setNumZeros(value: number): void;

  getMin(): number;
  setMin(value: number): void;

  getMedian(): number;
  setMedian(value: number): void;

  getMax(): number;
  setMax(value: number): void;

  clearHistogramsList(): void;
  getHistogramsList(): Array<Histogram>;
  setHistogramsList(value: Array<Histogram>): void;
  addHistograms(value?: Histogram, index?: number): Histogram;

  hasWeightedNumericStats(): boolean;
  clearWeightedNumericStats(): void;
  getWeightedNumericStats(): WeightedNumericStatistics | undefined;
  setWeightedNumericStats(value?: WeightedNumericStatistics): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NumericStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: NumericStatistics): NumericStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NumericStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NumericStatistics;
  static deserializeBinaryFromReader(message: NumericStatistics, reader: jspb.BinaryReader): NumericStatistics;
}

export namespace NumericStatistics {
  export type AsObject = {
    commonStats?: CommonStatistics.AsObject,
    mean: number,
    stdDev: number,
    numZeros: number,
    min: number,
    median: number,
    max: number,
    histogramsList: Array<Histogram.AsObject>,
    weightedNumericStats?: WeightedNumericStatistics.AsObject,
  }
}

export class StringStatistics extends jspb.Message {
  hasCommonStats(): boolean;
  clearCommonStats(): void;
  getCommonStats(): CommonStatistics | undefined;
  setCommonStats(value?: CommonStatistics): void;

  getUnique(): number;
  setUnique(value: number): void;

  clearTopValuesList(): void;
  getTopValuesList(): Array<StringStatistics.FreqAndValue>;
  setTopValuesList(value: Array<StringStatistics.FreqAndValue>): void;
  addTopValues(value?: StringStatistics.FreqAndValue, index?: number): StringStatistics.FreqAndValue;

  getAvgLength(): number;
  setAvgLength(value: number): void;

  hasRankHistogram(): boolean;
  clearRankHistogram(): void;
  getRankHistogram(): RankHistogram | undefined;
  setRankHistogram(value?: RankHistogram): void;

  hasWeightedStringStats(): boolean;
  clearWeightedStringStats(): void;
  getWeightedStringStats(): WeightedStringStatistics | undefined;
  setWeightedStringStats(value?: WeightedStringStatistics): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: StringStatistics): StringStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StringStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringStatistics;
  static deserializeBinaryFromReader(message: StringStatistics, reader: jspb.BinaryReader): StringStatistics;
}

export namespace StringStatistics {
  export type AsObject = {
    commonStats?: CommonStatistics.AsObject,
    unique: number,
    topValuesList: Array<StringStatistics.FreqAndValue.AsObject>,
    avgLength: number,
    rankHistogram?: RankHistogram.AsObject,
    weightedStringStats?: WeightedStringStatistics.AsObject,
  }

  export class FreqAndValue extends jspb.Message {
    getDeprecatedFreq(): number;
    setDeprecatedFreq(value: number): void;

    getValue(): string;
    setValue(value: string): void;

    getFrequency(): number;
    setFrequency(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FreqAndValue.AsObject;
    static toObject(includeInstance: boolean, msg: FreqAndValue): FreqAndValue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FreqAndValue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FreqAndValue;
    static deserializeBinaryFromReader(message: FreqAndValue, reader: jspb.BinaryReader): FreqAndValue;
  }

  export namespace FreqAndValue {
    export type AsObject = {
      deprecatedFreq: number,
      value: string,
      frequency: number,
    }
  }
}

export class WeightedNumericStatistics extends jspb.Message {
  getMean(): number;
  setMean(value: number): void;

  getStdDev(): number;
  setStdDev(value: number): void;

  getMedian(): number;
  setMedian(value: number): void;

  clearHistogramsList(): void;
  getHistogramsList(): Array<Histogram>;
  setHistogramsList(value: Array<Histogram>): void;
  addHistograms(value?: Histogram, index?: number): Histogram;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeightedNumericStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: WeightedNumericStatistics): WeightedNumericStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WeightedNumericStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeightedNumericStatistics;
  static deserializeBinaryFromReader(message: WeightedNumericStatistics, reader: jspb.BinaryReader): WeightedNumericStatistics;
}

export namespace WeightedNumericStatistics {
  export type AsObject = {
    mean: number,
    stdDev: number,
    median: number,
    histogramsList: Array<Histogram.AsObject>,
  }
}

export class WeightedStringStatistics extends jspb.Message {
  clearTopValuesList(): void;
  getTopValuesList(): Array<StringStatistics.FreqAndValue>;
  setTopValuesList(value: Array<StringStatistics.FreqAndValue>): void;
  addTopValues(value?: StringStatistics.FreqAndValue, index?: number): StringStatistics.FreqAndValue;

  hasRankHistogram(): boolean;
  clearRankHistogram(): void;
  getRankHistogram(): RankHistogram | undefined;
  setRankHistogram(value?: RankHistogram): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeightedStringStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: WeightedStringStatistics): WeightedStringStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WeightedStringStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeightedStringStatistics;
  static deserializeBinaryFromReader(message: WeightedStringStatistics, reader: jspb.BinaryReader): WeightedStringStatistics;
}

export namespace WeightedStringStatistics {
  export type AsObject = {
    topValuesList: Array<StringStatistics.FreqAndValue.AsObject>,
    rankHistogram?: RankHistogram.AsObject,
  }
}

export class BytesStatistics extends jspb.Message {
  hasCommonStats(): boolean;
  clearCommonStats(): void;
  getCommonStats(): CommonStatistics | undefined;
  setCommonStats(value?: CommonStatistics): void;

  getUnique(): number;
  setUnique(value: number): void;

  getAvgNumBytes(): number;
  setAvgNumBytes(value: number): void;

  getMinNumBytes(): number;
  setMinNumBytes(value: number): void;

  getMaxNumBytes(): number;
  setMaxNumBytes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BytesStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: BytesStatistics): BytesStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BytesStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BytesStatistics;
  static deserializeBinaryFromReader(message: BytesStatistics, reader: jspb.BinaryReader): BytesStatistics;
}

export namespace BytesStatistics {
  export type AsObject = {
    commonStats?: CommonStatistics.AsObject,
    unique: number,
    avgNumBytes: number,
    minNumBytes: number,
    maxNumBytes: number,
  }
}

export class StructStatistics extends jspb.Message {
  hasCommonStats(): boolean;
  clearCommonStats(): void;
  getCommonStats(): CommonStatistics | undefined;
  setCommonStats(value?: CommonStatistics): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StructStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: StructStatistics): StructStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StructStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StructStatistics;
  static deserializeBinaryFromReader(message: StructStatistics, reader: jspb.BinaryReader): StructStatistics;
}

export namespace StructStatistics {
  export type AsObject = {
    commonStats?: CommonStatistics.AsObject,
  }
}

export class CommonStatistics extends jspb.Message {
  getNumNonMissing(): number;
  setNumNonMissing(value: number): void;

  getNumMissing(): number;
  setNumMissing(value: number): void;

  getMinNumValues(): number;
  setMinNumValues(value: number): void;

  getMaxNumValues(): number;
  setMaxNumValues(value: number): void;

  getAvgNumValues(): number;
  setAvgNumValues(value: number): void;

  getTotNumValues(): number;
  setTotNumValues(value: number): void;

  hasNumValuesHistogram(): boolean;
  clearNumValuesHistogram(): void;
  getNumValuesHistogram(): Histogram | undefined;
  setNumValuesHistogram(value?: Histogram): void;

  hasWeightedCommonStats(): boolean;
  clearWeightedCommonStats(): void;
  getWeightedCommonStats(): WeightedCommonStatistics | undefined;
  setWeightedCommonStats(value?: WeightedCommonStatistics): void;

  hasFeatureListLengthHistogram(): boolean;
  clearFeatureListLengthHistogram(): void;
  getFeatureListLengthHistogram(): Histogram | undefined;
  setFeatureListLengthHistogram(value?: Histogram): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: CommonStatistics): CommonStatistics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonStatistics;
  static deserializeBinaryFromReader(message: CommonStatistics, reader: jspb.BinaryReader): CommonStatistics;
}

export namespace CommonStatistics {
  export type AsObject = {
    numNonMissing: number,
    numMissing: number,
    minNumValues: number,
    maxNumValues: number,
    avgNumValues: number,
    totNumValues: number,
    numValuesHistogram?: Histogram.AsObject,
    weightedCommonStats?: WeightedCommonStatistics.AsObject,
    featureListLengthHistogram?: Histogram.AsObject,
  }
}

export class Histogram extends jspb.Message {
  getNumNan(): number;
  setNumNan(value: number): void;

  getNumUndefined(): number;
  setNumUndefined(value: number): void;

  clearBucketsList(): void;
  getBucketsList(): Array<Histogram.Bucket>;
  setBucketsList(value: Array<Histogram.Bucket>): void;
  addBuckets(value?: Histogram.Bucket, index?: number): Histogram.Bucket;

  getType(): Histogram.HistogramTypeMap[keyof Histogram.HistogramTypeMap];
  setType(value: Histogram.HistogramTypeMap[keyof Histogram.HistogramTypeMap]): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Histogram.AsObject;
  static toObject(includeInstance: boolean, msg: Histogram): Histogram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Histogram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Histogram;
  static deserializeBinaryFromReader(message: Histogram, reader: jspb.BinaryReader): Histogram;
}

export namespace Histogram {
  export type AsObject = {
    numNan: number,
    numUndefined: number,
    bucketsList: Array<Histogram.Bucket.AsObject>,
    type: Histogram.HistogramTypeMap[keyof Histogram.HistogramTypeMap],
    name: string,
  }

  export class Bucket extends jspb.Message {
    getLowValue(): number;
    setLowValue(value: number): void;

    getHighValue(): number;
    setHighValue(value: number): void;

    getDeprecatedCount(): number;
    setDeprecatedCount(value: number): void;

    getSampleCount(): number;
    setSampleCount(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Bucket.AsObject;
    static toObject(includeInstance: boolean, msg: Bucket): Bucket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Bucket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Bucket;
    static deserializeBinaryFromReader(message: Bucket, reader: jspb.BinaryReader): Bucket;
  }

  export namespace Bucket {
    export type AsObject = {
      lowValue: number,
      highValue: number,
      deprecatedCount: number,
      sampleCount: number,
    }
  }

  export interface HistogramTypeMap {
    STANDARD: 0;
    QUANTILES: 1;
  }

  export const HistogramType: HistogramTypeMap;
}

export class RankHistogram extends jspb.Message {
  clearBucketsList(): void;
  getBucketsList(): Array<RankHistogram.Bucket>;
  setBucketsList(value: Array<RankHistogram.Bucket>): void;
  addBuckets(value?: RankHistogram.Bucket, index?: number): RankHistogram.Bucket;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RankHistogram.AsObject;
  static toObject(includeInstance: boolean, msg: RankHistogram): RankHistogram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RankHistogram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RankHistogram;
  static deserializeBinaryFromReader(message: RankHistogram, reader: jspb.BinaryReader): RankHistogram;
}

export namespace RankHistogram {
  export type AsObject = {
    bucketsList: Array<RankHistogram.Bucket.AsObject>,
    name: string,
  }

  export class Bucket extends jspb.Message {
    getLowRank(): number;
    setLowRank(value: number): void;

    getHighRank(): number;
    setHighRank(value: number): void;

    getDeprecatedCount(): number;
    setDeprecatedCount(value: number): void;

    getLabel(): string;
    setLabel(value: string): void;

    getSampleCount(): number;
    setSampleCount(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Bucket.AsObject;
    static toObject(includeInstance: boolean, msg: Bucket): Bucket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Bucket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Bucket;
    static deserializeBinaryFromReader(message: Bucket, reader: jspb.BinaryReader): Bucket;
  }

  export namespace Bucket {
    export type AsObject = {
      lowRank: number,
      highRank: number,
      deprecatedCount: number,
      label: string,
      sampleCount: number,
    }
  }
}

