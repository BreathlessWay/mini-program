const tryCatchWrap = require("@/utils/tryCatchWrap"),
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
      .get();

  if (findData.data.length) {
    throw `${event.month}的运动计划已存在，请勿重复创建`;
  }

  await planMapDb.add({
    data: {
      user_id: OPENID,
      month: event.month, // 2022-01
      plan: event.plan, // [{ day: 2022-01-01, startTime: 7:00, endTime: 8:00 }]
      target: event.target,
    },
  });

  return {
    errMsg: "",
    status: successStatus,
    data: {
      month: event.month,
      plan: event.plan,
      target: event.target,
    },
  };
};

module.exports = tryCatchWrap(createPlanApi, '创建运动计划失败');
