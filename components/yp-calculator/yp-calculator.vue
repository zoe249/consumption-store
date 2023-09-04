<template>
	<view class="calculator-view">
		<!-- <view class="calculator-view-top">
			<text class="calculator-view-top-a">{{ topText }}</text>
			<view class="calculator-view-top-b">
				<view class="calculator-view-top-b1">{{ bottomText }}</view>
				<image class="calculator-view-top-b2" src="/static/delete-1.png" @tap="deleteNum"></image>
			</view>
		</view> -->
		<view class="close-btn-box">
			<view></view>
			<view class="close-btn" @tap="closeCalculatorPopup">
				<u-icon name="arrow-down" color="#333" size="20"></u-icon>
			</view>
		</view>
		<view class="calculator-button">
			<view class="calculator-button-left">
				<!-- 1-9 -->
				<view class="calculator-button-left-aview" v-for="(item, ix) in calculatorButAList" :key="ix">
					<view class="calculator-button-left-a2"></view>
					<view class="calculator-button-left-a" @tap="numTapA(item)">
						<text class="calculator-button-left-a1">{{ item }}</text>
					</view>
				</view>
				<!-- 小数点 -->
				<view class="calculator-button-left-aview">
					<view class="calculator-button-left-a2"></view>
					<view class="calculator-button-left-a" @tap="numTapC"><text
							class="calculator-button-left-a1">.</text></view>
				</view>
				<!-- 0 00 -->
				<view class="calculator-button-left-aview" v-for="(item, ix) in calculatorButBList" :key="ix">
					<view class="calculator-button-left-a2"></view>
					<view class="calculator-button-left-a" @tap="numTapB(item)">
						<text class="calculator-button-left-a1">{{ item }}</text>
					</view>
				</view>
				<view class="calculator-button-left-aview">
					<view class="calculator-button-left-a2"></view>
					<view class="calculator-button-left-a">
						<image class="calculator-view-top-b2" src="/static/store/delete.png" @tap="deleteNum"
							@longpress="clearAll"></image>
					</view>
				</view>
			</view>
			<!-- 运算符号 -->
			<view class="calculator-button-right">
				<!-- ÷ × -->
				<!-- <view class="calculator-button-right-a" v-for="(item, ix) in calculatorButCList" :key="ix" @tap="operationalTapA(item)">
					<text class="calculator-button-right-a1">{{ item }}</text>
				</view> -->
				<!-- + - -->
				<view class="calculator-button-right-a" v-for="(item, ix) in calculatorButDList" :key="ix"
					@tap="operationalTapB(item)">
					<text class="calculator-button-right-a1">{{ item }}</text>
				</view>
				<!-- = -->
				<view class="calculator-button-right-a confirm-btn-box" @tap="affirmComputed">
					<view class="calculator-button-right-a1 confirm-btn">确认</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<!-- <view class="calculator-view-bottom">
			<view class="calculator-view-bottom-a" @tap="closeCalculatorPopup"><text class="calculator-view-bottom-a1">关闭</text></view>
			<view class="calculator-view-bottom-a" @tap="clearAll"><text class="calculator-view-bottom-a1">清零</text></view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				calculatorButAList: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
				calculatorButBList: ['0'],
				calculatorButCList: ['÷', '×'],
				calculatorButDList: ['+', '-'],
				topText: '',
				bottomText: '',
				i: 0,
				firstResult: true
			};
		},
		methods: {
			resetData() {
				this.topText = ''
				this.bottomText = ''
				this.i = 0
				this.firstResult = true
			},
			closeCalculatorPopup() {
				this.$emit('closeCalculatorPopup');
			},
			// 清零
			clearAll() {
				this.bottomText = ''
				this.topText = ''
				this.$emit('computedProcess', this.bottomText)
				this.$emit('computedResult', this.topText)
			},
			// 删除一位字符
			deleteNum() {
				if (this.firstResult) {
					this.topText = this.topText.slice(0, -1);
					this.bottomText = ''
				} else {
					if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
						this.bottomText = '';
						return;
					}
					if (this.bottomText) {
						this.topText = this.topText.slice(0, -1);
						this.bottomText = this.bottomText.slice(0, -1);
						this.$emit('computedProcess', this.bottomText)
						this.$emit('computedResult', this.topText)
						return;
					}
					
					if (this.topText) {
						let temp = this.topText.split(' ');
						temp.pop();
						this.topText = temp.join(' ');
						// this.topText = this.topText.slice(0, -1);
						// this.topText = '';
					}
				}
				
				this.$emit('computedProcess', this.bottomText)
				this.$emit('computedResult', this.topText)
			},
			// 1-9输入判断
			numTapA(item) {
				if (this.firstResult) {
					this.topText += item
					this.bottomText = ''
				} else {
					if (this.bottomText.length == 1 && this.bottomText == 0) {
						return;
					}
					if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
						this.bottomText = '';
					}
					this.bottomText += item;
					// if (this.bottomText.indexOf('+') > -1) {
					// 	this.topText = parseFloat(item) + parseFloat(this.topText)
					// } else if (this.bottomText.indexOf('-') > -1) {
					// 	this.topText = parseFloat(this.topText) - parseFloat(item)
					// }
					// let tempA = this.topText + ' ' + this.bottomText;
					// this.operationHandle(tempA);
				}
				this.$emit('computedProcess', this.bottomText)
				this.$emit('computedResult', this.topText)
			},
			// 0,00输入判断
			numTapB(item) {
				if (this.firstResult) {
					this.topText += item
					this.bottomText = ''
				} else {
					if (this.bottomText.length == 1 && this.bottomText == 0) {
						return;
					}
					// if (item == '00' && this.bottomText == '') {
					// 	return;
					// }
					if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
						this.bottomText = '';
					}
					this.bottomText += item;
				}
				this.$emit('computedProcess', this.bottomText)
				this.$emit('computedResult', this.topText)
			},
			// .输入判断
			numTapC() {
				// if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
				// 	this.bottomText = '';
				// }
				// if (!this.bottomText) {
				// 	return;
				// }
				// if (this.bottomText.indexOf('.') != '-1') {
				// 	return;
				// }
				if (this.firstResult) {
					this.topText += '.'
					this.bottomText = ''
				} else {
					if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
						this.bottomText = '';
					}
					this.bottomText += '.';
				}
				this.$emit('computedProcess', this.bottomText)
				this.$emit('computedResult', this.topText)
			},
			//  × ÷ 输入
			// operationalTapA(item) {
			// 	if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
			// 		this.bottomText = '';
			// 		return;
			// 	}
			// 	if (this.bottomText) {
			// 		// 小数点后不带字符
			// 		if (this.bottomText.endsWith('.')) {
			// 			return;
			// 		}
			// 		// 首位允许为 -,但未带字符
			// 		if (this.bottomText.endsWith('-')) {
			// 			return;
			// 		}
			// 		if (this.topText) {
			// 			// 首行为计算表达式 则将计算结果与当前数值合并成新的表达式
			// 			if (this.topText.endsWith('=')) {
			// 				this.topText = this.bottomText + ' ' + item;
			// 				this.bottomText = '';
			// 				return;
			// 			}
			// 			// 兼容用户奇奇怪怪输入的特殊情况
			// 			let numList = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
			// 			let lastT = this.topText.slice(-1);
			// 			if (numList.includes(lastT)) {
			// 				this.topText = this.topText + this.bottomText + ' ' + item;
			// 			} else {
			// 				this.topText = this.topText + ' ' + this.bottomText + ' ' + item;
			// 			}
			// 		} else {
			// 			this.topText = this.bottomText + ' ' + item;
			// 		}
			// 		this.bottomText = '';
			// 		return;
			// 	}
			// 	if (this.topText) {
			// 		let lastT = this.topText.slice(-1);
			// 		if (lastT == '+' || lastT == '-' || lastT == '÷' || lastT == '×') {
			// 			this.topText = this.topText.slice(0, -1);
			// 			this.topText = this.topText + item;
			// 			return;
			// 		}
			// 		this.topText = this.topText + ' ' + item;
			// 	}
			// 	this.$emit('computedProcess', this.bottomText)
			// 	this.$emit('computedResult', this.topText)
			// },
			// + - 输入
			operationalTapB(item) {
				if (this.firstResult) {
					this.bottomText = this.topText + item
					this.firstResult = false
				} else {
					this.bottomText += item
					// if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
					// 	this.bottomText = '';
					// 	return;
					// }
					// if (this.bottomText) {
					// 	if (this.bottomText.endsWith('.')) {
					// 		return;
					// 	}
					// 	if (this.bottomText.endsWith('-')) {
					// 		return;
					// 	}
					// 	if (this.topText) {
					// 		if (this.topText.endsWith('=')) {
					// 			this.topText = this.bottomText + ' ' + item;
					// 			this.bottomText = '';
					// 			return;
					// 		}
					// 		let numList = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
					// 		let lastT = this.topText.slice(-1);
					// 		if (numList.includes(lastT)) {
					// 			this.topText = this.topText + this.bottomText + ' ' + item;
					// 		} else {
					// 			this.topText = this.topText + ' ' + this.bottomText + ' ' + item;
					// 		}
					// 	} else {
					// 		this.topText = this.bottomText + ' ' + item;
					// 	}
					// 	this.bottomText = '';
					// 	return;
					// }
					// // 首位字符允许为-
					// if (item == '-') {
					// 	this.bottomText = item;
					// 	return;
					// }
				}
				this.$emit('computedProcess', this.bottomText)
				this.$emit('computedResult', this.topText)
			},
			// = 输入
			// operationalTapC() {
			// 	if (this.bottomText === '') {
			// 		// 无计算过程
			// 		this.$emit('confirmComputed', this.i)
			// 	}
			// 	if (this.bottomText == 'Infinity' || this.bottomText == 'NaN') {
			// 		this.bottomText = '';
			// 	}
			// 	if (this.bottomText) {
			// 		if (this.bottomText.endsWith('.')) {
			// 			return;
			// 		}
			// 		if (this.bottomText.endsWith('-')) {
			// 			return;
			// 		}
			// 		if (this.topText.endsWith('=')) {
			// 			this.topText = this.bottomText;
			// 			this.bottomText = '';
			// 			return;
			// 		}

			// 		let tempA = this.topText + ' ' + this.bottomText;
			// 		this.topText = this.topText + ' ' + this.bottomText;

			// 		// 求值
			// 		// this.operationHandle(tempA);
			// 		return;
			// 	}
			// 	if (this.topText) {
			// 		let tempA = '';
			// 		let lastT = this.topText.slice(-1);
			// 		if (lastT == '+' || lastT == '-' || lastT == '÷' || lastT == '×' || lastT == '=') {
			// 			tempA = this.topText.slice(0, -2);
			// 		} else if (lastT == ' ') {
			// 			tempA = this.topText.slice(0, -1);
			// 			let t1 = tempA.slice(-1);
			// 			let t2 = ['+', '-', '×', '÷'];
			// 			if (t2.includes(t1)) {
			// 				tempA = tempA.slice(0, -1);
			// 			}
			// 			this.topText = this.topText + ' ' + '=';
			// 		} else {
			// 			tempA = this.topText;
			// 			this.topText = this.topText + ' ' + '=';
			// 		}

			// 		this.$emit('computedProcess', this.bottomText)
			// 		this.$emit('computedResult', this.topText)

			// 		// 运算求值
			// 		this.operationHandle(tempA);
			// 	}
			// },
			// 运算代理
			// operationHandle(resStr) {
			// 	let regA = /×/gi;
			// 	let regB = /÷/gi;
			// 	let expression = resStr.replace(regA, '*');
			// 	expression = expression.replace(regB, '/');

			// 	// #ifdef MP-WEIXIN
			// 	console.log('小程序运算代理')
			// 	this.i++
			// 	this.$emit('confirmComputed', this.i)
			// 	// 小程序禁用 eval(),故自行计算结果
			// 	// 将表达式转成数组
			// 	let expressionList = expression.split(' ');
			// 	// 自定义实现 * / 运算
			// 	for (let i = 1; i < expressionList.length; i += 2) {
			// 		let symbol = expressionList[i];
			// 		let left = expressionList[i - 1];
			// 		let right = expressionList[i + 1];
			// 		if (symbol == '*') {
			// 			expressionList[i - 1] = -1;
			// 			expressionList[i] = -1;
			// 			expressionList[i + 1] = left * right;
			// 		}
			// 		if (symbol == '/') {
			// 			expressionList[i - 1] = -1;
			// 			expressionList[i] = -1;
			// 			expressionList[i + 1] = left / right;
			// 		}
			// 	}
			// 	// 去除标空数据 -1
			// 	expressionList = expressionList.filter(item => item != -1);

			// 	// 自定义实现 + - 运算
			// 	for (let i = 1; i < expressionList.length; i += 2) {
			// 		let symbol = expressionList[i];
			// 		let left = expressionList[i - 1];
			// 		let right = expressionList[i + 1];
			// 		if (symbol == '+') {
			// 			expressionList[i - 1] = -1;
			// 			expressionList[i] = -1;
			// 			expressionList[i + 1] = left * 1 + right * 1;
			// 		}
			// 		if (symbol == '-') {
			// 			expressionList[i - 1] = -1;
			// 			expressionList[i] = -1;
			// 			expressionList[i + 1] = left - right;
			// 		}
			// 	}
			// 	expressionList = expressionList.filter(item => item != -1);
			// 	expressionList = expressionList.filter(item => item);
			// 	// 结果
			// 	let res = expressionList[0];

			// 	if (this.isFloat(res)) {
			// 		res = parseFloat(res.toPrecision(12));
			// 	}
			// 	this.bottomText = res + '';
			// 	this.$emit('computedResult', this.bottomText)
			// 	this.$emit('computedProcess', this.topText)
			// 	return;
			// 	// #endif

			// 	// 结果数值 非小程序
			// 	let resNum = eval(expression);
			// 	if (this.isFloat(resNum)) {
			// 		resNum = parseFloat(resNum.toPrecision(12));
			// 	}
			// 	this.bottomText = resNum + '';
			// },
			// 判断是否浮点数
			// isFloat(n) {
			// 	return n != parseInt(n);
			// },
			/* 计算确认 */
			affirmComputed() {
				this.$emit('affirmComputed', this.bottomText)
			}
		}
	};
