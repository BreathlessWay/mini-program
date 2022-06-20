const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ discountDbName, successStatus } = require('../constants');

const normal = async (cloud, userId) => {
	const db = cloud.database(),
		_ = db.command,
		$ = _.aggregate,
		discountMapDb = db.collection(discountDbName);

	let query = {
		popup: false,
		use: true
	};

	if (userId) {
		query = _.expr($.and([
			$.eq(['$popup', false]),
			$.eq(['$use', true]),
			$.or([
				$.in([userId, '$user']),
				$.eq([$.size('$user'), 0])
			])
		]));
	}

	const discountResult = await discountMapDb
			.where(query)
			.field({
				jian: true,
				man: true,
				zhe: true,
				type: true,
				expireStart: true,
				expireEnd: true
			})
			.get(),
		discountList = lget(discountResult, 'data');

	return {
		errMsg: '',
		status: successStatus,
		data: discountList,
	};
};

module.exports = tryCatchWrap(normal, '获取优惠列表失败');
