const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { successStatus, commonMapDbName } = require("@/constants");

const getNews = async (cloud) => {
  const db = cloud.database(),
    commonCollection = db.collection(commonMapDbName),
    commonResult = await commonCollection.get(),
    newsList = lget(commonResult, "data.0.news");

  return {
    errMsg: "",
    status: successStatus,
    data: newsList,
  };
};

module.exports = tryCatchWrap(getNews, "获取新闻失败");
