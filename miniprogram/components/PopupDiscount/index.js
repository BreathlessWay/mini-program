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
			console.log(hasShow);
			this.getPopupDiscountList();
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getPopupDiscountList() {
			console.log(1);
			hasShow = true;
		}
	}
});
