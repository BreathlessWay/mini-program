// 云函数入口文件
process.env.TZ = 'Asia/Shanghai';

const cloud = require('wx-server-sdk'),
	user = require('./user/index'),
	setting = require('./setting/index'),
	home = require('./home/index'),
	discount = require('./discount/index'),

	{ env } = require('./constants');

cloud.init({
	env
});

// 云函数入口函数
/**
 * @param {object} event - 触发云函数的事件.
 * @param {string} event.name - 调用的方法名称.
 * @param {string} [event.type] - 请求具体操作
 * @param {object} [event.params] - 请求参数
 * @param {object} context - 包含了此处调用的调用信息和运行状态.
 */
exports.main = async (event, context) => {
	try {
		const { name, ...rest } = event;
		switch (name) {
			case 'user':
				return await user(cloud, rest, context);
			case 'setting':
				return await setting(cloud, rest, context);
			case 'home':
				return await home(cloud, rest, context);
			case 'discount':
				return await discount(cloud, rest, context);
		}
	} catch (error) {
		throw error.errMsg || error.message;
	}
};

