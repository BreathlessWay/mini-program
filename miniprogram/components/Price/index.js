// value	[可选] 价格数值，优先级高于标签内嵌套值
// symbol	[可选] 货币符号。默认为 ￥
// status	[可选] 显示状态，若设置为 del 显示为删除态

// icon	[可选] 人民币符号显示规则
// - 如不设置，人民币符号的字号同价格数字一致
// - 设为 sup，人民币符号字号缩小，位于价格左上方
// - 设为 sub，人民币符号字号缩小，位于价格左下方

// decimal	[可选] 小数部分显示规则
// - 如不设置，显示 2 位小数，字号同整数部分一致
// - 设置为 1，显示 1 位小数，小数部分向下取整
// - 设为 none，不显示小数部分，只显示整数价格
// - 设为 small，小数部分字号缩小

// del-color	[可选] del 状态下文字颜色，只在del状态下有效，正常状态下文字颜色可继承父元素
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		symbol: {
			type: String,
			value: '￥'
		},
		value: {
			type: String,
			value: ''
		},
		status: {
			type: String,
			value: '' // del
		},
		icon: {
			type: String,
			value: '' // 'sup' | 'sub'
		},
		color: {
			type: String,
			value: '#000'
		},
		delColor: {
			type: String,
			value: '#8f8f8f'
		},
		decimal: {
			type: String,
			value: 'small' //  1 | '1' | 'none' | 'small' | 2 | string
		},
		size: {
			type: String,
			value: '32px'
		},
		blod: {
			type: Boolean,
			value: false
		}
	},
	observers: {
		'value, decimal': function (value, decimal) {
			this.setPrice(value, decimal);
			this.getDecimalNum({ value, decimal });
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		showPrice: '',
		showDecimalNum: ''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getDecimalNum(params) {
			const { value, decimal = 'small' } = params;
			let res = '';
			if (decimal === 'small') {
				res = (value.toString().split('.')[1] || '00').trim();
			}
			this.setData({
				showDecimalNum: res
			});
		},
		getDecimal(priceNum, len, dir) {
			if (!priceNum || !len) {
				return '';
			}

			dir = dir || 'f';
			priceNum = parseFloat(priceNum);
			len = parseInt(len, 10);

			if (dir === 'f') {
				let intNumStr = priceNum.toString().split('.')[0];
				let decimalNumStr = priceNum.toString().split('.')[1] || '00';
				if (decimalNumStr.length < 2) {
					decimalNumStr += '0';
				}

				return intNumStr + '.' + decimalNumStr.substring(0, len);
			} else {
				return priceNum.toFixed(len);
			}
		},
		setPrice(value, decimal) {
			let privateValue = '';
			if (typeof value === 'string' || typeof value === 'number') {
				switch (decimal) {
					// 保留一位小数
					case 1: {
						privateValue = this.getDecimal(value, 1);
						break;
					}

					case '1': {
						privateValue = this.getDecimal(value, 1);
						break;
					}

					// 只显示整数
					case 'none': {
						privateValue = parseInt(value);
						break;
					}

					// 小数部分缩小
					case 'small': {
						privateValue = parseInt(value)
							.toString()
							.trim();
						break;
					}
					default: {
						privateValue = this.getDecimal(value, 2);
						break;
					}
				}
			}
			this.setData({
				showPrice: privateValue.toString()
			});
		}
	}
});
