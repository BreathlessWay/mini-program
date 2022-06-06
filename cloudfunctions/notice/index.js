// 云函数入口文件
const cloud = require('wx-server-sdk'),
  lget = require("lodash").get,
  dayjs = require("dayjs");

cloud.init()

const time = 24 * 60 * 60 * 1000;

// 云函数入口函数
exports.main = async () => {
  const log = cloud.logger();
  try {
    const {
      OPENID
    } = cloud.getWXContext(),
      db = cloud.database(),
      userMapDb = db.collection('user_map'),
      userResult = await userMapDb
      .where({
        user_id: OPENID,
      })
      .get(),
      userInfo = lget(userResult, "data.0");

    if (userInfo) {
      const {
        shouldNotice,
        lastHeSuanTime,
        expiration
      } = userInfo;

      if (lastHeSuanTime && expiration && shouldNotice) {

        const lastTime = dayjs(lastHeSuanTime).add(expiration, 'hour'),
          between = (dayjs().valueOf() - lastTime.valueOf()) < time;

        if (!between) return;

        await userMapDb.doc(userInfo._id).update({
          data: {
            shouldNotice: false
          },
        });

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
              "value": lastTime.format('YYYY年MM月DD日')
            },
            "thing3": {
              "value": '⚠️：核酸还有不到24小时就要到期啦！'
            }
          }
        })
      }
    } else {
      log.error({
        name: `订阅消息推送失败`,
        error: `用户 ${OPENID} 尚未注册`
      });
    }
  } catch (err) {
    console.log(err)
    log.error({
      name: `订阅消息推送失败`,
      error: err
    });
  }
}