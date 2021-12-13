// 云函数入口文件
const cloud = require("wx-server-sdk");
const superagent = require("superagent");
const cheerio = require("cheerio");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  const result = [];

  try {
    const res = await superagent.get(
      "https://datachart.500.com/ssq/history/newinc/history.php?limit=100&sort=0"
    );
    const $ = cheerio.load(res.text);

    $("tbody#tdata tr.t_tr1").each((index, item) => {
      const _data = {
        issue: null,
        red: [],
        blue: null,
        date: null,
        type: 'ssq'
      };
      $(item)
        .children("td")
        .each((i, _) => {
          if (i === 0) {
            _data.issue = $(_).text();
          }
          if (i > 0 && i < 7) {
            _data.red.push($(_).text());
          }
          if (i === 7) {
            _data.blue = $(_).text();
          }
          if (i === 15) {
            _data.date = $(_).text();
          }
        });
      result.push(_data);
    });
  } catch (err) {
    console.error(err);
  }

  const wxContext = cloud.getWXContext();
  const res = await db.collection("book").get();

  process.env.TZ = "Asia/Shanghai";

  await db
    .collection("ssq")
    .where({
      type: 'ssq'
    })
    .remove();
  console.log(await db.collection("ssq").count());
  await db.collection("ssq").add({
    data: result,
  });
  console.log(await db.collection("ssq").count());

  console.log({ event }, wxContext, res, __dirname);
  const log = cloud.logger();
  log.info({
    name: "fuck",
  });

  return {
    sum: event.a + event.b,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};
