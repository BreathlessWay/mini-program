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
		discountList: [],
		active: 0,
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
		this.getDiscount();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	async onPullDownRefresh() {
		try {
			await Promise.all([this.getHomeInfo(), this.getDiscount()]);
		} finally {
			wx.stopPullDownRefresh();
		}
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
	loginHook() {
		const popupDiscount = this.selectComponent('#popup-discount');
		if (popupDiscount) {
			popupDiscount.getPopupDiscountList();
			this.getDiscount();
		}
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
				banner: lget(home, 'result.data.banner')
			});
		} catch (e) {
			console.log(e);
		}
	},
	async getDiscount() {
		try {
			const discount = await wx.cloud.callFunction({
				name: 'shop',
				data: {
					name: 'discount',
					type: 'normal',
					params: lget(this.data.userInfo, '_id')
				},
			});
			this.setData({
				discountList: lget(discount, 'result.data')
			});
		} catch (e) {
			console.log(e);
		}
	},
	handleTabChange(e) {
		this.setData({
			active: e.detail.index
		});
	}
});
