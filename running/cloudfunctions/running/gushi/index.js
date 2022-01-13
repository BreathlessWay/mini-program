const lget = require("lodash").get,
  dayjs = require("dayjs"),
  superagent = require("superagent"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { userMapDbName, successStatus } = require("@/constants");

const getGushiData = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    userMapDb = db.collection(userMapDbName),
    userResult = await userMapDb
      .where({
        user_id: OPENID,
      })
      .get(),
    userInfo = lget(userResult, "data.0");

  if (!userInfo) {
    throw "请先登录！";
  }

  const { expire, ...rest } = userInfo.gushi || {},
    now = dayjs().toDate();

  if (expire && expire >= now) {
    return {
      errMsg: "",
      status: successStatus,
      data: rest,
    };
  }

  const gushiData = await superagent.get("https://v1.jinrishici.com/all.json");

  await userMapDb.doc(userInfo._id).update({
    data: {
      gushi: {
        ...gushiData.body,
        expire: dayjs().endOf("day").toDate(),
      },
    },
  });

  return {
    errMsg: "",
    status: successStatus,
    data: gushiData.body,
  };
};

module.exports = tryCatchWrap(getGushiData, "获取古诗词失败");
