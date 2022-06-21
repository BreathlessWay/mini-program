const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ categoryDbName, successStatus } = require('../constants');

const category = async (cloud) => {
	const db = cloud.database(),
		_ = db.command,
		categoryMapDb = db.collection(categoryDbName),
		categoryResult = await categoryMapDb.get(),
		categoryList = lget(categoryResult, 'data');

	return {
		errMsg: '',
		status: successStatus,
		data: categoryList,
	};
};

module.exports = tryCatchWrap(category, '获取分类列表失败');
