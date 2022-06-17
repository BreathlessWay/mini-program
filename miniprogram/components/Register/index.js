import lget from 'lodash.get';
import Toast from '@vant/weapp/toast/toast';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		canIUseGetUserProfile: false,
	},
	attached() {
		if (wx.getUserProfile) {
			this.setData({
				canIUseGetUserProfile: true,
			});
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		async getUserInfo(e) {
			await this.handleRegister(e.detail.userInfo);
		},
		async getUserProfile() {
			try {
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				// 只能在外层才能触发，只能被页面上的按钮点击事件触发
				const res = await wx.getUserProfile({
					desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				});
				await this.handleRegister(res.userInfo);
			} catch (error) {
				Toast.fail('获取用户信息失败');
			}
		},
		async handleRegister(userInfo) {
			Toast.loading({
				message: '注册中...',
				forbidClick: true,
				duration: 0
			});
			try {
				const userResult = await wx.cloud.callFunction({
					name: 'shop',
					data: {
						name: 'user',
						type: 'post',
						params: userInfo
					},
				});
				this.triggerEvent('register', lget(userResult, 'result.data'));
			} catch (e) {
				Toast.fail('用户注册失败');
			} finally {
				Toast.clear();
			}
		},
		handleClose() {
			this.triggerEvent('close');
		}
	}
});
