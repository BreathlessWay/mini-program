const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ userDbName, successStatus } = require('../constants');

const login = async (cloud) => {
	const { OPENID } = cloud.getWXContext(),
		db = cloud.database(),
		userMapDb = db.collection(userDbName),
		userResult = await userMapDb
			.where({
				user_id: OPENID,
			})
			.get(),
		userInfo = lget(userResult, 'data.0');

	return {
		errMsg: '',
		status: successStatus,
		data: userInfo,
	};
};

module.exports = tryCatchWrap(login, '用户信息获取失败');
