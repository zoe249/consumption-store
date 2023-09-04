<template>
	<view>
		<view class="state-box">
			<image :src="imgUrl + 'pendOrder.png'" mode="widthFix"></image>
			<view class="pend-state">等待处理</view>
			<view class="pend-tip">已提交订单，等待商家处理</view>
		</view>
		<view class="btn" @click="goOrder">我知道了</view>
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
		},
		methods: {
			/* 顾客端订单 */
			goOrder() {
				uni.reLaunch({
					url: './list?orderState=true'
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
	
	.btn{
		margin: 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		border-radius: 50rpx;
	}
</style>