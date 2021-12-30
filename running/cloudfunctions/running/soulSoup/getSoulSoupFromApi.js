const superagent = require("superagent"),
  lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { soulSoupDbName, successStatus } = require("@/constants");

const getSoulSoupFromApi = async (cloud) => {
  const soulSoupDb = cloud.database().collection(soulSoupDbName),
    log = cloud.logger();

  let content = "",
    errMsg = "";
  try {
    const res = await superagent.get(
      "http://api.52hyjs.com/api/yulu?code=json"
    );

    content = res.body.msg;
    if (!content) {
      throw new Error("接口不存在");
    }
  } catch (error) {
    log.error({
      name: `语录接口调用失败`,
      error,
    });
    errMsg = error.message || "语录接口调用失败";
  }

  if (content) {
    const soulSoupDbData = await soulSoupDb
      .where({
        content,
      })
      .get();

    if (soulSoupDbData && soulSoupDbData.data.length) {
      return {
        errMsg,
        status: successStatus,
        data: lget(soulSoupDbData, "data.0"),
      };
    }

    const addResult = await soulSoupDb.add({
      data: {
        content,
      },
    });

    return {
      errMsg,
      status: successStatus,
      data: {
        _id: addResult._id,
        content,
      },
    };
  }

  const soulData = await soulSoupDb
    .aggregate()
    .sample({
      size: 1,
    })
    .end();

  return {
    errMsg,
    status: successStatus,
    data: lget(soulData, "list.0"),
  };
};

module.exports = tryCatchWrap(getSoulSoupFromApi, "获取语录接口失败");
