const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  {
    userMapDbName,
    successStatus
  } = require("@/constants");

const user = async (cloud, event) => {
  const {
    OPENID
  } = cloud.getWXContext(),
    db = cloud.database(),
    _ = db.command,
    userMapDb = db.collection(userMapDbName),
    userResult = await userMapDb
    .where({
      user_id: OPENID,
    })
    .get(),
    userInfo = lget(userResult, "data.0");
  let data = {
    avatarUrl: "",
    nickName: "",
    gender: 0, // 0-未知 1-男 2-女
    city: "",
    country: "",
    language: "zh_CN",
    province: "",
    lastHeSuanTime: null,
    expiration: 72
  };
  // 第一次验证是否登陆过
  if (!userInfo && !event.user) {
    return {
      errMsg: "",
      status: successStatus,
      data: null,
    };
  }
  // get
  if (userInfo && !event.user) {
    return {
      errMsg: "",
      status: successStatus,
      data: userInfo,
    };
  }

  // event.userInfo 尽然在服务器上有值 fuck
  // put
  if (userInfo) {
    await userMapDb.doc(userInfo._id).update({
      data: {
        ...event.user
      },
    });
    data = {
      ...userInfo,
      ...event.user
    };
  } else {
    // post
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
    data.user_id = OPENID;
  }

  return {
    errMsg: "",
    status: successStatus,
    data,
  };
};

module.exports = tryCatchWrap(user, "用户信息设置失败");