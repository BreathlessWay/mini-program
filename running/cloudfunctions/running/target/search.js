const lget = require("lodash").get,
  isNumber = require("lodash").isNumber,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  getJokerApi = require("./joker"),
  { userMapDbName, successStatus } = require("@/constants");

const getPlanApi = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    userMapDb = db.collection(userMapDbName);

  const userResult = await userMapDb
    .where({
      user_id: OPENID,
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
  } catch (error) {}

  const date = event.date,
    userInfo = lget(userResult, "data.0") || {},
    stepInfo = userInfo.stepInfo || {};

  const plan = userInfo.plan || [];

  let currentDayPlan = null,
    stepCount = 0;

  if (date && plan.length) {
    const formatDate = dayjs(date).format("YYYY-MM-DD");
    currentDayPlan = plan.find((item) => item.date === formatDate) || null;

    if (currentDayPlan) {
      const matchStepInfo = stepInfoList.find(
        (item) =>
          dayjs(item.timestamp * 1000).format("YYYY-MM-DD") === formatDate
      );

      const now = dayjs(date).valueOf(),
        startTime = dayjs(
          `${currentDayPlan.date} ${currentDayPlan.startTime}`
        ).valueOf(),
        endTime = dayjs(
          `${currentDayPlan.date} ${currentDayPlan.endTime}`
        ).valueOf(),
        gap = 10 * 60 * 1000;

      if (now < startTime + gap && now > startTime - gap) {
        if (
          !stepInfo.startTimestamp ||
          Math.abs(now - startTime) <
            Math.abs(stepInfo.startTimestamp - startTime)
        ) {
          userMapDb.doc(userInfo._id).update({
            data: {
              stepInfo: {
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
          userMapDb.doc(userInfo._id).update({
            data: {
              stepInfo: {
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
      target: userInfo.target,
      plan,
      stepCount,
      currentDayPlan,
      joker,
    },
  };
};

module.exports = tryCatchWrap(getPlanApi);
