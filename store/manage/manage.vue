<template>
	<view>
		<u-sticky>
			<yp-nav title="管理端"></yp-nav>
		</u-sticky>
		<view class="change-store-box">
			<view class="change-store" @click="changeStore">切换店铺</view>
		</view>
		<view class="manage-box">
			<view v-for="(item, index) in manageList" :key="index" class="manage" @click="goBusiness(item)">
				<view>
					<image :src="item.img"></image>
				</view>
				<view>{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				manageList: [{
					img: '../../static/store/addStore.png',
					name: '店铺管理',
					url: './storeList'
				}, {
					img: '../../static/store/card.png',
					name: '集卡游戏',
					url: '../../activity/activityList/activityList'
				}, {
					img: '../../static/store/manager.png',
					name: '系统管理员',
					url: './managerList'
				}, {
					img: this.config.imgUrl + 'publicity.png',
					name: '宣传管理',
					url: '../publicity/storeList'
				}, {
					img: this.config.imgUrl + 'publicity.png',
					name: '店铺入驻',
					url: '/store/settled/list'
				}]
			}
		},
		onLoad() {
			uni.hideShareMenu()
		},
		methods: {
			goBusiness(item) {
				uni.navigateTo({
					url: item.url
				})
			},
			/* 切换店铺 */
			changeStore() {
				uni.navigateTo({
					url: '../storeList/storeList'
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style scoped>
	.change-store-box {
		background-color: #F4F4F4;
		padding: 20rpx;
		display: flex;
		justify-content: flex-end;
	}

	.change-store {
		width: 162rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1rpx solid #F2AB99;
		color: #F2AB99;
		border-radius: 50rpx;
		font-size: 28rpx;
	}

	.manage-box {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		text-align: center;
		font-size: 24rpx;
		color: #333;
		padding: 0 56rpx;
	}

	.manage {
		width: 160rpx;
		height: 160rpx;
		margin-top: 40rpx;
		background-color: #F4F4F4;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		margin-right: 78rpx;
	}

	.manage:nth-child(3n) {
		margin-right: 0;
	}

	.manage image {
		width: 48rpx;
		height: 48rpx;
		padding-bottom: 18rpx;
	}
</style>
