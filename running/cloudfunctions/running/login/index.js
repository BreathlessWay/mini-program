const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { userMapDbName, successStatus } = require("@/constants");

const login = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    _ = db.command,
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

  if (!userInfo && !event.user) {
    return {
      errMsg: "",
      status: successStatus,
      data: null
    };
  }
  // event.userInfo 尽然在服务器上有值 fuck
  if (userInfo) {
    if (!event.user) {
      for (let p in data) {
        data[p] = userInfo[p];
      }
    } else {
      for (let p in data) {
        data[p] = event.user[p];
      }
      await userMapDb.doc(userInfo._id).update({
        data,
      });

      data._id = userInfo._id;
    }
  } else {
    for (let p in data) {
      if (event.user.hasOwnProperty(p)) {
        data[p] = event.user[p];
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
