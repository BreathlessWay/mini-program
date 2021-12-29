const lget = require("lodash").get,
  { otherStatus } = require("@/constants");

const tryCatchWrap = (fun, errMsg) => {
  return async (...args) => {
    try {
      return await fun.apply(this, args);
    } catch (error) {
      throw {
        data: null,
        status: error.errCode || error.status || otherStatus,
        errMsg:
          `${fun.name} 调用失败 ` +
          (lget(error, "response.body.status") ||
            error.errMsg ||
            error.message ||
            errMsg),
      };
    }
  };
};

module.exports = tryCatchWrap;
