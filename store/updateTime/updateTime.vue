<template>
	<view>
		<view class="open-hours">
			<view class="open-title">营业时间</view>
			<view class="time-box">
				<picker mode="time" :value="openingTime" @change="changeOpenTime">
					<view class="time">{{openingTime}}</view>
				</picker>
				<view class="zhi">—</view>
				<picker mode="time" :value="closingTime" @change="changeCloseTime">
					<view class="time">{{closingTime}}</view>
				</picker>
			</view>
		</view>
		
		<view class="open-week-hours">
			<view class="open-title">营业日期</view>
			<view v-for="(item, index) in timeList" :key="index" class="week-box"
				:class="item.isSelect ? 'week-active' : ''" @click="selectWeek(item)">{{item.value}}</view>
		</view>
		
		<view class="delivery-time">
			<view class="open-title">自提时间(全部商品出炉时间)</view>
			<view class="time-box">
				<picker mode="time" :value="lastExtractionTime" @change="changeLastExtractionTime">
					<view class="time">{{lastExtractionTime}}</view>
				</picker>
			</view>
		</view>
		
		<view class="save-btn" @click="saveStoreTime">保存</view>
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				store: {},
				storeId: '',
				storeInfo: {},
				userInfo: {},
				current: 0,
				openingTime: '',
				closingTime: '',
				timeList: [{
					value: '周一',
					isSelect: false,
					key: '1'
				}, {
					value: '周二',
					isSelect: false,
					key: '2'
				}, {
					value: '周三',
					isSelect: false,
					key: '3'
				}, {
					value: '周四',
					isSelect: false,
					key: '4'
				}, {
					value: '周五',
					isSelect: false,
					key: '5'
				}, {
					value: '周六',
					isSelect: false,
					key: '6'
				}, {
					value: '周日',
					isSelect: false,
					key: '7'
				}],
				businessDay: '', //营业日
				dayOff: '', //休息日
				lastExtractionTime: '' // 最晚提货时间
			}
		},
		onLoad(option) {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			if (this.storeInfo.openingTime == undefined) {
				this.openingTime = '08:00'
				this.closingTime = '20:00'
			} else {
				this.openingTime = this.storeInfo.openingTime
				this.closingTime = this.storeInfo.closingTime
			}
			// 最晚提货时间
			if (this.storeInfo.lastExtractionTime == undefined) {
				// 默认比营业结束时间提前一小时
				let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
				let closingTime = new Date(dateDay + ' ' + this.closingTime)
				this.lastExtractionTime = date.parseTime(Number(closingTime.getTime() - 3600000), "{h}:{i}")
			} else {
				this.lastExtractionTime = this.storeInfo.lastExtractionTime
			}
		},
		onShow() {
			this.getStoreInfo()
		},
		methods: {
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					let data = res.data.data
					that.store = data
					if (data.businessDay !== null) {
						const nowData = data.businessDay.split(',')
						this.timeList.forEach(item => {
							if (nowData.some(itemt => itemt === item.key)) {
								item.isSelect = true
							} else {
								item.isSelect = false
							}
						})
					}
				})
			},
			/* 保存店铺时间设置 */
			saveStoreTime() {
				var that = this
				let data = this.timeList.map(item => {
					if (item.isSelect) {
						return item.key
					}
				})
				data = data.filter(item => item !== undefined)
				this.businessDay = data.join(',')
				data = this.timeList.map(item => {
					if (!item.isSelect) {
						return item.key
					}
				})
				data = data.filter(item => item !== undefined)
				this.dayOff = data.join(',')
				that.request({
					url: `${that.config.stores}/${that.storeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						unionId: that.userInfo.uid,
						openingTime: that.openingTime,
						closingTime: that.closingTime,
						businessDay: that.businessDay,
						dayOff: that.dayOff,
						lastExtractionTime: that.lastExtractionTime
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none',
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			selectWeek(item) {
				item.isSelect = !item.isSelect
			},
			/* 修改店铺开始时间 */
			changeOpenTime(e) {
				console.log(e)
				this.openingTime = e.detail.value
			},
			/* 修改店铺结束时间 */
			changeCloseTime(e) {
				console.log(e)
				this.closingTime = e.detail.value
			},
			/* 修改最晚提货时间 */
			changeLastExtractionTime(e) {
				this.lastExtractionTime = e.detail.value
			}
		}
	}
</script>

<style scoped>
	.open-hours {
		display: flex;
		align-items: center;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 20rpx 24rpx;
	}

	.open-title {
		color: #999;
		font-size: 28rpx;
		padding-right: 36rpx;
		min-width: 108rpx;
		line-height: 64rpx;
	}

	.time-box {
		display: flex;
		align-items: center;
	}

	.time {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		width: 200rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		border-radius: 10rpx;
	}

	.zhi {
		padding: 0 20rpx;
	}

	.open-week-hours {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 20rpx 24rpx;
		font-size: 28rpx;
		color: #999;
	}

	.week-box {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		border: 1rpx solid #999;
		background-color: #EBEBEB;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.week-box.week-active {
		border: 1rpx solid #F2AB99;
		color: #F2AB99;
		background-color: #FCEEEB;
	}

	.week-box:nth-child(5),
	.week-box:nth-child(6),
	.week-box:nth-child(7),
	.week-box:nth-child(8) {
		margin-bottom: 0;
	}

	.save-btn {
		margin: 40rpx 24rpx 0;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}
	
	.delivery-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 20rpx 24rpx;
	}
</style>
