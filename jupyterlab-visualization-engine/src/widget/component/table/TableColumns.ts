export const BaseColumns = [
  {
    title: "feature",
    key: "feature",
  },
  {
    title: "dataset",
    key: "dataset",
  },
];

export const CommonColumns = [
  { title: "count", key: "numNonMissing" },
  { title: "missing", key: "numMissing" },
];

export const NumericColumns = [
  { title: "mean", key: "mean" },
  { title: "std dev", key: "stdDev" },
  { title: "zeros", key: "numZeros" },
  { title: "min", key: "min" },
  { title: "median", key: "median" },
  { title: "max", key: "max" },
];

export const StringColumns = [
  { title: "unique", key: "unique" },
  { title: "top", key: "topValue" },
  { title: "top frequency", key: "frequency" },
  { title: "avg str length", key: "avgLength" },
];

export const ChartColumns = [{ title: "chart", key: "chart" }];
