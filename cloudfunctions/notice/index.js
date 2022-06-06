// 云函数入口文件
const cloud = require('wx-server-sdk'),
  lget = require("lodash").get,
  dayjs = require("dayjs"),
  subscribre = require('./subscribe')

cloud.init()

const time = 24 * 60 * 60 * 1000;

// 云函数入口函数
exports.main = async () => {
  try {
    const db = cloud.database(),
      _ = db.command,
      userMapDb = db.collection('user_map'),
      userResult = await userMapDb
      .where({
        shouldNotice: true,
      }).field({
        lastHeSuanTime: true,
        expiration: true,
        user_id: true,
      })
      .get();

    console.log(userResult)

    if (userResult.data.length) {
      const userIds = []
      userResult.data.forEach(item => {
        const {
          lastHeSuanTime,
          expiration,
          user_id
        } = item
        if (lastHeSuanTime && expiration) {
          const lastTime = dayjs(lastHeSuanTime).add(expiration, 'hour'),
            between = (dayjs().valueOf() - lastTime.valueOf()) < time;

          if (between) {
            userIds.push(user_id)
            subscribre(user_id, cloud, lastTime.format('MM月DD日 HH时'))
          };
        }
      })

      await userMapDb.where({
        user_id: _.in(userIds)
      }).update({
        data: {
          shouldNotice: false
        },
      });
    }
  } catch (err) {
    console.log(err)
  }
}