<template>
	<view>
		<block v-if="activityList.length != 0">
			<view v-for="(item, index) in activityList" :key="index" class="activity-box" @click="cardInfoDetail(item)"
				:class="item.state == 4 ? 'count-down' : ''">
				<view class="store-info">
					<view class="store-img">
						<image :src="item.storeLogo ? item.storeLogo : defaultHead"></image>
					</view>
					<view class="card-right">
						<view class="activity-store">{{item.storeName}}</view>
						<view class="card-num-box">
							<view class="staff-name-box">
								<view class="circle collect-card" v-for="(card, idx) in item.cardArr" :key="idx">
									<image :src="imgUrl + 'collect.png'" mode="widthFix"></image>
								</view>
								<block v-if="(item.cardList.length - item.cardArr.length) > -1">
									<view class="circle"
										v-for="(card, idx) in (item.cardList.length - item.cardArr.length)" :key="idx">
										<image :src="imgUrl + 'noCollect.png'" mode="widthFix"></image>
									</view>
								</block>
								<block v-else>
									<view class="circle" v-for="(card, idx) in item.cardList.length" :key="idx">
										<image :src="imgUrl + 'noCollect.png'" mode="widthFix"></image>
									</view>
								</block>
							</view>
							<view class="load-card">{{item.cardNum}}/{{item.cardList.length}}</view>
						</view>
					</view>
				</view>
				<view class="count-down-time">
					<block v-if="item.state == 4">
						<view>倒计时</view>
						<view><text class="count-down-day">{{item.endDay}}</text>天</view>
					</block>
					<block v-if="item.state == 1">进行中</block>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="empty-box">
				<image :src="imgUrl + 'noCardList.png'" mode="widthFix"></image>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				activityList: [],
				id: '',
				pageIndex: 1,
				pageSize: 20,
				completed: false,
				countDownStoreId: [],
				cardArr: []
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.countDownStoreId = uni.getStorageSync('countDownStoreId') === '' ? [] : uni.getStorageSync(
				'countDownStoreId')
			console.log('countDownStoreId', this.countDownStoreId)
		},
		onShow() {
			this.getUserActivityList()
		},
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex += 1
				that.request({
					url: that.config.userActivity,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						state: 1
					},
				}).then(res => {
					let data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						data.forEach(item => {
							item.cardArr = []
							item.cardNum = 0
							item.cardList.forEach(card => {
								if (card.count != 0) {
									item.cardArr.push(card)
								}
								item.cardNum += card.count
							})
						})
						that.activityList.push(...data)
					}
				})
			}
		},
		// 下拉刷新
		// onPullDownRefresh() {
		// 	this.activityList = []
		// 	this.getStaffs()
		// 	setTimeout(function() {
		// 		uni.stopPullDownRefresh();
		// 	}, 1000);
		// },
		methods: {
			/* 获取用户活动列表 */
			getUserActivityList() {
				let that = this
				that.pageIndex = 1
				that.activityList = []
				that.request({
					url: that.config.userActivity,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						state: 1
					},
				}).then(res => {
					console.log('集卡列表', res)
					let data = res.data.data
					data.forEach(item => {
						item.cardArr = []
						item.cardNum = 0
						item.cardList.forEach(card => {
							if (card.count != 0) {
								item.cardArr.push(card)
							}
							item.cardNum += card.count
						})
					})
					that.activityList = data
				})
			},
			/* 切换店铺 */
			changeStore(item) {
				let that = this
				if (item.state == '4') {
					console.log('111111111')
					// 倒计时活动
					if (that.countDownStoreId.length == 0) {
						console.log('2222222222')
						that.countDownStoreId.push(item.id)
					} else {
						console.log('333333333')
						that.countDownStoreId.forEach(value => {
							if (value != item.id) {
								that.countDownStoreId.push(item.id)
							}
						})
					}
					uni.setStorageSync('countDownStoreId', that.countDownStoreId)
				}
				that.request({
					url: `${that.config.stores}/${item.storeId}`
				}).then(res => {
					console.log('店铺信息', res)
					let storeInfo = res.data.data
					uni.setStorageSync('storeInfo', storeInfo)
					uni.navigateBack()
				})
			},
			/* 游戏详情 */
			cardInfoDetail(item) {
				uni.navigateTo({
					url: '../detail/detail?storeId=' + item.storeId
				})
			}
		}
	}
</script>

<style scoped>
	.activity-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 14rpx 0;
		padding: 32rpx 24rpx;
		color: #333;
		font-size: 28rpx;
		background-repeat: no-repeat;
		background-position: 100% 0;
		background-size: 192rpx;
		background-image: url(https://qiaokun.yuepong.com/hongbei%2FactivityLoading.png);
	}

	.activity-box.count-down {
		background-image: url(https://qiaokun.yuepong.com/hongbei%2FactivityCountDownBg.png);
	}

	.store-info {
		display: flex;
		align-items: center;
		width: 75%;
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

	.card-num-box {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.staff-name-box {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.circle image {
		width: 36rpx;
		height: auto;
		margin-right: 14rpx;
	}

	.load-card {
		margin-left: 14rpx;
	}

	.card-right {
		width: 80%;
	}

	.activity-store {
		color: #333;
		font-size: 28rpx;
		padding-bottom: 20rpx;
	}

	.count-down-time {
		color: #fff;
		font-size: 30rpx;
		text-align: right;
	}

	.count-down-day {
		font-size: 40rpx;
	}
	
	.empty-box image {
		width: 190rpx;
		height: auto;
		display: block;
		margin: 270rpx auto 0;
	}
</style>
