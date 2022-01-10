const lget = require("lodash").get,
  dayjs = require("dayjs"),
  superagent = require("superagent"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { successStatus, commonMapDbName } = require("@/constants"),
  url = "http://v.juhe.cn/toutiao/index",
  query = {
    type: "top",
    page: 1,
    page_size: 10,
    is_filter: 1,
    key: "a1e4e09a525e2ab7198e8ad603daf2d1",
  };

const getNews = async (cloud) => {
  const db = cloud.database(),
    commonCollection = db.collection(commonMapDbName),
    log = cloud.logger();

  let newsList = [];
  try {
    const res = await superagent.get(url).query(query);
    newsList = lget(res, "body.result.data") || [];
    if (!newsList.length) {
      throw lget(res.body.reason) || "获取新闻接口调用失败";
    }
  } catch (error) {
    log.error({
      name: `获取新闻接口调用失败`,
      error,
    });
  }

  return {
    errMsg: "",
    status: successStatus,
    data: null,
  };
};

module.exports = tryCatchWrap(getNews, "获取新闻失败");
