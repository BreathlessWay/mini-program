const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
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
    stepInfo = userInfo.stepInfo;

  let plan = userInfo.plan || [];
  if (date) {
    const formatDate = dayjs(date).format("YYYY-MM-DD");
    plan = plan.find((item) => item.date === formatDate);
    const matchStepInfo = stepInfoList.find(
      (item) => dayjs(item.timestamp * 1000).format("YYYY-MM-DD") === formatDate
    );

    const now = dayjs(date).valueOf(),
      startTime = dayjs(`${plan.date} ${plan.startTime}`).valueOf(),
      endTime = dayjs(`${plan.date} ${plan.endTime}`).valueOf(),
      gap = 10 * 60 * 1000;

    console.log(now, startTime, endTime, matchStepInfo);

    if (now < startTime + gap && now > startTime - gap) {
      if (
        !(stepInfo && stepInfo.startTimestamp) ||
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

    if (now < endTime + gap && now > endTime - gap) {
      if (stepInfo && stepInfo.endTimestamp) {
      }
    }
    // 开始前后10分钟
    // {
    //   startStep: 100,
    //   startTimestamp: dayjs(date).valueOf
    // }
    console.log(dayjs(date).valueOf());
    // 结束前后10分钟
    // {
    //   endStep: 100,
    //   endTimestamp: dayjs(date).valueOf
    // }
  }

  return {
    errMsg: "",
    status: successStatus,
    data: {
      target: userInfo.target,
      plan,
      stepInfo: 0,
    },
  };
};

module.exports = tryCatchWrap(getPlanApi);
