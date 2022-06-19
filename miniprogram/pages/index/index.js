import lget from 'lodash.get';

import login from '../../behaviors/login';

Page({
	behaviors: [login],
	/**
	 * 页面的初始数据
	 */
	data: {
		desk: null,
		banner: [],
		showComment: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		// 扫码点餐：只有餐馆，并且是通过扫码场景进入
		if (this.data.shop_mode === 2 && globalData.scene === 1011) {
			this.setData({
				desk: options.desk
			});
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.getHomeInfo();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {
		return {
			title: '爱尚小超市',
			path: '/page/index/index',
			imageUrl: ''
		};
	},
	async getHomeInfo() {
		try {
			const home = await wx.cloud.callFunction({
				name: 'shop',
				data: {
					name: 'home'
				},
			});
			this.setData({
				banner: lget(home, 'result.data.banner'),
				showComment: lget(home, 'result.data.showComment'),
			});
			console.log(home);
		} catch (e) {
			console.log(e);
		}
	}
});
