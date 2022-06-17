const lget = require('lodash').get,
	tryCatchWrap = require('../utils/tryCatchWrap'),
	{ successStatus } = require('../constants');

const phone = async (cloud, event) => {
	const { cloudId } = event;     //得到前端通过手机号按钮获取到的cloudId

	const result = await cloud.getOpenData({
		//通过 clouid 调用 getOpenData 方法，获取解密后的手机号数据
		'list': [cloudId]
	});
	const phoneInfo = lget(result, 'list[0].data');

	return {
		errMsg: '',
		status: successStatus,
		data: phoneInfo,
	};
};

module.exports = tryCatchWrap(phone, '用户手机号获取失败');
