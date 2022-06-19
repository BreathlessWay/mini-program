// app.js
import './utils/sdk';

import './utils/pageWrap';

import { USER_INFO_KEY } from './constants';

import Toast from '@vant/weapp/toast/toast';

Toast.setDefaultOptions({
	zIndex: 9999,
	forbidClick: true
});

App({
	onLaunch: function () {
		this.globalData.scene = wx.getLaunchOptionsSync().scene;
		if (!wx.cloud) {
			console.error('请使用 2.2.3 或以上的基础库以使用云能力');
		} else {
			wx.cloud.init({
				// env 参数说明：
				//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
				//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
				//   如不填则使用默认环境（第一个创建的环境）
				// env: 'my-env-id',
				traceUser: true,
			});
		}

		this.globalData.userInfo = wx.getStorageSync(USER_INFO_KEY);
	},
	onShow() {
		this.globalData.scene = wx.getLaunchOptionsSync().scene;
	},
	globalData: {
		userInfo: null,
		scene: 0,
		shop_setting: {
			mode: 1,
			showComment: true,
			minPrice: 0
		}
	}
});
