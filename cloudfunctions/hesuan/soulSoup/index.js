const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  getSoulSoupFromApi = require("@/soulSoup/getSoulSoupFromApi"),
  { successStatus, userMapDbName } = require("@/constants");

const getSoulSoup = async (cloud) => {
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

  const { expire, ...rest } = userInfo.soup || {},
    now = dayjs().toDate();

  if (expire && expire >= now) {
    return {
      errMsg: "",
      status: successStatus,
      data: rest,
    };
  }

  const soulSoupData = await getSoulSoupFromApi(cloud);

  await userMapCollection.doc(userInfo._id).update({
    data: {
      soup: {
        ...soulSoupData.data,
        expire: dayjs().endOf("day").toDate(),
      },
    },
  });

  return {
    errMsg: "",
    status: successStatus,
    data: {
      ...soulSoupData.data,
    },
  };
};

module.exports = tryCatchWrap(getSoulSoup, "获取语录失败");
