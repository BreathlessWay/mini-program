const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { successStatus, commonMapDbName } = require("@/constants");

const getHistory = async (cloud, event) => {
  const db = cloud.database(),
    commonCollection = db.collection(commonMapDbName),
    commonResult = await commonCollection.get(),
    historyList = lget(commonResult, "data.0.history"),
    historyLength = historyList.length,
    size = event.size || 5;

  let result = [];

  if (historyLength <= size) {
    result = historyLength;
  } else {
    const index = Math.floor(Math.random() * (historyLength - size));
    result = historyList.splice(index, size);
  }

  return {
    errMsg: "",
    status: successStatus,
    data: result,
  };
};

module.exports = tryCatchWrap(getHistory, "获取历史上的今天失败");
