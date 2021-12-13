// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await cloud.cloudPay.unifiedOrder({
      envId: "personal-22c51c",

      subMchId: "",

      body: "商品名",

      totalFee: 100,

      outTradeNo: "订单号",

      spbillCreateIp: "127.0.0.1",

      functionName: "pay-callback",
    });

    console.log(res);
  } catch (e) {}

  return {};
};
