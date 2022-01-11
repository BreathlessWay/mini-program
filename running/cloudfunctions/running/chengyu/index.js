const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  getChengyuFromApi = require("@/chengyu/getChengyuFromApi"),
  { successStatus, userMapDbName } = require("@/constants");

const getChengyu = async (cloud) => {
  const { OPENID } = cloud.getWXContext(),
    userMapCollection = cloud.database().collection(userMapDbName),
    userResult = await userMapCollection
      .where({
        user_id: OPENID,
      })
      .get(),
    userInfo = lget(userResult, "data.0");

  if (!userInfo) {
    throw "请先登录！";
  }

  const { expire, ...rest } = userInfo.chengyu || {},
    now = dayjs().toDate();

  if (expire && expire >= now) {
    return {
      errMsg: "",
      status: successStatus,
      data: rest,
    };
  }

  const chengyuData = await getChengyuFromApi(cloud);

  await userMapCollection.doc(userInfo._id).update({
    data: {
      chengyu: {
        ...chengyuData.data,
        expire: dayjs().endOf("day").toDate(),
      },
    },
  });

  return {
    errMsg: "",
    status: successStatus,
    data: chengyuData.data,
  };
};

module.exports = tryCatchWrap(getChengyu, "获取成语失败");
