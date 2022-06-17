const tryCatchWrap = require('../utils/tryCatchWrap'),
	{ userDbName, successStatus } = require('../constants');

const register = async (cloud, userInfo) => {
	const { OPENID } = cloud.getWXContext(),
		db = cloud.database(),
		userMapDb = db.collection(userDbName);

	userInfo.user_id = OPENID;

	// event.userInfo 尽然在服务器上有值
	const res = await userMapDb.add({
		data: userInfo,
	});
	userInfo._id = res._id;

	return {
		errMsg: '',
		status: successStatus,
		data: userInfo,
	};
};

module.exports = tryCatchWrap(register, '用户注册失败');
