import lget from 'lodash.get';

const _page = Page;

Page = function (options) {
	options.data.shop_setting = null;
	options.data.shop_initial_fail = false;
	options.data.userInfo = null;

	const _onLoad = options.onLoad;

	const onLoad = async function () {
		const shop_setting = getApp().globalData.shop_setting;
		if (shop_setting) {
			this.setData({
				shop_setting
			});
			return;
		}
		try {
			const settingResult = await wx.cloud.callFunction({
				name: 'shop',
				data: {
					name: 'setting'
				},
			});
			const setting = lget(settingResult, 'result.data');
			if (setting) {
				const { _id, ...rest } = setting;
				this.setData({
					shop_setting: rest
				});
				getApp().globalData.shop_setting = rest;
			} else {
				throw new Error('尚未设置店铺模式');
			}
			_onLoad && _onLoad.apply(this, arguments);
		} catch (error) {
			console.log(error);
			this.setData({
				shop_initial_fail: true
			});
		}
	};

	options.onLoad = onLoad;

	const _onShow = options.onShow;

	const onShow = function () {
		this.setData({
			userInfo: getApp().globalData.userInfo
		});
		_onShow && _onShow.apply(this, arguments);
	};

	options.onShow = onShow;

	return _page(options);
};
