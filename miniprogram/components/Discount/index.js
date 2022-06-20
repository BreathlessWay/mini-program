// components/Banner/index.js
Component({
	options: {
		styleIsolation: 'shared',
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		discountList: {
			type: Array,
			value: []
		}
	},
	observers: {
		'discountList': function (val) {
			if (Array.isArray(val)) {
				const count = val.reduce((pre, next) => {
					if (!pre.includes(next.type)) {
						pre.push(next.type);
					}
					return pre;
				}, []);
				this.setData({
					activityCount: count.length
				});
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		activityCount: 0
	},

	/**
	 * 组件的方法列表
	 */
	methods: {}
});
