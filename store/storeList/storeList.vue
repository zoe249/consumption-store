<template>
	<view>
		<yp-store-list :storeList="storeList" storeState="管理店铺" @manageStore="manageStore"></yp-store-list>
	</view>
</template>

<script>
	import ypStoreList from '@/components/yp-storeList/yp-storeList.vue'
	export default {
		data() {
			return {
				storeList: [],
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				storeId: '',
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
		onLoad(options) {
			uni.hideShareMenu()
			this.loginState = options.loginState == 'false' ? false : true
		},
		onShow() {
			this.pageIndex = 1
			this.completed = false
			this.storeList = []
			this.getStoreList()
		},
		onReachBottom() {
			this.pageIndex++
			this.getStoreList()
		},
		methods: {
			/* 获取可以选择的门店 */
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
			// 获取登录用户信息
			getLoginUser() {
				let that = this
				console.log('门店id', that.storeId)
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log('首次获取登录用户信息', res);
					if (res.data.code == 200000) {
						let data = res.data.data
						// 缓存用户信息
						uni.setStorageSync('userInfo', data)
						that.userInfo = data
						console.log(data, '用户信息')
						if (data.roleId == 0) {
							// 无店铺权限
							uni.reLaunch({
								url: '/custom/home/index/index?storeId=' + that.storeId
							})
						} else {
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
							})
						}
					} else {
						// 未登录
						uni.reLaunch({
							url: '../login/login?storeId=' + that.storeId
						})
					}
				})
			},
			/* 选择店铺管理 */
			manageStore(id) {
				this.storeId = id
				this.getLoginUser()
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
