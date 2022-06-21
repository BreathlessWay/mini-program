const tryCatchWrap = require('../utils/tryCatchWrap'),
	category = require('./category'),
	list = require('./list'),
	detail = require('./detail');
	/**
 * @param {object} cloud - wx.cloud
 * @param {object} event - 触发云函数的事件.
 * @param {string} event.type - 请求具体操作
 * @param {object} [event.params] - 请求参数
 */
const product = async (cloud, event) => {
	const { type, params } = event;

	switch (type) {
		case 'category': {
			return await category(cloud, params);
		}
		case 'list': {
			return await list(cloud, params);
		}
		case 'detail': {
			return await detail(cloud, params);
		}
	}
};

module.exports = tryCatchWrap(product, '商品接口调用失败');
