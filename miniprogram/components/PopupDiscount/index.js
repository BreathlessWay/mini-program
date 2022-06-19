import lget from 'lodash.get';

const app = getApp();

let hasShow = false;
// components/PopupDiscount/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		show: false,
		list: []
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show() {
			if (!hasShow) {
				this.getPopupDiscountList();
			}
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		async getPopupDiscountList() {
			try {
				const discountResult = await wx.cloud.callFunction({
					name: 'shop',
					data: {
						name: 'discount',
						type: 'popup',
						params: lget(app, 'globalData.userInfo._id')
					},
				});
				const discountList = lget(discountResult, 'result.data');
				hasShow = true;
				console.log(discountList);
			} catch (error) {
				console.log(error);
			}
		}
	}
});
