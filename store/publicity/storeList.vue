<template>
	<view>
		<yp-store-list :storeList="storeList" storeState="管理店铺" @manageStore="goStoreDetail"></yp-store-list>
	</view>
</template>

<script>
	import ypStoreList from '@/components/yp-storeList/yp-storeList.vue'
	export default {
		data() {
			return {
				storeList: [], // 选择门店列表数据
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				storeId: '', // 门店id
				pageIndex: 1,
				pageSize: 20,
				completed: false
			}
		},
		components: {
			ypStoreList
		},
		onShow() {
			uni.hideShareMenu()
			this.pageIndex = 1
			this.storeList = []
			this.completed = false
			this.getStoreList()
		},
		onReachBottom() {
			let that = this
			that.pageIndex += 1
			that.getStoreList()
		},
		methods: {
			// 获取可以选择的门店
			getStoreList() {
				let that = this
				if (!that.completed) {
					that.request({
						url: that.config.manageStaffStore,
						data: {
							pageIndex: that.pageIndex,
							pageSize: that.pageSize
						}
					}).then((res) => {
						console.log(res)
						const data = res.data.data
						if (data.length == 0) {
							that.completed = true
						} else {
							that.storeList.push(...data)
						}
					})
				}
			},
			/* 管理店铺 */
			goStoreDetail(id) {
				uni.navigateTo({
					url: './publicity?storeId=' + id
				})
			}
		}
	}
</script>

<style scoped>
	.store-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		color: #333;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1rpx solid #fff;
	}

	.store-box.active-store {
		border: 1rpx solid #F2AB99;
	}

	.store-info-box {
		display: flex;
		align-items: center;
		max-width: 75%;
	}

	.store-img {
		margin-right: 20rpx;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-name {
		font-size: 28rpx;
		margin-bottom: 18rpx;
	}

	.choose-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F2AB99;
		color: #fff;
		font-size: 20rpx;
		height: 48rpx;
		line-height: 48rpx;
		width: 140rpx;
		border-radius: 50rpx;
	}
	
	.save-btn{
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