</script>

<style>
	.close-btn-box {
		display: flex;
		justify-content: flex-end;
	}

	.close-btn {
		display: flex;
		justify-content: center;
		background-color: #fff;
		width: 120rpx;
		height: 60rpx;
	}

	.calculator-view {
		width: 750rpx;
		display: flex;
		flex-direction: column;
	}

	.calculator-view-top {
		box-sizing: border-box;
		width: 630rpx;
		background-color: #ffffff;
		padding-top: 20rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.calculator-view-top-a {
		font-size: 36rpx;
		min-height: 44rpx;
		color: #606060;
		text-align: right;
	}

	.calculator-view-top-b {
		margin-top: 20rpx;
		width: 570rpx;
		min-height: 80rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.calculator-view-top-b1 {
		width: 480rpx;
		/* white-space: pre-wrap; */
		word-wrap: break-word;
		font-size: 56rpx;
		text-align: left;
		color: #606060;
	}

	.calculator-view-top-b2 {
		width: 80rpx;
		height: 80rpx;
	}

	.calculator-button {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		background-color: #ffffff;
		padding-bottom: 20rpx;
	}

	.calculator-button-left {
		width: 630rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.calculator-button-left-a {
		position: relative;
		width: 210rpx;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
	}

	.calculator-button-left-aview {
		width: 210rpx;
		height: 100rpx;
		position: relative;
	}

	.calculator-button-left-a1 {
		font-size: 60rpx;
		color: #212121;
	}

	.calculator-button-left-a:active {
		opacity: 0.7;
	}

	.calculator-button-left-a2 {
		width: 210rpx;
		height: 100rpx;
		position: absolute;
		background-color: #000000;
	}

	.calculator-button-right {
		width: 120rpx;
		display: flex;
		flex-direction: column;
		background-color: #000000;
	}

	.calculator-button-right-a {
		width: 120rpx;
		height: 100rpx;
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
	}

	.calculator-button-right-a1 {
		font-size: 50rpx;
		color: #212121;
	}

	.confirm-btn-box {
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.confirm-btn {
		font-size: 40rpx;
	}

	.calculator-button-right-a:active {
		opacity: 0.7;
	}

	.calculator-view-bottom {
		width: 630rpx;
		height: 110rpx;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.calculator-view-bottom-a {
		width: 160rpx;
		height: 70rpx;
		border-radius: 40rpx;
		margin-left: 50rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
	}

	.calculator-view-bottom-a:active {
		opacity: 0.7;
	}

	.calculator-view-bottom-a1 {
		font-size: 34rpx;
		font-weight: 500;
		color: #212121;
	}
</style>
