import lget from 'lodash.get';
import Toast from '@vant/weapp/toast/toast';

import { setUserInfo, removeUserInfo } from '../utils/auth';

export default Behavior({
	data: {
		canIUseGetUserProfile: false,
		register: false
	},
	attached() {
		if (wx.getUserProfile) {
			this.setData({
				canIUseGetUserProfile: true,
			});
		}
	},
	methods: {
		async login() {
			try {
				Toast.loading({
					message: '登录中...',
					forbidClick: true,
					duration: 0
				});
				const userInfo = await wx.cloud.callFunction({
					name: 'shop',
					data: {
						name: 'user',
						type: 'login'
					},
				});
				const userDetail = lget(userInfo, 'result.data');
				if (userDetail) {
					this.setUserInfo(userDetail);
				} else {
					this.setData({
						register: true,
					});
				}
			} catch (error) {
				Toast.fail('登录失败');
			} finally {
				Toast.clear();
			}
		},
		setUserInfo(userInfo) {
			this.setData({
				userInfo,
				register: false,
			});
			setUserInfo(userInfo);
			this.loginHook && this.loginHook();
		},
		handleRegister(e) {
			this.setUserInfo(e.detail);
		},
		handleCloseRegister() {
			this.setData({
				register: false,
			});
		},
		logout() {
			this.setData({
				userInfo: null
			});
			removeUserInfo();
		}
	}
});
