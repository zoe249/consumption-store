<template>
	<view>
		<view class="publicity-box">
			<view class="publicity" v-for="(item, index) in list" :key="index" @click="goStoreSet(item)">
				<view>{{item.name}}</view>
				<u-icon name="arrow-right" color="#666" size="12"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '首页宣传图',
					url: './homePic'
				}, {
					name: '名片背景',
					url: './businessCard'
				}, {
					name: '预定自提',
					url: './pickUp'
				}, {
					name: '送货到家',
					url: './delivery'
				}, {
					name: '明日菜单',
					url: './menu'
				}],
				storeId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
		},
		methods: {
			goStoreSet(item) {
				uni.navigateTo({
					url: item.url + '?storeId=' + this.storeId
				})
			}
		}
	}
</script>

<style scoped>
	.publicity-box {
		margin: 20rpx 24rpx;
		background-color: #fff;
		padding: 0 22rpx;
		border-radius: 10rpx;
	}

	.publicity {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		color: #333;
		font-size: 28rpx;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.publicity:last-child {
		border-bottom: 0;
	}
</style>
