const tryCatchWrap = require('../utils/tryCatchWrap'),
	{ userDbName, successStatus } = require('../constants');

const update = async (cloud, event) => {
	const { OPENID } = cloud.getWXContext(),
		db = cloud.database(),
		userMapDb = db.collection(userDbName);

	// event.userInfo 尽然在服务器上有值 fuck
	// put
	await userMapDb.where({ user_id: OPENID }).update({
		data: {
			...event.user
		},
	});

	return {
		errMsg: '',
		status: successStatus,
		data: null
	};
};

module.exports = tryCatchWrap(update, '用户信息更新失败');
