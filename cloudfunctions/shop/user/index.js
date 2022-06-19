const tryCatchWrap = require('../utils/tryCatchWrap'),
	login = require('./login'),
	register = require('./register'),
	update = require('./update'),
	phone = require('./phone');
/**
 * @param {object} cloud - wx.cloud
 * @param {object} event - 触发云函数的事件.
 * @param {string} event.type - 请求具体操作
 * @param {object} [event.params] - 请求参数
 */
const user = async (cloud, event) => {
	const { type, params } = event;

	switch (type) {
		case 'login': {
			return await login(cloud);
		}
		case 'register': {
			return await register(cloud, params);
		}
		case 'update': {
			return await update(cloud, params);
		}
		case 'phone': {
			return await phone(cloud, params);
		}
	}
};

module.exports = tryCatchWrap(user, '用户信息接口调用失败');
