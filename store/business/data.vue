<template>
	<view>
		<view class="business-update-time">
			<view class="open-week-hours">
				<view class="open-title">时间类型</view>
				<view v-for="(item, index) in timeList" :key="index" class="week-box"
					:class="timeIdx == index ? 'week-active' : ''" @click="selectTime(index)">{{item.name}}</view>
			</view>
			<view class="update-time">更新时间：{{updateTime}}</view>
		</view>
		<view class="real-time-data">
			<view class="open-title">实时概况</view>
			<view class="real-time-info">
				<view class="real-time border-right">
					<view>订单总额 (元)</view>
					<view class="order-data-num">{{storeData.orderMoneyCount == null ? '0.00' : (parseFloat(storeData.orderMoneyCount)).toFixed(2)}}
					</view>
				</view>
				<view class="real-time">
					<view>实收金额 (元)</view>
					<view class="order-data-num">{{storeData.orderPayCount == null ? '0.00' : (parseFloat(storeData.orderPayCount)).toFixed(2)}}
					</view>
				</view>
				<view class="real-time border-right" :class="timeIdx != 0 ? 'no-border-real-time' : ''">
					<view>优惠总额 (元)</view>
					<view class="order-data-num">
						{{storeData.orderDiscountCount == null ? '0.00' : (parseFloat(storeData.orderDiscountCount)).toFixed(2)}}
					</view>
				</view>
				<view class="real-time" :class="timeIdx != 0 ? 'no-border-real-time' : ''">
					<view>支付订单数</view>
					<view class="order-data-num">{{storeData.orderCount == null ? 0 : storeData.orderCount}}</view>
				</view>
				<block v-if="timeIdx == 0">
					<view class="real-time border-right">
						<view>支付客户数</view>
						<view class="order-data-num">
							{{storeData.payCustomerCount == null ? 0 : storeData.payCustomerCount}}
						</view>
					</view>
					<view class="real-time">
						<view>访客数</view>
						<view class="order-data-num">
							{{storeData.storeCustomerCount == null ? 0 : storeData.storeCustomerCount}}
						</view>
					</view>
					<view class="real-time border-right no-border-real-time">
						<view>新客数</view>
						<view class="order-data-num">
							{{storeData.storeNewCustomerCount == null ? 0 : storeData.storeNewCustomerCount}}
						</view>
					</view>
				</block>
			</view>
		</view>
		<view v-if="timeIdx == 1 || timeIdx == 2" class="real-time-data">
			<view class="open-title">客户</view>
			<view class="real-time-info">
				<view class="real-time border-right">
					<view>访客数</view>
					<view class="order-data-num">
						{{storeData.storeCustomerCount == null ? 0 : storeData.storeCustomerCount}}
					</view>
				</view>
				<view class="real-time">
					<view>支付客户数</view>
					<view class="order-data-num">{{storeData.payCustomerCount == null ? 0 : storeData.payCustomerCount}}
					</view>
				</view>
				<view class="real-time border-right">
					<view>新增客户</view>
					<view class="order-data-num">
						{{storeData.storeNewCustomerCount == null ? 0 : storeData.storeNewCustomerCount}}
					</view>
				</view>
				<view class="real-time">
					<view>复购客户</view>
					<view class="order-data-num">
						{{storeData.orderPayStoreCustomerCount == null ? 0 : storeData.orderPayStoreCustomerCount}}
					</view>
				</view>
				<view class="real-time border-right no-border-real-time">
					<view>客单价 (元)</view>
					<view class="order-data-num">
						{{storeData.customerOrderPrice == null ? '0.00' : (parseFloat(storeData.customerOrderPrice)).toFixed(2)}}
					</view>
				</view>
			</view>
		</view>
		<view class="real-time-data">
			<view class="revenue-trend-box">
				<view>收入趋势</view>
				<view v-if="timeIdx == 0" class="revenue-trend-switch">
					<view class="efficient-trend">有效收入趋势</view>
					<u-switch v-model="payZeroState" @change="changeOrderPayState"></u-switch>
				</view>
			</view>
			<view class="charts-box">
				<yp-business-data type="line" :chartData="orderPayData"
					:opts="{dataPointShape: false, dataLabel: false}"></yp-business-data>
			</view>
		</view>
		<block v-if="timeIdx == 1 ||timeIdx == 2">
			<view class="real-time-data">
				<view class="revenue-trend-box">新老客户成交分析</view>
				<view class="charts-box">
					<yp-business-data type="ring"
						:opts="{legend:{position: 'bottom'},title:{name: '客户数', color: '#fff', fontSize: 14},subtitle:{name: customeNum, color: '#fff', fontSize: 14},extra:{ring:{ringWidth: 60,linearType:'none',centerColor:'#FE9494',border: false}}}"
						:chartData="newOldCustomData" />
				</view>
			</view>
			<view class="real-time-data">
				<view class="revenue-trend-box">新增客户趋势</view>
				<view class="charts-box">
					<yp-business-data type="line" :chartData="newCustomeData"></yp-business-data>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import ypBusinessData from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				timeIdx: 0,
				timeList: [{
					name: '实时',
					isSelect: true
				}, {
					name: '本周',
					isSelect: false
				}, {
					name: '本月',
					isSelect: false
				}],
				updateTime: '',
				orderPayData: {
					categories: [],
					series: [{
						name: '',
						data: [],
						legendShape: 'none'
					}]
				},
				payZeroState: false, // 是否排除0的数据
				beginTime: '',
				endTime: '',
				storeId: '',
				storeData: {},
				newOldCustomData: {
					series: [{
						data: [{
							name: '老客户',
							value: 20
						}, {
							name: '新客户',
							value: 8
						}]
					}]
				},
				customeNum: 0,
				newCustomeData: {
					categories: [],
					series: [{
						name: '',
						data: [],
						legendShape: 'none'
					}]
				},
				firstWeek: 0,
				endWeek: 0
			}
		},
		components: {
			ypBusinessData
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.beginTime = date.getDateTime().startDate
			this.endTime = date.getDateTime().endDate
			this.updateTime = date.getDateTime().updateTime
			this.getStoreOrderData()
			this.getRealTimeOrderLineData()
		},
		methods: {
			/* 店铺今日数据 */
			getStoreOrderData() {
				let that = this
				that.request({
					url: `${that.config.dataCount}?beginTime=${that.beginTime}&endTime=${that.endTime}&storeId=${that.storeId}`
				}).then(res => {
					console.log('店铺今日数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.storeData = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取实时店铺收入折线图数据 */
			getRealTimeOrderLineData() {
				let that = this
				this.orderPayData.categories = []
				this.orderPayData.series[0].data = []
				that.request({
					url: that.config.payDataHour,
					data: {
						storeId: that.storeId,
						payZeroState: that.payZeroState,
						beginTime: that.beginTime,
						endTime: that.endTime
					}
				}).then(res => {
					console.log('店铺收入折线图数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						data.forEach((item, i) => {
							if (i % 4 == 0) {
								item.time = item.time.slice(11, 13) + ':00'
							} else {
								item.time = ''
							}
							that.orderPayData.categories.push(item.time)
							that.orderPayData.series[0].data.push(item.payCount)
						})
					}
				})
			},
			/* 获取店铺收入折线图数据 */
			getOrderLineData() {
				let that = this
				this.orderPayData.categories = []
				this.orderPayData.series[0].data = []
				let week = 0
				that.request({
					url: that.config.orderLineChart,
					data: {
						storeId: that.storeId,
						payZeroState: that.payZeroState,
						beginTime: that.beginTime,
						endTime: that.endTime
					}
				}).then(res => {
					console.log('店铺收入折线图数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						if (that.timeIdx == 2) {
							for (let i = that.firstWeek; i < that.endWeek; i++) {
								that.orderPayData.categories.push('第' + i + '周')
								let count = 0
								console.log('week', week)
								for (let j = 7 * week; j < 7 * (week + 1); j++) {
									count += data[j].payCount
								}
								that.orderPayData.series[0].data.push(count)
								week++
							}
						} else {
							data.forEach(item => {
								// 本周
								let time = item.time.slice(5, 10)
								that.orderPayData.categories.push(time)
								that.orderPayData.series[0].data.push(item.payCount)
							})
						}
					}
				})
			},
			/* 切换实时收入趋势 */
			changeOrderPayState(e) {
				console.log('改变开关', e)
				this.payZeroState = e
				this.getRealTimeOrderLineData()
			},
			/* 选择时间 */
			selectTime(index) {
				this.timeIdx = index
				if (index == 0) {
					// 今日
					this.beginTime = date.getDateTime().startDate
					this.endTime = date.getDateTime().endDate
					this.updateTime = date.getDateTime().updateTime
					this.getRealTimeOrderLineData()
				} else if (index == 1) {
					// 本周
					this.beginTime = date.getWeekDate().startDate
					this.endTime = date.getWeekDate().endDate
					this.updateTime = this.beginTime + '至' + this.endTime
					this.getStoreCustomData()
					this.getNewCustomeData()
					this.getOrderLineData()
				} else if (index == 2) {
					// 本月
					this.beginTime = date.getMonthDate().startDate
					this.endTime = date.getMonthDate().endDate
					this.updateTime = this.beginTime + '至' + this.endTime
					this.getStoreCustomData()
					this.getNewCustomeData()
					var dateTime = new Date()
					let year = dateTime.getFullYear()
					let month = dateTime.getMonth() + 1
					month = month < 10 ? '0' + month : month
					let monthFirstDay = `${year}-${month}-01`
					let monthEndDay = `${year}-${month}-28`
					this.firstWeek = this.getWeekNum(monthFirstDay).slice(4, 6)
					this.endWeek = this.getWeekNum(monthEndDay).slice(4, 6)
					this.getOrderLineData()
					console.log('firstWeek', this.firstWeek)
					console.log('endWeek', this.endWeek)
				}
				this.getStoreOrderData()
			},
			/* 获取店铺新老客户成交分析数据 */
			getStoreCustomData() {
				let that = this
				this.newOldCustomData.series[0].data = []
				that.request({
					url: that.config.payCustomer,
					data: {
						storeId: that.storeId,
						beginTime: that.beginTime,
						endTime: that.endTime
					}
				}).then(res => {
					console.log('店铺新老客户成交分析数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						let num = 0
						if (data.length != 0) {
							data.forEach(item => {
								if (item.orderCustomerAttribute == 0) {
									item.orderCustomerAttribute = '新客'
								} else if (item.orderCustomerAttribute == 1) {
									item.orderCustomerAttribute = '老客'
								}
								this.newOldCustomData.series[0].data.push({
									name: item.orderCustomerAttribute,
									value: item.count
								})
								num = parseFloat(num) + item.count
							})
						} else {
							num = '0'
						}
						that.customeNum = num
					}
				})
			},
			/* 获取客户新增趋势数据 */
			getNewCustomeData() {
				let that = this
				this.newCustomeData.categories = []
				this.newCustomeData.series[0].data = []
				let week = 0
				that.request({
					url: that.config.newCustomer,
					data: {
						storeId: that.storeId,
						beginTime: that.beginTime,
						endTime: that.endTime
					}
				}).then(res => {
					console.log('获取客户新增趋势数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						// 本月
						if (that.timeIdx == 2) {
							for (let i = that.firstWeek; i < that.endWeek; i++) {
								that.newCustomeData.categories.push('第' + i + '周')
								let count = 0
								console.log('week', week)
								for (let j = 7 * week; j < 7 * (week + 1); j++) {
									count += data[j].count
								}
								that.newCustomeData.series[0].data.push(count)
								week++
							}
						} else {
							data.forEach(item => {
								that.newCustomeData.categories.push(item.dateDay.slice(5, 11))
								that.newCustomeData.series[0].data.push(item.count)
							})
						}
						console.log('newCustomeData', that.newCustomeData)
					}
				})
			},
			/* 获取本月周数 */
			getWeekNum(date) {
				var dateTime = new Date(date)
				// 获取从1970年到现在的时间毫秒数
				var temp_ms = dateTime.getTime();
				let temptTime = new Date(temp_ms);
				// 今天周几，如果是周日，则设为7
				let weekday = temptTime.getDay() & 7;
				// 周1+5天=周六，得到本周6的日期,之所以以每周末的日期为基准，不能用每周日的日期为基准来计算
				// 当前日期的周六的日期
				temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);
				// 每年的第一天，年/1/1，参数之中，0代表月份，介于0(1月) ~11(12月)之间的整数，getDay获取星期几同理
				// 第一天的日期
				let firstDay = new Date(temptTime.getFullYear(), 0, 1);
				let dayOfWeek = firstDay.getDay();
				let spendDay = 1;
				// 如果第一天不是星期日，那么就找到下一个星期日作为开始
				if (dayOfWeek != 0) {
					spendDay = 7 - dayOfWeek + 1;
				}
				let yearOfW = temptTime.getFullYear();
				firstDay = new Date(yearOfW, 0, 1 + spendDay);
				/*
				1.Math.ceil 取大于等于所给值的最小整数
				2.86400000是换算到天的基数，js的时间差值为时间戳，即毫秒数
				  1000毫秒 * 60秒 * 60分钟* 24小时 = 86400000
				3.temptTime是当前日期，firstDay是当年第一天，周数计算公式就是（当前日期-第一天天数）/7 就是本年的第几周
				4.d是差距天数，res是周数
				*/
				let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
				let res = Math.ceil(d / 7) + 1;
				let weekOfNow = firstDay.getFullYear().toString() + res.toString();
				console.log('weekOfNow', weekOfNow)
				return weekOfNow
				this.processX(weekOfNow)
			},
			processX(xdata) {
				if (xdata.length == 5) {
					xdata = xdata.slice(0, 4) + '0' + xdata.slice(4);
				}
				console.log('xdata', xdata)
				return xdata;
			}
		}
	}
