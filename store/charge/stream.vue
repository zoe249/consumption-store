<template>
	<view>
		<view class="time-income-box">
			<view class="income-date">
				<block v-if="allStream">全部流水</block>
				<block v-else>{{beginTime}}</block>
			</view>
			<view class="account-stream-box">
				<view>
					<view class="account-num">{{timeRangeCount.totalBalance}}</view>
					<view>结余</view>
				</view>
				<view>
					<view class="account-num">{{timeRangeCount.totalRevenue}}</view>
					<view>收入</view>
				</view>
				<view>
					<view class="account-num">{{timeRangeCount.totalExpenditure}}</view>
					<view>支出</view>
				</view>
			</view>
		</view>
		<view class="time-tab">
			<view v-for="(item, index) in timeList" :key="index" :class="timeIdx == index ? 'active-tab' : ''" @click="changeTime(index)">{{item.name}}</view>
			<!-- <u-tabs :list="timeList" :scrollable="false" lineColor="#F2AB99" :activeStyle="{ color: '#F2AB99' }"
				:current="timeIdx" @click="changeTime"></u-tabs> -->
		</view>
		<view class="stream-detail-box" v-if="streamList.length != 0">
			<block v-for="(item, index) in streamList" :key="index">
				<block v-if="item.streamState">
					<view class="date-income-expend-box" @click="changeStream(item, index)">
						<view class="income-left">
							<view class="date-box">
								<block v-if="timeIdx == 0">
									<view class="day-date">{{item.beginTime.slice(8, 10)}}日</view>
									<view class="month-year">{{item.beginTime.slice(0, 7)}}</view>
								</block>
								<block v-if="timeIdx == 1">
									<view class="day-date">{{item.week}}</view>
									<view class="month-year">{{item.beginTime.slice(0, 4)}}</view>
								</block>
								<block v-if="timeIdx == 2">
									<view class="day-date">{{item.beginTime.slice(5, 7)}}月</view>
									<view class="month-year">{{item.beginTime.slice(0, 4)}}</view>
								</block>
								<block v-if="timeIdx == 3">
									<view class="month-year year-stream">{{item.beginTime.slice(0, 4)}}年</view>
								</block>
							</view>
							<view>
								<view class="surplus-box">
									<view class="surplus-price">￥{{item.totalBalance}}</view>
									<view>结余</view>
								</view>
								<view class="income-expend-price">
									<view><text class="income-tip">收入</text> ￥{{item.totalRevenue}}</view>
									<view class="expend-price-box"><text class="expend-tip">支出</text>
										￥{{item.totalExpenditure}}</view>
								</view>
							</view>
						</view>
						<view>
							<u-icon name="arrow-down" color="#999" size="14"></u-icon>
						</view>
					</view>
					<block v-if="item.show">
						<block v-for="(classify, idx) in classifyList" :key="idx">
							<view class="daily-income-box" @click="getStreamDetail(item, classify, index, idx)">
								<view class="classify-box">
									<image :src="classify.icon" mode="widthFix"></image>
									<view>{{classify.name}}</view>
								</view>
								<view class="classify-total-price"
									:class="classify.accountTitle == 1 ? 'expend-price' : ''">￥{{classify.amount}}
								</view>
							</view>
							<block v-if="classify.show">
								<view class="income-detail-box" v-for="(subItem, sidx) in subClassifyList" :key="sidx">
									<view class="income-detail-time">
										<view>{{subItem.subTime}}</view>
										<view>{{subItem.weekTime}}</view>
									</view>
									<view class="income-detail-right">
										<view class="detail-box" @click="goStreamInfo(subItem, classify, index, idx)">
											<view class="classify-account-box">
												<view class="classify-name">{{subItem.className}}</view>
												<view
													:class="classify.accountTitle == 1 ? 'expend-price' : 'income-price'">
													￥{{subItem.amount}}</view>
											</view>
											<view class="income-detail-remark" v-if="subItem.remark !== ''">
												{{subItem.remark}}
											</view>
											<view class="account-img" v-if="subItem.picture !== ''">
												<image :src="subItem.picture" mode="widthFix">
												</image>
											</view>
											<view class="detail-price-phone">
												<view>
													<block v-if="subItem.accountsType == 1">现金</block>
													<block v-if="subItem.accountsType == 2">微信</block>
													<block v-if="subItem.accountsType == 3">支付宝</block>
													<block v-if="subItem.accountsType == 4">银行卡</block>
												</view>
												<view class="income-phone">{{subItem.bookkeeper}}</view>
												<view>{{subItem.time.slice(11, 16)}}</view>
											</view>
										</view>
									</view>
								</view>
							</block>
						</block>
					</block>
				</block>
			</block>
		</view>
		<view v-if="streamList.length == 0" class="empty-box">
			<image :src="imgUrl + 'detailEmpty.png'" mode="widthFix"></image>
			<view>暂无记录</view>
		</view>
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	import weekDate from '@/common/js/weekDate.js'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				timeList: [{
					name: '天',
					value: 1
				}, {
					name: '周',
					value: 2
				}, {
					name: '月',
					value: 3
				}, {
					name: '年',
					value: 4
				}],
				timeIdx: 0,
				beginTime: '',
				endTime: '',
				storeId: '',
				timeRangeCount: {},
				dateList: [],
				streamList: [],
				index: 0,
				classifyList: [],
				subClassifyList: [],
				weekDateList: [],
				subTime: '',
				weekTime: '',
				streamId: '',
				allStream: false,
				streamInfo: {},
				changeStreamState: false
			}
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.beginTime = options.beginTime
			console.log('开始时间', this.beginTime)
			this.endTime = options.endTime
			if (this.beginTime == undefined) {
				// 全部流水
				this.allStream = true
				let time = new Date()
				let dayTime
				let yearBeginTime = `${time.getFullYear()}-01-01`
				if (time.getDate() < 10) {
					dayTime = '0' + time.getDate()
				} else {
					dayTime = time.getDate()
				}
				let yearEndTime = `${time.getFullYear()}-${time.getMonth() + 1}-${dayTime}`
				console.log(yearBeginTime)
				console.log(yearEndTime)
				this.dateList = this.getDiffDate(yearBeginTime, yearEndTime)
				this.index = this.dateList.length - 1
				let beginTime = this.dateList[this.index]
				let endTime = this.dateList[this.index]
				this.getTimeRangeCount(beginTime, endTime)
				this.getRangeCount(yearBeginTime, `${time.getFullYear()}-12-31`)
			} else {
				// 今日流水
				this.allStream = false
				let beginTime = this.beginTime
				let endTime = this.endTime
				this.getTimeRangeCount(beginTime, endTime)
				this.getRangeCount(beginTime, endTime)
			}
		},
		onPullDownRefresh() {
			this.getChangeTimeInfo()
			if (this.beginTime == undefined) {
				// 全部流水
				let time = new Date()
				let yearBeginTime = `${time.getFullYear()}-01-01`
				this.getRangeCount(yearBeginTime, `${time.getFullYear()}-12-31`)
			} else {
				this.getRangeCount(this.beginTime, this.endTime)
			}
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			// if (this.streamId !== '') {
			// 	this.subClassifyList.forEach((item, i) => {
			// 		if (this.streamId == item.id) {
			// 			this.subClassifyList.splice(i, 1)
			// 		}
			// 	})
			// }
			console.log('编辑修改后的流水', JSON.stringify(this.streamInfo))
			if (JSON.stringify(this.streamInfo) !== '{}') {
				this.streamList[this.streamInfo.index].show = false
				this.classifyList[this.streamInfo.idx].show = false
				this.streamList = []
				this.getChangeTimeInfo()
				// this.getTimeRangeClassify(this.streamInfo.item, this.streamInfo.index)
				if (this.beginTime == undefined) {
					// 全部流水
					let time = new Date()
					let yearBeginTime = `${time.getFullYear()}-01-01`
					this.getRangeCount(yearBeginTime, `${time.getFullYear()}-12-31`)
				} else {
					this.getRangeCount(this.beginTime, this.endTime)
				}
			}
		},
		methods: {
			/* 获取时间段内的账目合计 */
			getRangeCount(beginTime, endTime) {
				let that = this
				that.request({
					url: that.config.timeRangeCount,
					data: {
						storeId: that.storeId,
						beginTime: beginTime,
						endTime: endTime
					}
				}).then(res => {
					console.log('账目合计', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.timeRangeCount = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取时间段内的账目合计 */
			getTimeRangeCount(beginTime, endTime) {
				let that = this
				let beginDate
				let endDate
				that.request({
					url: that.config.timeRangeCount,
					data: {
						storeId: that.storeId,
						beginTime: beginTime,
						endTime: endTime
					}
				}).then(res => {
					console.log('账目合计', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						data.streamState = true
						if (data.totalRevenue == 0 && data.totalExpenditure == 0) {
							// 无流水
							data.streamState = false
						}
						// that.timeRangeCount = data
						data.classifyList = []
						data.show = false
						that.streamList.push(data)
						if (that.timeIdx == 1) {
							data.week = this.weekDateList[this.index].week
						}
						that.index--
						if (that.index > -1) {
							if (that.timeIdx == 0) {
								// 天
								beginDate = this.dateList[this.index]
								endDate = this.dateList[this.index]
							} else if (that.timeIdx == 1) {
								// 周
								beginDate = this.weekDateList[this.index].s
								endDate = this.weekDateList[this.index].e
							}
							that.getTimeRangeCount(beginDate, endDate)
						} else {
							that.changeStreamState = true
							if (JSON.stringify(that.streamInfo) !== '{}') {
								this.getTimeRangeClassify(this.streamInfo.item, this.streamInfo.index)
							}
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取时间范围内收支账目分类 */
			getTimeRangeClassify(item, index) {
				let that = this
				that.classifyList = []
				if (that.streamList[index].show) {
					that.streamList[index].show = false
				} else {
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					that.request({
						url: that.config.timeRangeClassify,
						data: {
							storeId: that.storeId,
							beginTime: that.beginTime,
							endTime: that.endTime
						}
					}).then(res => {
						console.log('总收支数据', res)
						uni.hideLoading()
						if (res.data.code == '200000') {
							const data = res.data.data
							that.streamList.forEach(value => {
								value.show = false
							})
							that.classifyList.push(...data)
							that.streamList[index].show = true
							if (JSON.stringify(that.streamInfo) !== '{}') {
								that.getTimeRangeClassifyInfo(this.streamInfo.sitem, this.streamInfo.index, this
									.streamInfo.idx)
							}
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			/* 获取时间范围内类别明细列表 */
			getTimeRangeClassifyInfo(sitem, index, idx) {
				let that = this
				that.subClassifyList = []
				if (that.classifyList[idx].show) {
					that.classifyList[idx].show = false
				} else {
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					that.request({
						url: that.config.timeRangeClassItems,
						data: {
							storeId: that.storeId,
							beginTime: `${that.beginTime} 00:00:00`,
							endTime: `${that.endTime} 23:59:59`,
							classCode: sitem.code
						}
					}).then(res => {
						uni.hideLoading()
						console.log('类别明细', res)
						if (res.data.code == '200000') {
							const data = res.data.data
							data.forEach((item, i) => {
								item.subTime = `${item.time.slice(5, 7)}月${item.time.slice(8, 10)}日`
								let week = new Date(item.time).getDay()
								if (week == 1) {
									item.weekTime = '周一'
								} else if (week == 2) {
									item.weekTime = '周二'
								} else if (week == 3) {
									item.weekTime = '周三'
								} else if (week == 4) {
									item.weekTime = '周四'
								} else if (week == 5) {
									item.weekTime = '周五'
								} else if (week == 6) {
									item.weekTime = '周六'
								} else if (week == 7) {
									item.weekTime = '周日'
								}
							})
							for (let i = data.length - 1; i > 0; i--) {
								if (data[i].time.slice(0, 10) == data[i - 1].time.slice(0, 10)) {
									data[i].subTime = ''
									data[i].weekTime = ''
								}
							}
							that.classifyList.forEach(value => {
								value.show = false
							})
							that.subClassifyList.push(...data)
							that.classifyList[idx].show = true
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			changeTime(index) {
				if (this.changeStreamState) {
					this.timeIdx = index
					this.changeStreamState = false
					this.getChangeTimeInfo()
				}
			},
			getChangeTimeInfo() {
				this.streamList = []
				this.weekDateList = []
				let beginTime
				let endTime
				let dayTime
				let time = new Date()
				if (this.timeIdx == 0) {
					console.log('天')
					if (this.beginTime == undefined) {
						// 全部流水
						this.allStream = true
						let yearBeginTime = `${time.getFullYear()}-01-01`
						if (time.getDate() < 10) {
							dayTime = '0' + time.getDate()
						} else {
							dayTime = time.getDate()
						}
						let yearEndTime = `${time.getFullYear()}-${time.getMonth() + 1}-${dayTime}`
						this.dateList = this.getDiffDate(yearBeginTime, yearEndTime)
						this.index = this.dateList.length - 1
						beginTime = this.dateList[this.index]
						endTime = this.dateList[this.index]
						this.getTimeRangeCount(beginTime, endTime)
					} else {
						// 今日流水
						this.allStream = false
						let beginTime = this.beginTime
						let endTime = this.endTime
						this.getTimeRangeCount(beginTime, endTime)
					}
				} else if (this.timeIdx == 1) {
					console.log('周')
					// 周
					let year = time.getFullYear()
					let weekDateList = weekDate.setweekOption(year.toString())
					weekDateList.forEach((item, i) => {
						if (time.getTime() < item.sstamp) {} else {
							// 当前时间大于周开始时间
							this.weekDateList.push(item)
						}
					})
					this.index = this.weekDateList.length - 1
					beginTime = this.weekDateList[this.index].s
					endTime = this.weekDateList[this.index].e
					this.getTimeRangeCount(beginTime, endTime)
				} else if (this.timeIdx == 2) {
					console.log('月')
					// 月
					let month = time.getMonth() + 1
					let monthStamp
					let monthDate
					let year = time.getFullYear()
					for (let i = month; i > 0; i--) {
						if (i < 10) {
							i = '0' + i
						}
						monthStamp = Date.parse(new Date(year, i, 0)) // 上月最后一天 中国标准时间转换时间戳
						monthDate = date.parseTime(monthStamp, "{y}-{m}-{d}") // 时间戳转换时间格式
						beginTime = `${year}-${i}-01`
						endTime = monthDate
						this.getTimeRangeCount(beginTime, endTime)
					}
				} else if (this.timeIdx == 3) {
					// 年
					let year = time.getFullYear()
					for (let i = year; i > 1969; i--) {
						beginTime = `${i}-01-01`
						endTime = `${i}-12-31`
						this.getTimeRangeCount(beginTime, endTime)
					}
				}
			},
			getDiffDate(start, end) {
				var startTime = this.getDate(start);
				var endTime = this.getDate(end);
				var dateArr = [];
				let endTimeStamp = endTime.getTime() + 86400000
				while ((endTimeStamp - startTime.getTime()) > 0) {
					var year = startTime.getFullYear();
					var month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth()
						.toString(), 10) + 1) : (startTime.getMonth() + 1);
					var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime
						.getDate();
					dateArr.push(year + "-" + month + "-" + day);
					startTime.setDate(startTime.getDate() + 1);
				}
				return dateArr;
			},
			getDate(datestr) {
				var temp = datestr.split("-");
				if (temp[1] === '01') {
					temp[0] = parseInt(temp[0], 10) - 1;
					temp[1] = '12';
				} else {
					temp[1] = parseInt(temp[1], 10) - 1;
				}
				//new Date()的月份入参实际都是当前值-1
				var date = new Date(temp[0], temp[1], temp[2]);
				return date;
			},
			changeStream(item, index) {
				console.log('切换查看流水', item)
				this.beginTime = item.beginTime
				this.endTime = item.endTime
				this.getTimeRangeClassify(item, index)
			},
			getStreamDetail(item, sitem, index, idx) {
				this.beginTime = item.beginTime
				this.endTime = item.endTime
				this.getTimeRangeClassifyInfo(sitem, index, idx)
			},
			/* 流水详情 */
			goStreamInfo(item, sitem, index, idx) {
				uni.navigateTo({
					url: './record?streamId=' + item.id + '&sitem=' + JSON.stringify(sitem) + '&index=' + index +
						'&idx=' + idx + '&item=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style scoped>
	.time-income-box {
		padding: 26rpx;
		background-color: #fff;
	}

	.income-date {
		font-size: 28rpx;
		color: #666;
		font-weight: 600;
	}

	.account-stream-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 30rpx;
		font-size: 24rpx;
		color: #999;
		text-align: center;
	}

	.account-num {
		color: #333;
		font-size: 40rpx;
		padding-bottom: 16rpx;
	}

	.time-tab {
		background-color: #fff;
		margin: 14rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 80rpx;
	}
	
	.active-tab{
		color: #F2AB99;
	}

	.stream-detail-box {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
	}

	.date-income-expend-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		margin: 0 24rpx;
		border-bottom: 1rpx solid #eee;
	}

	.income-left {
		display: flex;
		align-items: center;
	}

	.date-box {
		font-size: 40rpx;
		color: #333;
		padding-right: 60rpx;
	}

	.month-year {
		color: #999;
		font-size: 24rpx;
		padding-top: 10rpx;
	}

	.year-stream {
		color: #333;
		font-size: 40rpx;
	}

	.surplus-box {
		display: flex;
		align-items: flex-end;
		font-size: 24rpx;
		color: #999;
	}

	.surplus-price {
		color: #333;
		font-size: 40rpx;
		margin-right: 16rpx;
	}

	.income-expend-price {
		display: flex;
		align-items: center;
		color: #999;
		font-size: 24rpx;
		padding-top: 10rpx;
	}

	.income-tip {
		color: #DD5B33;
	}

	.expend-tip {
		color: #62B279;
	}

	.expend-price-box {
		margin-left: 30rpx;
	}

	.daily-income-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		margin: 0 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.classify-box {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		color: #333;
	}

	.classify-box image {
		width: 44rpx;
		height: auto;
		margin-right: 10rpx;
		display: block;
	}

	.classify-total-price {
		color: #DD5B33;
		font-size: 28rpx;
	}

	.expend-price {
		color: #62B279;
	}

	.income-price {
		color: #DD5B33;
	}

	.income-detail-box {
		display: flex;
		padding: 0 22rpx;
		font-size: 24rpx;
		color: #999;
	}

	.income-detail-time {
		text-align: center;
		padding: 20rpx 30rpx 0 0;
		min-width: 130rpx;
		font-size: 28rpx;
		color: #333;
	}

	.income-detail-right {
		width: 78%;
	}

	.detail-box {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.classify-account-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.classify-name {
		color: #333;
		font-size: 28rpx;
	}

	.income-detail-remark {
		padding: 20rpx 0;
	}

	.account-img image {
		width: 120rpx;
		height: 120rpx;
		display: block;
	}

	.detail-price-phone {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0 0;
	}

	.income-phone {
		padding: 0 10rpx;
	}

	.empty-box {
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-top: 260rpx;
	}

	.empty-box image {
		width: 180rpx;
		height: auto;
		margin-bottom: 30rpx;
	}
</style>
