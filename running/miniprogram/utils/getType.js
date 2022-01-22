const TypeList = [
  "Number",
  "String",
  "Undefined",
  "Null",
  "Boolean",
  "Symbol",
  "Array",
  "RegExp",
  "Date",
  "Function",
  "Object",
];

const getType = {};

TypeList.forEach((type) => {
  getType[`is${type}`] = (data) => {
    return Object.prototype.toString.call(data) === `[object ${type}]`;
  };
});

export default getType
