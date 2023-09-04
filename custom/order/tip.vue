<template>
	<view>
		<view class="state-box">
			<image src="/static/store/default.png" mode="widthFix"></image>
			<view class="pend-tip">订单生成成功，请将预定图片发送给商家</view>
		</view>
		<view class="btn" @click="goHome">返回首页</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				imgUrl: this.config.imgUrl,
				storeId: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		methods: {
			/* 顾客端首页 */
			goHome() {
				uni.reLaunch({
					url: '/custom/home/index/index?storeId=' + this.storeId
				})
			}
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
		width: 96rpx;
		height: auto;
		display: block;
		margin: 260rpx auto 40rpx;
	}
	
	.pend-state{
		color: #333;
		font-size: 40rpx;
		margin: 36rpx 0 18rpx;
	}
	
	.pend-tip{
		color: #333;
		font-size: 28rpx;
	}
	
	.btn{
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		border-radius: 10rpx;
		width: 400rpx;
		margin: 80rpx auto 0;
	}
</style>