</script>

<style scoped>
	.business-update-time {
		padding: 30rpx 20rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 14rpx 24rpx;
		font-size: 28rpx;
		color: #999;
	}

	.open-week-hours {
		display: flex;
		align-items: center;
	}

	.open-title {
		font-weight: 600;
		font-size: 28rpx;
		color: #333;
	}

	.week-box {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		background-color: #ddd;
		text-align: center;
		color: #999;
		margin-left: 20rpx;
	}

	.week-box.week-active {
		color: #fff;
		background-color: #F2AB99;
	}

	.update-time {
		color: #999;
		font-size: 28rpx;
		padding-top: 30rpx;
	}

	.real-time-data {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
	}

	.real-time-info {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 50rpx;
	}

	.real-time {
		width: 46%;
		text-align: left;
		color: #999;
		font-size: 24rpx;
		position: relative;
		padding: 40rpx 0 40rpx 20rpx;
	}

	.real-time::after {
		content: '';
		width: 100%;
		border-bottom: 1rpx solid #ccc;
		transform: scaleY(0.16);
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.real-time.border-right::before {
		content: '';
		height: 166rpx;
		border-right: 1rpx solid #ccc;
		transform: scaleX(0.16);
		position: absolute;
		top: 0;
		right: 0;
	}

	.real-time:nth-child(1),
	.real-time:nth-child(2) {
		padding-top: 0;
	}

	.real-time.no-border-real-time::after {
		border-bottom: 0;
	}

	.order-data-num {
		color: #333;
		font-size: 40rpx;
	}

	.revenue-trend-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		font-weight: 600;
	}

	.efficient-trend {
		color: #999;
		font-weight: normal;
		margin-right: 14rpx;
	}

	.revenue-trend-switch {
		display: flex;
		align-items: center;
		color: #999;
	}

	.revenue-trend-switch>>>.u-switch {
		background-color: #fff !important;
		border: 4rpx solid #333 !important;
		width: 72rpx !important;
		height: 46rpx !important;
	}

	.revenue-trend-switch>>>.u-switch__bg {
		background-color: #fff !important;
	}

	.revenue-trend-switch>>>.u-switch__node {
		background-color: #ccc;
		width: 30rpx !important;
		height: 30rpx !important;
		box-shadow: unset !important;
		transform: translateX(-8rpx) !important;
	}

	.revenue-trend-switch>>>.u-switch__node.u-switch__node--on {
		background-color: #F2AB99;
		transform: translateX(-30rpx) !important;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
