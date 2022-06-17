import lget from 'lodash.get';

const _page = Page;

Page = function (options) {
	options.data.shop_mode = null;
	options.data.shop_initial_fail = false;
	options.data.userInfo = null;

	const _onLoad = options.onLoad;

	const onLoad = async function () {
		try {
			const accountInfo = wx.getAccountInfoSync();
			const setting = await wx.cloud.callFunction({
				name: 'shop',
				data: {
					name: 'setting',
					params: {
						appid: accountInfo.miniProgram.appId
					}
				},
			});
      const mode = lget(setting, 'result.data.mode');
			if (mode) {
				this.setData({
					shop_mode: mode
				});
			} else {
				throw new Error('尚未设置店铺模式');
			}
			_onLoad && _onLoad.apply(this, arguments);
		} catch (error) {
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
