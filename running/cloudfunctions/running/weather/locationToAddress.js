// 云函数入口文件
const superagent = require("superagent"),
  crypto = require("crypto"),
  lget = require("lodash").get,
  { mapKey, mapSig, otherStatus } = require("../constants");

// 云函数入口函数
module.exports = async (cloud, { latitude, longitude }) => {
  try {
    // 每次都要重新创建 md5
    const sign = crypto
      .createHash("md5")
      .update(
        `/ws/geocoder/v1?key=${mapKey}&location=${latitude},${longitude}${mapSig}`
      )
      .digest("hex");

    const res = await superagent.get(
      `https://apis.map.qq.com/ws/geocoder/v1?key=${mapKey}&location=${latitude},${longitude}&sig=${sign}`
    );

    // 状态码，0为正常，其它为异常，
    if (
      res.body.status === successStatus &&
      res.body.result &&
      lget(res, "body.ad_info.city")
    ) {
      return {
        errMsg: "",
        status: res.body.status,
        data: res.body.result,
      };
    }

    throw res.body;
  } catch (err) {
    throw {
      errMsg: err.message || "根据经纬度获取地址失败",
      status: err.status || otherStatus,
      data: null,
    };
  }
};
