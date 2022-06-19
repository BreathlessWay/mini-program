const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ homeDbName, successStatus } = require('../constants');

const home = async (cloud) => {
	const db = cloud.database(),
		homeMapDb = db.collection(homeDbName),
		homeResult = await homeMapDb.get(),
		home = lget(homeResult, 'data.0');

	return {
		errMsg: '',
		status: successStatus,
		data: home,
	};
};

module.exports = tryCatchWrap(home, '获取店铺首页信息失败');
