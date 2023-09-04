<template>
	<view>
		<view class="evaluate-box">
			<view class="evaluate-tip">感谢您的支持</view>
			<view class="evaluate-input">
				<textarea placeholder="请输入您的评价" v-model="evaluate" :placeholder-style="style"></textarea>
			</view>
		</view>
		<view @click="submitEvaluate" class="evaluate-btn">提交评价</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				style: 'color: #ccc; font-size: 28rpx; line-height: 60rpx;',
				evaluate: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
		},
		methods: {
			/* 提交反馈 */
			submitEvaluate() {
				let that = this
				uni.showLoading({
					title: '请稍候',
					mask: true
				})
				that.request({
					url: that.config.userFeedback,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						comment: that.evaluate
					}
				}).then(res => {
					console.log('提交反馈', res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
						setTimeout(() => {
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
	.evaluate-tip {
		margin: 40rpx 44rpx 0;
		color: #000;
		font-weight: 600;
		font-size: 28rpx;
	}

	.evaluate-input {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		margin: 24rpx 20rpx;
		color: #333;
		font-size: 28rpx;
		line-height: 60rpx;
	}

	.evaluate-btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
