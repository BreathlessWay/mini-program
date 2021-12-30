const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { successStatus, holidayMapDbName } = require("@/constants");

const getHoliday = async (cloud) => {
  const db = cloud.database(),
    holidayCollection = db.collection(holidayMapDbName);

  const today = await holidayCollection
    .where({
      date: dayjs().format("YYYY-MM-DD"),
    })
    .get();

  const { type, ...rest } = lget(today, "data.0") || {};

  if (type !== "today") {
    const res = await cloud.callFunction({
      name: "holiday",
    });
    if (res.result.status) {
      throw res.result;
    }
  }

  return {
    errMsg: "",
    status: successStatus,
    data: rest,
  };
};

module.exports = tryCatchWrap(getHoliday, "获取节假日信息失败");
