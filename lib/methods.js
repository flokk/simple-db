exports.read = [
  "head",
  "get",
  "buckets",
  "count",
  "keys",
  "exists",
  "getAll",
  "remove"
];

exports.write = [
  "post",
  "put"
];

exports._alias = {
  getAll: "all"
};