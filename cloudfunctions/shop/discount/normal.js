const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ discountDbName, successStatus } = require('../constants');

const normal = async (cloud, userId) => {
	const db = cloud.database(),
		_ = db.command,
		$ = _.aggregate,
		discountMapDb = db.collection(discountDbName),
		query = {
			popup: false,
			use: true
		};

	const discountResult = await discountMapDb
			.where(query)
			.field({
				jian: true,
				man: true,
				zhe: true,
				type: true,
				user: true,
				product: true
			})
			.get(),
		discountList = lget(discountResult, 'data');

	let discountResponse = [];

	if (userId && discountList && discountList.length) {
		discountList.forEach(item => {
			const { user, product, ...rest } = item;
			if (item.user && item.user.length) {
				if (user.includes(userId)) {
					discountResponse.push(rest);
				}
			} else {
				discountResponse.push(rest);
			}
		});
	}
	console.log(discountResponse);
	return {
		errMsg: '',
		status: successStatus,
		data: discountResponse,
	};
};

module.exports = tryCatchWrap(normal, '获取优惠列表失败');
