<template>
	<view>
		<view class="store-info" @click="goEditStore">
			<view class="store-box">
				<view class="store-img">
					<image :src="storeInfo.logo == null ? defaultHead : storeInfo.logo"></image>
				</view>
				<view>
					<view>{{storeInfo.name}}</view>
					<view class="store-address">
						<image src="../../static/store/local.png"></image>
						<view>{{storeInfo.state}}{{storeInfo.city}}{{storeInfo.district}}{{storeInfo.address}}</view>
					</view>
				</view>
			</view>
			<view class="store-name-box">
				<image class="store-arrow" src="../../static/store/setArrow.png"></image>
			</view>
		</view>
		<view class="standard-box">
			<view class="standard-manage" @click="storeQrcode">
				<view>店铺小程序码</view>
				<view class="store-name-box">
					<image class="store-arrow" src="../../static/store/setArrow.png"></image>
				</view>
			</view>
			<view class="standard-manage" @click="goAgreement('managementSpec')">
				<view>商户管理规范</view>
				<view class="store-name-box">
					<image class="store-arrow" src="../../static/store/setArrow.png"></image>
				</view>
			</view>
			<view class="standard-manage" @click="goAgreement('operationSpec')">
				<view>商户准入及资质规范</view>
				<view class="store-name-box">
					<image class="store-arrow" src="../../static/store/setArrow.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				storeInfo: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
		},
		onShow() {
			this.getStores()
		},
		methods: {
			getStores() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeInfo.id
				}).then(res => {
					let data = res.data.data
					that.storeInfo = data
				})
			},
			goEditStore() {
				uni.navigateTo({
					url: '../storeInformation/storeInformation'
				})
			},
			goAgreement(type) {
				uni.navigateTo({
					url: '../../custom/set/agreement?type=' + type
				})
			},
			/* 生成小程序码 */
			storeQrcode() {
				uni.navigateTo({
					url: './qrcode?storeId=' + this.storeInfo.id
				})
			}
		}
	}
</script>

<style scoped>
	.store-info {
		background-color: #fff;
		margin: 20rpx 24rpx;
		padding: 26rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* border: 2rpx dashed #F2AB99; */
		border-radius: 10rpx;
	}

	.store-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.store-img {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-name-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.store-arrow {
		width: 8rpx;
		height: 16rpx;
		padding-left: 12rpx;
	}

	.store-address {
		display: flex;
		padding-top: 16rpx;
		font-size: 24rpx;
		color: #999;
	}

	.store-address image {
		width: 24rpx;
		height: 24rpx;
		padding: 4rpx 10rpx 0 0;
	}
	
	.standard-box{
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
	}
	
	.standard-manage{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx;
		font-size: 28rpx;
	}
</style>
