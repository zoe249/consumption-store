<template>
	<view>
		<view class="stream-box" @click="goStream('1')">
			<image :src="imgUrl + 'stream.png'" mode=""></image>
			<view>流水</view>
		</view>
		<view class="daily-income" @click="goStream">
			<view>本日收支</view>
			<view class="surplus-box">
				<view class="surplus-tip">结余</view>
				<view>{{parseFloat(timeRangeCount.totalBalance).toFixed(2)}}</view>
			</view>
			<view class="total-income">
				<view>总收入 ￥{{parseFloat(timeRangeCount.totalRevenue).toFixed(2)}}</view>
				<view class="total-expend">总支出 ￥{{parseFloat(timeRangeCount.totalExpenditure).toFixed(2)}}</view>
			</view>
		</view>
		<view class="month-income">
			<view class="month-income-tip">
				<view>本月总收支</view>
				<view class="month-total-price-box">
					<view class="month-total-price">
						<view class="circle"></view>
						<view>总收入 ￥{{totalRevenue.toFixed(2)}}</view>
					</view>
					<view class="month-total-price expend-circle">
						<view class="circle"></view>
						<view>总支出 ￥{{totalExpenditure.toFixed(2)}}</view>
					</view>
				</view>
			</view>
			<yp-business-data type="area" :chartData="timeRangeList"
				:opts="{color: ['#DD5B33', '#62B279'],extra:{area:{gradient:true}},dataPointShape: false, dataLabel: false}">
			</yp-business-data>
		</view>
		<view class="operate-receipt" @click="goStream">
			<view class="daily-income-box">
				<view>日营业收入</view>
				<view class="total-income-price">总收入 <text class="income-price">￥{{parseFloat(timeRangeCount.totalRevenue).toFixed(2)}}</text></view>
			</view>
			<view>
				<view class="operate-receipt-box" v-for="(item, index) in classifyIncome" :key="index">
					<view class="classify-box">
						<image :src="item.icon" mode="widthFix"></image>
						<view>{{item.name}}</view>
					</view>
					<view class="income-price">￥{{item.amount}}</view>
				</view>
			</view>
		</view>
		<view class="operate-receipt" @click="goStream">
			<view class="daily-income-box">
				<view>本日支出</view>
				<view class="total-income-price">总支出 <text class="expend-price">￥{{parseFloat(timeRangeCount.totalExpenditure).toFixed(2)}}</text></view>
			</view>
			<view>
				<view class="operate-receipt-box" v-for="(item, index) in classifyExpend" :key="index">
					<view class="classify-box">
						<image :src="item.icon" mode="widthFix"></image>
						<view>{{item.name}}</view>
					</view>
					<view class="expend-price">￥{{item.amount}}</view>
				</view>
			</view>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="keep-account">
			<view class="keep-box" @click="goRecord"></view>
			<image :src="imgUrl + 'jiyibi.png'" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import ypBusinessData from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				timeRangeList: {
					categories: [],
					series: [{
						name: '',
						data: [],
						legendShape: 'none'
					}, {
						name: '',
						data: [],
						legendShape: 'none'
					}]
				},
				storeId: '',
				beginTime: '',
				endTime: '',
				timeRangeCount: {},
				classifyExpend: [],
				classifyIncome: [],
				totalRevenue: 0,
				totalExpenditure: 0
			}
		},
		components: {
			ypBusinessData
		},
		onShow() {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getTimeRangeCount()
			this.getTimeRangeLineChart()
			this.getTimeRangeClassify()
		},
		methods: {
			/* 获取时间段内的账目合计 */
			getTimeRangeCount() {
				let that = this
				that.beginTime = date.getDateTime().startDate
				that.endTime = date.getDateTime().endDate
				that.request({
					url: that.config.timeRangeCount,
					data: {
						storeId: that.storeId,
						beginTime: that.beginTime,
						endTime: that.endTime
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
			/* 获取时间范围内总收支数据 */
			getTimeRangeLineChart() {
				let that = this
				that.beginTime = date.getMonthDate().startDate
				that.endTime = date.getMonthDate().endDate
				that.timeRangeList.categories = []
				that.timeRangeList.series[0].data = []
				that.timeRangeList.series[1].data = []
				that.totalRevenue = 0
				that.totalExpenditure = 0
				that.request({
					url: that.config.timeRangeLineChart,
					data: {
						storeId: that.storeId,
						beginTime: that.beginTime,
						endTime: that.endTime
					}
				}).then(res => {
					console.log('总收支数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						data.forEach((item, i) => {
							if (i % 4 == 0) {
								item.dateTime = `${item.dateTime.slice(5, 7)}.${item.dateTime.slice(8, 10)}`
							} else {
								item.dateTime = ''
							}
							that.timeRangeList.categories.push(item.dateTime)
							that.timeRangeList.series[0].data.push(item.revenue) // 总收入
							that.timeRangeList.series[1].data.push(item.expenditure) // 总支出
							that.totalRevenue += parseFloat(item.revenue)
							that.totalExpenditure += parseFloat(item.expenditure)
						})
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取时间范围内收支账目分类 */
			getTimeRangeClassify() {
				let that = this
				that.beginTime = date.getDateTime().startDate
				that.endTime = date.getDateTime().endDate
				that.classifyIncome = []
				that.classifyExpend = []
				that.request({
					url: that.config.timeRangeClassify,
					data: {
						storeId: that.storeId,
						beginTime: that.beginTime,
						endTime: that.endTime
					}
				}).then(res => {
					console.log('总收支数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						data.forEach(item => {
							if (item.accountTitle == 1) {
								// 支出
								that.classifyExpend.push(item)
							} else {
								// 收入
								that.classifyIncome.push(item)
							}
						})
						if (that.classifyIncome.length == 0) {
							that.classifyIncome.push({
								icon: 'https://qiaokun.yuepong.com/hongbei/sale.png',
								name: '销售收入',
								amount: '0.00'
							})
						}
						if (that.classifyExpend.length == 0) {
							that.classifyExpend.push({
								icon: 'https://qiaokun.yuepong.com/hongbei/bake.png',
								name: '烘焙原料',
								amount: '0.00'
							})
							that.classifyExpend.push({
								icon: 'https://qiaokun.yuepong.com/hongbei/freshFood.png',
								name: '鲜食饮品',
								amount: '0.00'
							})
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 流水 */
			goStream(type) {
				let url
				if (type == 1) {
					url = './stream'
				} else {
					url = './stream?beginTime=' + this.beginTime + '&endTime=' + this.endTime
				}
				uni.navigateTo({
					url: url
				})
			},
			/* 记一笔 */
			goRecord() {
				uni.navigateTo({
					url: './record'
				})
			}
		}
	}
</script>

<style scoped>
	.stream-box {
		margin: 30rpx 44rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666;
	}

	.stream-box image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		display: block;
		margin-right: 14rpx;
	}

	.daily-income {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
	}

	.surplus-box {
		font-size: 40rpx;
		color: #333;
		padding-top: 40rpx;
		font-weight: normal;
	}

	.surplus-tip {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.total-income {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #999;
		padding-top: 40rpx;
		font-weight: normal;
	}

	.total-expend {
		padding-left: 40rpx;
	}

	.month-income {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 0;
		font-size: 28rpx;
		color: #333;
	}

	.month-income-tip {
		padding: 0 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.month-total-price-box {
		display: flex;
		align-items: center;
		color: #999;
		font-size: 24rpx;
	}

	.month-total-price-box .circle {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background-color: #DD5B33;
		margin-right: 6rpx;
	}
	
	.expend-circle{
		margin-left: 30rpx;
	}

	.expend-circle .circle {
		background-color: #62B279;
	}

	.month-total-price {
		display: flex;
		align-items: center;
	}

	.operate-receipt {
		padding: 30rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		margin: 14rpx 24rpx;
	}

	.daily-income-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 32rpx;
		color: #333;
	}

	.total-income-price {
		color: #999;
	}

	.operate-receipt-box {
		color: #999;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 36rpx;
	}

	.classify-box {
		display: flex;
		align-items: center;
		color: #999;
	}

	.classify-box image {
		width: 46rpx;
		height: auto;
		display: block;
		margin-right: 14rpx;
	}

	.income-price {
		color: #DD5B33;
	}

	.expend-price {
		color: #62B279;
	}

	.keep-account {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: 10rpx;
		background-color: #fff;
	}

	.keep-account image {
		width: 100%;
		height: auto;
		display: block;
	}

	.keep-box {
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		margin-left: -60rpx;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
</style>
