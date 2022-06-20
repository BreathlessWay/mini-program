import { DiscountType } from '../../emun';

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
				const manJianInfo = [],
					manJianQuan = [],
					diKouQuan = [];

				val.forEach(item => {
					if (item.type === DiscountType.jianInfo) {
						manJianInfo.push(item);
					}
					if (item.type === DiscountType.jianQuan) {
						manJianQuan.push(item);
					}
					if (item.type === DiscountType.diQuan) {
						diKouQuan.push(item);
					}
				});
				let count = 0, title = '', isManJian = false, manJianInfoTitle = '';
				if (manJianInfo.length) {
					isManJian = true;
					const _lastIndex = manJianInfo.length - 1;
					manJianInfo.forEach((_, index) => {
						const isLast = index === _lastIndex;
						const _text = `满${_.man / 100}减${_.jian / 100}${isLast ? '' : '，'}`;
						title += _text;
					});
					manJianInfoTitle = title;
					count++;
				}
				if (manJianQuan.length) {
					if (!title) {
						const _lastIndex = manJianQuan.length - 1;
						manJianQuan.forEach((_, index) => {
							const isLast = index === _lastIndex;
							const _text = `满${_.man / 100}减${_.jian / 100}${isLast ? '' : '，'}`;
							title += _text;
						});
					}
					count++;
				}
				if (diKouQuan.length) {
					if (!title) {
						const _lastIndex = diKouQuan.length - 1;
						diKouQuan.forEach((_, index) => {
							const isLast = index === _lastIndex;
							const _text = `${_.jian / 100}元券${isLast ? '' : '，'}`;
							title += _text;
						});
					}
					count++;
				}
				this.setData({
					activityCount: count,
					quan: manJianQuan.concat(diKouQuan),
					title,
					manJianInfoTitle
				});
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		activityCount: 0,
		active: false,
		title: '',
		manJianInfoTitle: '',
		quan: [],
		popupShow: false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		handleClick() {
			this.setData({
				active: true,
				popupShow: true
			});
		},
		handlePopupClose() {
			this.setData({
				active: false,
				popupShow: false
			});
		},
		handleClickCoupon(e) {
			console.log(e.detail);
		}
	}
});
