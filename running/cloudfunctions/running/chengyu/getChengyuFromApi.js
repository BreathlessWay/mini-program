const superagent = require("superagent"),
  lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { chengyuMapDbName, successStatus } = require("@/constants");

const getChengyuFromApi = async (cloud) => {
  const chengyuDb = cloud.database().collection(chengyuMapDbName),
    log = cloud.logger(),
    chengyuResult = await chengyuDb
      .aggregate()
      .sample({
        size: 1,
      })
      .end(),
    chengyuInfo = lget(chengyuResult, "list.0");

  if (chengyuInfo.hasOwnProperty("chuchu")) {
    return {
      errMsg: "",
      status: successStatus,
      data: chengyuInfo,
    };
  }

  let content = "",
    errMsg = "";
  try {
    const res = await superagent.get("http://apis.juhe.cn/idioms/query").query({
      wd: chengyuInfo.name,
      key: "c08453bddf96e28063990f66c7f5ca6e",
    });

    content = res.body.result;
    if (!res.body.result) {
      throw res.body.reason;
    }
  } catch (error) {
    log.error({
      name: `成语接口调用失败`,
      error,
    });
    errMsg = error.message || "成语接口调用失败";
  }

  if (content) {
    await chengyuDb.doc(chengyuInfo._id).update({
      data: content,
    });

    return {
      errMsg,
      status: successStatus,
      data: {
        _id: chengyuInfo._id,
        ...content,
      },
    };
  }

  throw errMsg;
};

module.exports = tryCatchWrap(getChengyuFromApi, "获取成语接口失败");
