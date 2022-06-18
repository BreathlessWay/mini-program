// 云函数入口文件
const cloud = require('wx-server-sdk'),
  dayjs = require("dayjs"),
  subscribre = require('./subscribe')

process.env.TZ = "Asia/Shanghai";

cloud.init()

const time = 24 * 60 * 60 * 1000;

// 云函数入口函数
exports.main = async () => {
  const log = cloud.logger();
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
            lastTimestape = lastTime.valueOf(),
            nowTimeStape = dayjs().valueOf(),
            between = lastTimestape < nowTimeStape || ((lastTimestape - nowTimeStape) < time);

          if (between) {
            userIds.push(user_id)
            subscribre(user_id, cloud, lastTime.format('YYYY年MM月DD日'))
          };
        }
      })
      const now = dayjs().format('YYYY-MM-DD HH:mm');
      await userMapDb.where({
        user_id: _.in(userIds)
      }).update({
        data: {
          shouldNotice: false,
          lastNoticeTime: now
        },
      });
    }
  } catch (err) {
    console.log(err);
    log.error({
      name: `更新订阅状态失败`,
      error: err
    });
  }
}