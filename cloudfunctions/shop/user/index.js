const tryCatchWrap = require("../utils/tryCatchWrap"),
	get = require("./get"),
	post = require("./post"),
	put = require("./put");
/**
 * @param {object} cloud - wx.cloud
 * @param {object} event - 触发云函数的事件.
 * @param {string} event.type - 请求类型 get post put delete...
 * @param {object} event.params - 请求参数
 */
const user = async (cloud, event) => {
	const { type, params } = event;

	switch (type) {
		case 'get': {
			return await get(cloud);
		}
		case 'post': {
			return await post(cloud, params);
		}
		case 'put': {
			return await put(cloud, params);
		}
	}
};

module.exports = tryCatchWrap(user, "用户信息接口调用失败");
