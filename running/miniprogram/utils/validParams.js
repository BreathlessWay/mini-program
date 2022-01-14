const getType = require("./getType");

exports.validStringParams = (params) => {
  return params && getType.isString(params) && params.trim();
};

exports.validFunctionParams = (params) => {
  return params && getType.isFunction(params);
};

exports.validArrayParams = (params) => {
  return params && getType.isArray(params) && params.length > 0;
};

exports.validObjectParams = (params) => {
  return params && getType.isObject(params) && Object.keys(params).length > 0;
};

exports.validObjectInstanceType = (params) => {
  return (
    params && Object.prototype.toString.call(params) === `[object ${type}]`
  );
};

exports.validRegExpParams = (params) => {
  return params && getType.isRegExp(params);
};

exports.validNumberParams = (params) => {
  return getType.isNumber(params) && !isNaN(params) && isFinite(params);
};
