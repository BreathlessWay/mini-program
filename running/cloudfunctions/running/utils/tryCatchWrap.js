const lget = require("lodash").get,
  { otherStatus } = require("@/constants");

const tryCatchWrap = (fun, errMsg) => {
  return async (cloud, ...args) => {
    const log = cloud.logger();
    log.info({
      name: `${fun.name} 调用`,
      params: args,
    });
    try {
      return await fun.apply(this, [cloud, ...args]);
    } catch (error) {
      log.error({
        name: `${fun.name} 调用失败`,
        params: args,
        error,
      });
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
