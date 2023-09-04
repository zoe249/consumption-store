<template>
	<view>
		<yp-store-list :storeList="storeList" storeState="进店使用" :redPacket="true" @manageStore="manageStore"
			@storePacket="storePacket"></yp-store-list>
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
				loginState: true,
				pageIndex: 1,
				pageSize: 20,
				completed: false,
				userInfo: {}
			}
		},
		components: {
			ypStoreList
		},
		onLoad() {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {
			this.pageIndex = 1
			this.completed = false
			this.storeList = []
			this.getStoreList()
		},
		methods: {
			/* 获取可以选择的门店 */
			getStoreList() {
				let that = this
				that.request({
					url: `${that.config.customeStoreList}/${that.userInfo.openId}`
				}).then((res) => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						data.forEach(item => {
							if (item.presentBalance != 0) {
								that.storeList.push(item)
							}
						})
					}
				})
			},
			/* 选择店铺管理 */
			manageStore(id) {
				this.storeId = id
				this.getStoreInfo()
			},
			/* 获取门店信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					console.log('门店信息', res)
					let data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					var pages = getCurrentPages()
					var prevPage = pages[pages.length - 2]
					prevPage.$vm.navIdx = 0
					prevPage.$vm.storeId = data.id
					prevPage.$vm.packetAmountState = true
					uni.navigateBack()
				})
			},
			/* 查看红包账户详情 */
			storePacket(id) {
				uni.navigateTo({
					url: './packet?storeId=' + id
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
</style>
