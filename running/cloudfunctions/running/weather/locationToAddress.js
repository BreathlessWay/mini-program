// 云函数入口文件
const superagent = require("superagent"),
  crypto = require("crypto"),
  { mapKey, mapSig, otherStatus } = require("../constants");

// 云函数入口函数
module.exports = async (cloud, { latitude, longitude }) => {
  const result = {
    errMsg: "",
    status: 0,
    data: null,
  };

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

    const status = res.body.status;
    result.errMsg = status ? res.body.message : "";
    result.status = status;
    result.data = res.body.result;
  } catch (err) {
    result.errMsg = err.message || "根据经纬度获取地址失败";
    result.status = otherStatus;
  }

  return result;
};
