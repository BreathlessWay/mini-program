import getType from './getType'

export const validStringParams = (params) => {
  return params && getType.isString(params) && params.trim();
};

export const validFunctionParams = (params) => {
  return params && getType.isFunction(params);
};

export const validArrayParams = (params) => {
  return params && getType.isArray(params) && params.length > 0;
};

export const validObjectParams = (params) => {
  return params && getType.isObject(params) && Object.keys(params).length > 0;
};

export const validObjectInstanceType = (params) => {
  return (
    params && Object.prototype.toString.call(params) === `[object ${type}]`
  );
};

export const validRegExpParams = (params) => {
  return params && getType.isRegExp(params);
};

export const validNumberParams = (params) => {
  return getType.isNumber(params) && !isNaN(params) && isFinite(params);
};
