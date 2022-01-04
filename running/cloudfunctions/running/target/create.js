const tryCatchWrap = require("@/utils/tryCatchWrap"),
  { userMapDbName, successStatus } = require("@/constants");

const createPlanApi = async (cloud, event) => {
  const { OPENID } = cloud.getWXContext(),
    db = cloud.database(),
    userMapDb = db.collection(userMapDbName);

  // [
  //   {
  //     date: "",
  //     startTime: "",
  //     endTime: ""
  //   },
  // ];

  await userMapDb
    .where({
      user_id: OPENID,
    })
    .update({
      data: {
        plan: event.plan,
        target: event.target,
      },
    });

  return {
    errMsg: "",
    status: successStatus,
    data: event.plan,
  };
};

module.exports = tryCatchWrap(createPlanApi);
