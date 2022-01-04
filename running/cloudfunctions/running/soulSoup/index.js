const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  getSoulSoupFromApi = require("@/soulSoup/getSoulSoupFromApi"),
  { successStatus, userMapDbName } = require("@/constants");

const getSoulSoup = async (cloud) => {
  const { OPENID } = cloud.getWXContext(),
    userMapDb = await cloud.database(),
    _ = userMapDb.command,
    userMapCollection = userMapDb.collection(userMapDbName),
    userInfo = await userMapCollection
      .where({
        user_id: OPENID,
      })
      .get();

  const { expire, ...rest } = lget(userInfo, "data.0.soup") || {},
    now = dayjs().toDate();

  if (expire && expire >= now) {
    return {
      errMsg: "",
      status: successStatus,
      data: rest,
    };
  }

  const soulSoupData = await getSoulSoupFromApi(cloud);

  await userMapCollection.doc(lget(userInfo, "data.0._id")).update({
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
