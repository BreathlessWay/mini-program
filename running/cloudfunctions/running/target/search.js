const lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { userMapDbName, successStatus } = require("@/constants");

const getPlanApi = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    userMapDb = db.collection(userMapDbName);

  const planResult = await userMapDb
    .where({
      user_id: OPENID,
    })
    .get();

  const date = event.date;

  let plan = lget(planResult, "data.0.plan") || [];

  if (date) {
    plan = plan.find((item) => item.date === date);
  }

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

  const matchStepInfo = stepInfoList.find(
    (item) => dayjs(item.timestamp * 1000).format("YYYY-MM-DD") === date
  );
  console.log(matchStepInfo);

  return {
    errMsg: "",
    status: successStatus,
    data: {
      target: lget(planResult, "data.0.target"),
      plan,
    },
  };
};

module.exports = tryCatchWrap(getPlanApi);
