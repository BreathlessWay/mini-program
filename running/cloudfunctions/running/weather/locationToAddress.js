// 云函数入口文件
const superagent = require("superagent"),
  crypto = require("crypto"),
  lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { mapKey, mapSig, successStatus } = require("../constants");

// 云函数入口函数
const locationToAddress = async (cloud, { latitude, longitude }) => {
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
    lget(res, "body.result.ad_info.city")
  ) {
    return {
      errMsg: "",
      status: res.body.status,
      data: res.body.result,
    };
  }

  throw res.body;
};

module.exports = tryCatchWrap(locationToAddress, "根据经纬度获取城市失败");
