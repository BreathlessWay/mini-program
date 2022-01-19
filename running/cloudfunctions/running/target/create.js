const dayjs = require("dayjs"),
  lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { planMapDbName, successStatus } = require("@/constants");

const createPlanApi = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    planMapDb = db.collection(planMapDbName),
    findData = await planMapDb
      .where({
        user_id: OPENID,
        month: event.month,
      })
      .get(),
    currentMonth = dayjs().startOf("month").startOf("day"),
    targetMonth = dayjs(event.month);

  if (findData.data.length && targetMonth <= currentMonth) {
    throw `运动贵在坚持，别改个不停`;
  }

  if (findData.data.length) {
    const matchItemId = lget(findData, "data.0._id");
    await planMapDb.doc(matchItemId).update({
      data: {
        startTime: event.startTime,
        endTime: event.endTime,
        month: event.month, // 2022-01
        plan: event.plan, // [{ day: 2022-01-01, startTime: 7:00, endTime: 8:00 }]
        target: event.target,
      },
    });
  } else {
    await planMapDb.add({
      data: {
        user_id: OPENID,
        startTime: event.startTime,
        endTime: event.endTime,
        month: event.month, // 2022-01
        plan: event.plan, // [{ day: 2022-01-01, startTime: 7:00, endTime: 8:00 }]
        target: event.target,
      },
    });
  }

  return {
    errMsg: "",
    status: successStatus,
    data: {
      startTime: event.startTime,
      endTime: event.endTime,
      month: event.month,
      plan: event.plan,
      target: event.target,
    },
  };
};

module.exports = tryCatchWrap(createPlanApi, "创建运动计划失败");
