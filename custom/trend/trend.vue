<template>
	<view>
		<view class="goods-cont">
			<view v-for="(item, index) in storeRecordList" :key="index" class="goods-box">
				<image src="../../static/custome/circleIcon.png" class="progress-icon"></image>
				<view class="create-time">{{item.createTime}}</view>
				<view class="store-info-box">
					<view class="logo-name-box">
						<view class="store-logo">
							<image :src="item.storeLogo ? item.storeLogo : defaultHead"></image>
						</view>
						<view>
							<view class="business-time-box">
								<view class="store-name">{{item.storeName}}</view>
							</view>
						</view>
						<view class="store-distance">
							<u-icon name="map-fill" color="#ccc" size="12"></u-icon>
							<view v-if="item.deliveryAddress > 1000">{{(item.deliveryAddress / 1000).toFixed(2)}}km</view>
							<view v-else>{{(item.deliveryAddress).toFixed(2)}}m</view>
						</view>
					</view>
					<view class="go-store" @click.stop="getLoginUser(item)">
						<image :src="imgUrl + 'storeIcon.png'" mode="widthFix"></image>
						<view>进店</view>
					</view>
				</view>
				<view class="type-name">
					<block v-if="item.type == 1">
						{{item.typeName}}来喽
					</block>
					<block v-if="item.type == 5">
						新品上新
					</block>
				</view>
				<view class="type-box">
					<view class="goods-img">
						<!-- 上新显示商品卡片图 -->
						<block v-if="item.type == 5">
							<image :src="item.cardPicture" mode="widthFix"></image>
						</block>
						<!-- 明日菜单 -->
						<block v-if="item.type == 1">
							<image :src="item.picture" mode="widthFix"></image>
						</block>
					</view>
					<view class="share-img">
						<button open-type="share" catchtap="share" :id="index">
							<image src="../../static/custome/share.png"></image>
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				storeRecordList: [],
				pageIndex: 1,
				pageSize: 4,
				completed: false,
				customerLongitude: 0,
				customerLatitude: 0
			}
		},
		onShow() {
			let that = this
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that.customerLongitude = res.longitude
					that.customerLatitude = res.latitude
					that.storeRecordList = []
					that.getStoreTrend()
				},
				fail(err) {
					console.log('定位失败', err)
				}
			})
		},
		onShareAppMessage(res) {
			console.log('分享', res.target.id)
			let index = res.target.id
			let title
			let url
			let item = this.storeRecordList[index]
			if (item.type == '1') {
				// 明日菜单
				title = '明日菜单'
				url = '/custom/dailyMenu/dailyMenu?storeId=' + +item.storeId
			} else {
				// 新品上新
				title = '新品上新'
				url = '/custom/home/index/index?storeId=' + item.storeId
			}
			return {
				title: `${item.storeName}-${title}`,
				imageUrl: item.picture,
				path: url
			}
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getStoreTrend()
			}
		},
		methods: {
			/* 店铺动态 */
			getStoreTrend() {
				let that = this
				that.request({
					url: that.config.storeGoodsRecord,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						addressLongitude: that.customerLongitude,
						addressLatitude: that.customerLatitude
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						let time
						let todayDate = new Date().setHours(0, 0, 0, 0) //把今天的日期时分秒设置为00：00：00，返回一个时间戳,
						data.forEach(item => {
							// 判断是否是今天
							time = item.createTime.substring(0, 10)
							let paramsDate = new Date(time).setHours(0, 0, 0,
								0) //给new Date()传入时间，并返回传入时间的时间戳
							let isToday = (todayDate === paramsDate)

							// 是否是昨天
							let testerdayTime = new Date(time).getTime()
							let isYesterday = that.isYesterday(testerdayTime)

							if (isToday) {
								// 日期为今天
								item.createTime = '今天  ' + item.createTime.substring(11, 16)
							} else if (isYesterday) {
								// 日期为昨天
								item.createTime = '昨天  ' + item.createTime.substring(11, 16)
							} else {
								item.createTime = item.createTime.substring(5, 16)
							}
						})
						that.storeRecordList.push(...data)
					}
				})
			},
			isYesterday(time) {
				//昨天
				const date = new Date();
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const today = `${year}/${month}/${day}`;
				const todayTime = new Date(today).getTime(); // 当天凌晨的时间
				const yesterdayTime = new Date(todayTime - 24 * 60 * 60 * 1000).getTime(); // 昨天凌晨的时间
				return time < todayTime && yesterdayTime <= time;
			},
			/* 获取店铺信息 */
			getStoreInfo(item) {
				let that = this
				that.request({
					url: that.config.stores + '/' + item.storeId
				}).then(res => {
					console.log('门店信息', res)
					let data = res.data.data
					uni.setStorageSync('storeInfo', data)
					that.goRecordDetail(item)
				})
			},
			/* 跳转顾客端主页 */
			// goRecordDetail(item) {
			// 	uni.navigateTo({
			// 		url: '../home/index/index?storeId=' + item.storeId
			// 	})
			// },
			/* 获取登录用户信息，跳转顾客端主页 */
			getLoginUser(item) {
				let that = this
				if (uni.getStorageSync('token') === '') {
					// 未登录
					uni.navigateTo({
						url: '../home/index/index?storeId=' + item.storeId
					})
				} else {
					that.request({
						url: that.config.loginUser,
						data: {
							storeId: item.storeId
						}
					}).then(res => {
						if (res.data.code == 200000) {
							let data = res.data.data
							// 缓存用户信息
							uni.setStorageSync('userInfo', data)
							console.log(data, '店圈用户信息')
							uni.navigateTo({
								url: '../home/index/index?storeId=' + item.storeId
							})
						} else {
							uni.showToast({
								title: data.detail,
								icon: 'none'
							})
						}
					})
				}
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
	.goods-cont {
		padding: 32rpx 24rpx;
		color: #333;
	}

	.goods-box {
		padding: 0 0 36rpx 24rpx;
		border-left: 1rpx solid #ccc;
		position: relative;
	}

	.progress-icon {
		position: absolute;
		top: 0;
		left: -12rpx;
		width: 24rpx;
		height: 24rpx;
	}

	.create-time {
		font-size: 24rpx;
	}

	.store-info-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 22rpx;
	}

	.logo-name-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.store-logo {
		margin-right: 20rpx;
	}

	.store-logo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: block;
	}

	.business-time-box {
		display: flex;
		align-items: center;
	}

	.store-name {
		font-weight: 600;
		margin-right: 12rpx;
	}

	.business-time {
		color: #F2AB99;
		font-size: 20rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		width: 80rpx;
		border: 2rpx solid #F2AB99;
		text-align: center;
	}

	.go-store {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #fff;
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #F3B1A0;
		border-radius: 50rpx;
	}
	
	.go-store image {
		width: 26rpx;
		height: 26rpx;
		display: block;
		margin-right: 10rpx;
	}

	.share-img image {
		width: 60rpx;
		height: 60rpx;
	}

	.customer-num {
		font-size: 28rpx;
		color: #999;
		margin-top: 18rpx;
	}

	.type-box {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.share-img button {
		background-color: #fff;
		line-height: unset;
		padding: 0;
	}

	.share-img button::after {
		border: none;
	}

	.type-name {
		font-size: 28rpx;
		color: #333;
		padding: 40rpx 0 20rpx;
	}

	.goods-img image {
		width: 480rpx;
		height: auto;
	}

	.create-time-box {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 24rpx;
		padding-top: 18rpx;
	}

	.time-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 4rpx;
	}

	.time-icon image {
		width: 36rpx;
		height: 36rpx;
	}

	.time {
		line-height: 36rpx;
	}
	
	.store-distance {
		display: flex;
		align-items: center;
		color: #999;
	}
</style>
