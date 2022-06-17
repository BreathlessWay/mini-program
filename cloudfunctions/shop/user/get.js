const lget = require("lodash").get,
	tryCatchWrap = require("../utils/tryCatchWrap"),
	{ userDbName, successStatus } = require("../constants");

const user = async (cloud) => {
	const { OPENID } = cloud.getWXContext(),
		db = cloud.database(),
		userMapDb = db.collection(userDbName),
		userResult = await userMapDb
			.where({
				user_id: OPENID,
			})
			.get(),
		userInfo = lget(userResult, "data.0");

	return {
		errMsg: "",
		status: successStatus,
		data: userInfo,
	};
};

module.exports = tryCatchWrap(user, "用户信息获取失败");
