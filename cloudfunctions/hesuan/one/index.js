const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  getOneData = require("@/one/getOneData"),
  {
    successStatus,
    commonMapDbName
  } = require("@/constants");

const getOne = async (cloud) => {
  const commonMapCollection = cloud.database().collection(commonMapDbName),
    commonResult = await commonMapCollection.get(),
    oneResult = lget(commonResult, "data.0");

  const {
    date,
  } = oneResult || {},
    now = dayjs().valueOf();

  if (date && date >= now) {
    return {
      errMsg: "",
      status: successStatus,
      data: oneResult,
    };
  }

  return await getOneData(cloud);
};

module.exports = tryCatchWrap(getOne, "获取one失败");