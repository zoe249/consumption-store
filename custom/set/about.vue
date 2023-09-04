<template>
	<view>
		<view class="procedure-box">
			<image :src="imgUrl + 'fresh.png'" mode="widthFix"></image>
			<view>悦小店</view>
		</view>
		<view class="address-manager">
			<view class="address-icon">版本</view>
			<view>0.9.0</view>
		</view>
		<view class="address-manager" @click="goAgreement('userAgreement')">
			<view class="address-icon">用户协议</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
		<view class="address-manager" @click="goAgreement('privacyPolicy')">
			<view class="address-icon">隐私政策</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl
			}
		},
		onLoad() {
			uni.hideShareMenu()
		},
		methods: {
			goAgreement(type) {
				uni.navigateTo({
					url: './agreement?type=' + type
				})
			}
		}
	}
</script>

<style scoped>
	.procedure-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 140rpx 0;
		font-size: 28rpx;
		color: #000;
	}

	.procedure-box image {
		width: 160rpx;
		height: auto;
		margin-bottom: 6rpx;
	}

	.address-manager {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 26rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.address-icon {
		display: flex;
		align-items: center;
		color: #000;
		font-size: 28rpx;
	}
</style>
