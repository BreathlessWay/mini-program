const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ discountDbName, successStatus } = require('../constants'),
	{ DiscountType } = require('../emun');

const popup = async (cloud, userId) => {
	const db = cloud.database(),
		_ = db.command,
		$ = _.aggregate,
		discountMapDb = db.collection(discountDbName);

	let query = {
		popup: true,
		type: _.in([DiscountType.diQuan, DiscountType.jianQuan]),
		use: true
	};

	if (userId) {
		query = _.expr($.and([
			$.eq(['$popup', true]),
			$.eq(['$use', true]),
			$.in(['$type', [DiscountType.diQuan, DiscountType.jianQuan]]),
			$.or([
				$.ifNull(['$user', []]),
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

module.exports = tryCatchWrap(popup, '获取开屏弹窗优惠券失败');
