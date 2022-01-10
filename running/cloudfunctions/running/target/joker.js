const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { jokerMapDbName, successStatus } = require("@/constants");

const getJokerApi = async (cloud) => {
  const db = cloud.database(),
    jokerMapDb = db.collection(jokerMapDbName);

  const jokerData = await jokerMapDb
    .aggregate()
    .sample({
      size: 1,
    })
    .end();

  return {
    errMsg: "",
    status: successStatus,
    data: lget(jokerData, "list.0.content"),
  };
};

module.exports = tryCatchWrap(getJokerApi, '获取笑话失败');
