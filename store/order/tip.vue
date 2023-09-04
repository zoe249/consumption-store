<template>
	<view>
		<view class="state-box">
			<image :src="imgUrl + 'orderConfirm.png'" mode="widthFix"></image>
			<view class="pend-tip">订单接收成功</view>
		</view>
		<view class="btn" @click="goManageHome">返回管理端</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				imgUrl: this.config.imgUrl
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		methods: {
			/* 管理端 */
			goManageHome() {
				uni.reLaunch({
					url: '/store/storeHomepage/storeHomepage?storeId=' + this.storeId
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