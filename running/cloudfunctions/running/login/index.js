const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { userMapDbName, successStatus } = require("@/constants");

const login = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    userMapDb = db.collection(userMapDbName),
    userResult = await userMapDb
      .where({
        user_id: OPENID,
      })
      .get(),
    userInfo = lget(userResult, "data.0"),
    data = {
      avatarUrl: "",
      nickName: "",
      gender: 0, // 0-未知 1-男 2-女
      setting: [1, 1, 1, 1],
    };

  if (!userInfo && !event.userInfo) {
    throw "暂无用户信息";
  }

  if (userInfo) {
    if (!event.userInfo) {
      for (let p in data) {
        data[p] = userInfo[p];
      }
    } else {
      for (let p in data) {
        data[p] = event.userInfo[p];
      }
      await userMapDb.doc(userInfo._id).update({
        data,
      });

      data._id = userInfo._id;
    }
  } else {
    for (let p in data) {
      if (event.userInfo.hasOwnProperty(p)) {
        data[p] = event.userInfo[p];
      }
    }
    const res = await userMapDb.add({
      data: {
        user_id: OPENID,
        ...data,
      },
    });
    data._id = res._id;
  }

  return {
    errMsg: "",
    status: successStatus,
    data,
  };
};

module.exports = tryCatchWrap(login, "登录失败");
