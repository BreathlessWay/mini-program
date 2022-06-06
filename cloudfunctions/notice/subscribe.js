const subscribre = async (OPENID, cloud, date) => {
  const log = cloud.logger();

  try {
    await cloud.openapi.subscribeMessage.send({
      "touser": OPENID,
      "page": 'pages/index/index',
      "templateId": '1AJpNVMAJEYqa9pm3laXCokhJzoev-HiMDXjE6rSSTs',
      "miniprogramState": 'formal',
      "lang": 'zh_CN',
      "data": {
        "thing1": {
          "value": '核酸到期提醒小贴士'
        },
        "date2": {
          "value": date
        },
        "thing3": {
          "value": '⚠️：核酸还有不到24小时就要到期啦！'
        }
      }
    })
  } catch (error) {
    console.log(error);
    log.error({
      name: `订阅消息推送失败`,
      error: err
    });
  }
}

module.exports = subscribre;