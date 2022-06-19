const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ settingDbName, successStatus } = require('../constants');

const setting = async (cloud, event) => {
	const { params } = event,
		db = cloud.database(),
		settingMapDb = db.collection(settingDbName),
		settingResult = await settingMapDb.get(),
		setting = lget(settingResult, 'data.0');

	return {
		errMsg: '',
		status: successStatus,
		data: setting,
	};
};

module.exports = tryCatchWrap(setting, '用户店铺设置失败');
