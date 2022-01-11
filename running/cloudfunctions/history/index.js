// 云函数入口文件
process.env.TZ = "Asia/Shanghai";

const cloud = require("wx-server-sdk"),
  dayjs = require("dayjs"),
  lget = require("lodash").get,
  superagent = require("superagent"),
  url = "http://v.juhe.cn/todayOnhistory/queryEvent.php",
  query = {
    key: "08677a792260be9cb7c384a2bed6ea9b",
    date: "",
  };

cloud.init({
  env: "running-0g66zunfb34db76a",
});

const db = cloud.database(),
  commonMapCollection = db.collection("common_map");

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const date = new Date(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      result = await superagent.get(url).query({
        ...query,
        date: `${month}/${day}`,
      }),
      historyList = lget(result, "body.result") || [],
      commonData = await commonMapCollection.get(),
      _id = lget(commonData, "data.0._id");

    if (historyList.length) {
      await commonMapCollection.doc(_id).update({
        data: {
          history: historyList,
        },
      });
      return {
        errMsg: "",
        status: 0,
        data: historyList,
      };
    }
    throw result;
  } catch (error) {
    return {
      data: null,
      status:
        lget(error, "response.body.error_code") ||
        error.errCode ||
        error.status ||
        600,
      errMsg:
        `更新历史上的今天失败：` +
        (lget(error, "response.body.reason") ||
          error.errMsg ||
          error.message ||
          ""),
    };
  }
};
