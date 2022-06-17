const tryCatchWrap = require("../utils/tryCatchWrap"),
	{ userDbName, successStatus } = require("../constants");

const user = async (cloud, userInfo) => {
	const { OPENID } = cloud.getWXContext(),
		db = cloud.database(),
		userMapDb = db.collection(userDbName),
		data = {
			avatarUrl: "",
			nickName: "",
			gender: 0, // 0-未知 1-男 2-女
			city: "",
			country: "",
			language: "zh_CN",
			province: "",
		};

	// event.userInfo 尽然在服务器上有值 fuck
	for (let p in data) {
		if (userInfo.hasOwnProperty(p)) {
			data[p] = userInfo[p];
		}
	}
	const res = await userMapDb.add({
		data: {
			user_id: OPENID,
			...data,
		},
	});
	data._id = res._id;
	data.user_id = OPENID;

	return {
		errMsg: "",
		status: successStatus,
		data,
	};
};

module.exports = tryCatchWrap(user, "用户注册失败");
