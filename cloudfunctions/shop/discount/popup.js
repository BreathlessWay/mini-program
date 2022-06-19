const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ discountDbName, successStatus } = require('../constants'),
	{ DiscountType } = require('../emun');

const popup = async (cloud, userId) => {
	const db = cloud.database(),
		_ = db.command,
		discountMapDb = db.collection(discountDbName),
		query = {
			popup: true,
			type: _.in([DiscountType.diQuan, DiscountType.jianQuan, DiscountType.zheQuan]),
			use: true
		};

	if (userId) {
		query.user = _.in([userId]);
	}

	const discountResult = await discountMapDb
			.where(query)
			.field({
				jian: true,
				man: true,
				zhe: true,
				type: true
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
