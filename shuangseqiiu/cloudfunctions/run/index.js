// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const result = await cloud.openapi.cloudbase.getOpenData({
      openid: wxContext.OPENID,
      cloudidList: [event.cloudID],
    })
    console.log(result)
    return JSON.parse(result.dataList[0].json).data.stepInfoList;
  } catch (err) {
    console.error(err)
    return err;
  }
};
