// 云函数入口文件
process.env.TZ = "Asia/Shanghai";

const cloud = require("wx-server-sdk"),
  dayjs = require("dayjs"),
  lget = require("lodash").get,
  superagent = require("superagent"),
  url = "http://apis.juhe.cn/fapig/calendar/day.php",
  query = {
    key: "9e67e25cc0ffcafcb99c566e6d38e0be",
    detail: 1,
    date: "",
  },
  Taday_Type = "today",
  Tomorrow_Type = "tomorrow";

cloud.init({
  env: "running-0g66zunfb34db76a",
});

const db = cloud.database(),
  holidayMapCollection = db.collection("holiday_map");

const writeHoliday = async (date, type, collection, id) => {
  const res = await superagent.get(url).query({
    ...query,
    date,
  });
  if (id) {
    await collection.doc(id).update({
      data: {
        ...res.body.result,
      },
    });
  } else {
    const addResult = await collection.add({
      data: {
        ...res.body.result,
        type,
      },
    });
    id = addResult._id;
  }

  return {
    _id: id,
    ...res.body.result,
  };
};

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { data } = await holidayMapCollection.get();

    const today = dayjs().endOf("day"),
      tomorrow = dayjs().add(1, "day").endOf("day");

    if (data.length) {
      const { _id: todayId } = data.find((item) => item.type === Taday_Type),
        { _id: tomorrowId } = data.find((item) => item.type === Tomorrow_Type);

      const addToday = await writeHoliday(
        today.format("YYYY-MM-DD"),
        Taday_Type,
        holidayMapCollection,
        todayId
      );
      await writeHoliday(
        tomorrow.format("YYYY-MM-DD"),
        Tomorrow_Type,
        holidayMapCollection,
        tomorrowId
      );
      return {
        errMsg: "",
        status: 0,
        data: addToday,
      };
    }

    const addToday = await writeHoliday(
      today.format("YYYY-MM-DD"),
      Taday_Type,
      holidayMapCollection
    );
    await writeHoliday(
      tomorrow.format("YYYY-MM-DD"),
      Tomorrow_Type,
      holidayMapCollection
    );

    return {
      errMsg: "",
      status: 0,
      data: addToday,
    };
  } catch (error) {
    return {
      data: null,
      status:
        lget(error, "response.body.error_code") ||
        error.errCode ||
        error.status ||
        600,
      errMsg:
        `更新假期失败：` +
        (lget(error, "response.body.reason") ||
          error.errMsg ||
          error.message ||
          ""),
    };
  }
};
