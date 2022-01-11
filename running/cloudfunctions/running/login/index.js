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
      city: "",
      country: "",
      gender: 0,
      language: "",
      nickName: "",
      province: "",
      _id: "",
    };

  // userInfo !event.userInfo

  // userInfo  event.userInfo

  // !userInfo  event.userInfo

  if (userInfo) {
    if (!event.userInfo) {
      for (let p in data) {
        data[p] = userInfo[p];
      }
    } else {
      await userMapDb.doc(userInfo._id).update({
        data: {
          ...event.userInfo,
        },
      });
      for (let p in data) {
        data[p] = event.userInfo[p];
      }
      data._id = userInfo._id;
    }
  } else {
    const res = await userMapDb.add({
      data: {
        user_id: OPENID,
        ...event.userInfo,
      },
    });
    for (let p in data) {
      data[p] = event.userInfo[p];
    }
    data._id = res._id;
  }

  return {
    errMsg: "",
    status: successStatus,
    data,
  };
};

module.exports = tryCatchWrap(login, "登录失败");
