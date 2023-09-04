<template>
	<view>
		<view class="state-box">
			<image :src="imgUrl + 'pendOrder.png'" mode="widthFix"></image>
			<view class="pend-state">等待支付</view>
			<view class="pend-tip">您的订单未支付，请确认</view>
		</view>
		<view class="order-btn">
			<view class="cancle-btn" @click="cancleOrder">取消订单</view>
			<view @click="getPayParameters">继续支付</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				imgUrl: this.config.imgUrl,
				orderId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.orderId = options.orderId
		},
		methods: {
			/* 取消订单 */
			cancleOrder() {
				let that = this
				uni.showModal({
					content: '确定要取消订单吗',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '处理中',
								mark: true
							})
							that.request({
								url: `${that.config.cancleOrder}/${that.orderId}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
							}).then(res => {
								console.log('取消订单', res)
								uni.hideLoading()
								if (res.data.code == '200000') {
									setTimeout(() => {
										uni.reLaunch({
											url: './list?orderState=true'
										})
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
				})
			},
			/* 获取微信支付参数 */
			getPayParameters() {
				let that = this
				that.request({
					url: `${that.config.wechatPay}/${that.orderId}/JSAPIPayParam`
				}).then(res => {
					console.log('微信支付参数', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						uni.requestPayment({
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: 'prepay_id=' + data.payId,
							signType: data.signType,
							paySign: data.paySign,
							success(res) {
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(() => {
									uni.reLaunch({
										url: './paySucc'
									})
								}, 2000)
							},
							fail() {
								setTimeout(() => {
									uni.reLaunch({
										url: './waitPay?orderId=' + that.orderId
									})
								}, 2000)
							}
						})
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
</style>

<style scoped>
	.state-box{
		text-align: center;
	}
	
	.state-box image{
		width: 108rpx;
		height: auto;
		display: block;
		margin: 260rpx auto 0;
	}
	
	.pend-state{
		color: #333;
		font-size: 40rpx;
		margin: 36rpx 0 18rpx;
	}
	
	.pend-tip{
		color: #999;
		font-size: 28rpx;
	}
	
	.order-btn{
		margin: 40rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.order-btn view{
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #F2AB99;
		color: #fff;
		border: 1rpx solid #F2AB99;
		text-align: center;
		border-radius: 50rpx;
		font-size: 28rpx;
	}
	
	.order-btn view.cancle-btn{
		background-color: transparent;
		color: #F2AB99;
		margin-right: 14rpx;
	}
</style>