// 云函数入口文件
process.env.TZ = "Asia/Shanghai";

const cloud = require("wx-server-sdk"),
  lget = require("lodash").get,
  superagent = require("superagent"),
  url = "http://v.juhe.cn/toutiao/index",
  query = {
    type: "top",
    page: 1,
    page_size: 10,
    is_filter: 1,
    key: "a1e4e09a525e2ab7198e8ad603daf2d1",
  };

cloud.init({
  env: "running-0g66zunfb34db76a",
});

const db = cloud.database(),
  commonMapCollection = db.collection("common_map");

// 云函数入口函数
exports.main = async () => {
  try {
    const res = await superagent.get(url).query(query),
      newsList = lget(res, "body.result.data") || [],
      commonResult = await commonMapCollection.get(),
      _id = lget(commonResult, "data.0._id");

    if (newsList.length) {
      await commonMapCollection.doc(_id).update({
        data: {
          news: newsList,
        },
      });

      return {
        errMsg: "",
        status: 0,
        data: newsList,
      };
    }
    throw res;
  } catch (error) {
    return {
      data: null,
      status:
        lget(error, "response.body.error_code") ||
        error.errCode ||
        error.status ||
        600,
      errMsg:
        `更新新闻失败：` +
        (lget(error, "response.body.reason") ||
          error.errMsg ||
          error.message ||
          ""),
    };
  }
};
