const lget = require("lodash").get,
  isNumber = require("lodash").isNumber,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  getJokerApi = require("./joker"),
  { planMapDbName, successStatus } = require("@/constants");

const getPlanApi = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    planMapDb = db.collection(planMapDbName);

  const planResult = await planMapDb
    .where({
      user_id: OPENID,
      month: event.month,
    })
    .get();

  const runResult = await cloud.openapi.cloudbase.getOpenData({
    openid: OPENID,
    cloudidList: [event.cloudID],
  });
  let stepInfoList = [];
  try {
    stepInfoList =
      lget(
        JSON.parse(lget(runResult, "dataList.0.json")),
        "data.stepInfoList"
      ) || [];
  } catch (error) {
    throw "获取微信运动步数失败";
  }

  const date = event.date,
    planInfo = lget(planResult, "data.0") || {},
    plan = planInfo.plan || [],
    stepInfo = planInfo.stepInfo || {};

  let currentDayPlan = null,
    stepCount = 0;

  if (date && plan.length) {
    const formatDate = dayjs(date).format("YYYY-MM-DD"),
      currentIndex = plan.findIndex((item) => item.day === formatDate);

    if (~currentIndex) {
      currentDayPlan = plan[currentIndex] || null;
      const matchStepInfo = stepInfoList.find(
        (item) =>
          dayjs(item.timestamp * 1000).format("YYYY-MM-DD") === formatDate
      );

      const now = dayjs(date).valueOf(),
        startTime = dayjs(
          `${currentDayPlan.day} ${currentDayPlan.startTime}`
        ).valueOf(),
        endTime = dayjs(
          `${currentDayPlan.day} ${currentDayPlan.endTime}`
        ).valueOf(),
        gap = 10 * 60 * 1000;

      if (now < startTime + gap && now > startTime - gap) {
        if (
          !stepInfo.startTimestamp ||
          Math.abs(now - startTime) <
            Math.abs(stepInfo.startTimestamp - startTime)
        ) {
          planMapDb.doc(planInfo._id).update({
            data: {
              [`plan.${currentIndex}.stepInfo`]: {
                startStep: matchStepInfo.step,
                startTimestamp: now,
              },
            },
          });
        }
      }
      if (isNumber(stepInfo.startStep) && isNumber(stepInfo.endStep)) {
        stepCount = stepInfo.endStep - stepInfo.startStep;
      }
      if (
        stepInfo.startTimestamp &&
        now < endTime + gap &&
        now > endTime - gap
      ) {
        if (
          !stepInfo.endTimestamp ||
          Math.abs(now - endTime) < Math.abs(stepInfo.endTimestamp - endTime)
        ) {
          stepCount = matchStepInfo.step - stepInfo.startStep;
          planMapDb.doc(planInfo._id).update({
            data: {
              [`plan.${currentIndex}.stepInfo`]: {
                endStep: matchStepInfo.step,
                endTimestamp: now,
              },
            },
          });
        }
      }
    }
  }

  let joker = "";

  if (!currentDayPlan) {
    joker = (await getJokerApi(cloud)).data;
  }

  return {
    errMsg: "",
    status: successStatus,
    data: {
      target: planInfo.target,
      plan,
      stepCount,
      currentDayPlan,
      joker,
    },
  };
};

module.exports = tryCatchWrap(getPlanApi);
