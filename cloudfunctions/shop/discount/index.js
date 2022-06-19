const tryCatchWrap = require('../utils/tryCatchWrap'),
	popup = require('./popup');
/**
 * @param {object} cloud - wx.cloud
 * @param {object} event - 触发云函数的事件.
 * @param {string} event.type - 请求具体操作
 * @param {object} [event.params] - 请求参数
 */
const discount = async (cloud, event) => {
	const { type, params } = event;

	switch (type) {
		case 'popup': {
			return await popup(cloud, params);
		}
	}
};

module.exports = tryCatchWrap(discount, '优惠券接口调用失败');
