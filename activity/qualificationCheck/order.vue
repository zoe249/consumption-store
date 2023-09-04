<template>
	<view>
		<view class="order-box" :style="'height:' + style + 'vh;'">
			<view v-for="(item, index) in orderList" :key="index" @click="selectOrderInfo(item.text, index)"
				:style="'position: absolute;top:' + item.pos.left_top.y + 'rpx;left:' + item.pos.left_top.x + 'rpx;'">
				{{item.text}}
			</view>
		</view>
		<view class="select-order">
			<view class="select-tip">请从上述小票信息中选取以下相关联信息，</view>
			<view class="select-tip">选取后，请点击相关信息的保存按钮</view>
			<view class="order-info">
				<view>订单编号</view>
				<view class="select-info">
					<view>{{orderNum}}</view>
					<view class="save-btn" @click="saveOrderNum">保存</view>
				</view>
			</view>
			<view class="order-info">
				<view>交易时间</view>
				<view class="select-info">
					<view>{{createTime}}</view>
					<view class="save-btn" @click="saveCreateTime">保存</view>
				</view>
			</view>
			<view class="order-info">
				<view>交易金额</view>
				<view class="select-info">
					<view>{{price}}</view>
					<view class="save-btn" @click="savePrice">保存</view>
				</view>
			</view>
			<view class="complete-btn" @click="saveOrderTemplate">完成</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				orderNum: '',
				createTime: '',
				price: '',
				orderNumState: true,
				createTimeState: true,
				priceState: true,
				storeId: '',
				orderNumberIndex: '', // 订单编号前一个的text
				createTimeIndex: '',
				priceIndex: '',
				style: 0
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.orderList = JSON.parse(options.orderInfo)
			for (let i = 0; i < this.orderList.length; i++) {
				if (this.orderList[i].pos.left_top.x > 150) {
					let width = this.orderList[0].pos.left_top.x - 50
					this.orderList[i].pos.left_top.x -= width
				}
			}
			var height = 0
			for (let i = 0; i < this.orderList.length; i++) {
				if (this.orderList[i].pos.left_top.y > 818) {
					this.style = 100 + (this.orderList[this.orderList.length - 1].pos.left_top.y - 718) / 10
					return
				}
			}
		},
		methods: {
			/* 选择订单信息 */
			selectOrderInfo(item, idx) {
				console.log(item)
				let index = item.indexOf(':')
				if (index > -1) {
					// 有冒号情况下
					console.log(item.split(':')[0])
					if (this.orderNumState) {
						this.orderNum = item.substr(index + 1, item.length)
					} else if (this.createTimeState) {
						this.createTime = item.substr(index + 1, item.length).slice(0, 10)
					} else if (this.priceState) {
						this.price = item.substr(index + 1, item.length)
					}
				} else {
					console.log('无冒号角标', idx)
					if (this.orderNumState) {
						this.orderNum = item
					} else if (this.createTimeState) {
						this.createTime = item.slice(0, 10)
					} else if (this.priceState) {
						this.price = item
					}
				}
				let text = this.orderList[idx - 1].text
				console.log(text)
				if (this.orderNumState) {
					this.orderNumberIndex = text // 截取text
				} else if (this.createTimeState) {
					this.createTimeIndex = text
				} else if (this.priceState) {
					this.priceIndex = text
				}
			},
			/* 保存订单编号 */
			saveOrderNum() {
				this.orderNumState = false
				uni.showToast({
					title: '保存成功',
					icon: 'none'
				})
			},
			/* 保存交易时间 */
			saveCreateTime() {
				this.createTimeState = false
				uni.showToast({
					title: '保存成功',
					icon: 'none'
				})
			},
			/* 保存金额 */
			savePrice() {
				this.priceState = false
				uni.showToast({
					title: '保存成功',
					icon: 'none'
				})
			},
			/* 保存订单模板 */
			saveOrderTemplate() {
				let that = this
				let orderInfo = {
					orderNum: that.orderNum,
					createTime: that.createTime,
					price: that.price
				}
				that.request({
					url: that.config.ocrTemplate,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						orderNumberIndex: that.orderNumberIndex,
						createTimeIndex: that.createTimeIndex,
						priceIndex: that.priceIndex
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							var pages = getCurrentPages()
							var prevPage = pages[pages.length - 2]
							prevPage.$vm.orderInfo = orderInfo
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	.order-box {
		height: 100vh;
	}

	.select-order {
		background-color: #fff;
		padding: 20rpx 24rpx;
		z-index: 999;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		font-size: 28rpx;
	}

	.order-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f4f4f4;
	}

	.select-tip {
		line-height: 40rpx;
	}

	.select-info {
		display: flex;
		align-items: center;
	}

	.save-btn {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		background-color: #F2AB99;
		color: #fff;
		margin-left: 20rpx;
	}

	.complete-btn {
		margin: 40rpx 32rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
