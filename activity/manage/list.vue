<template>
	<view>
		<block v-for="(item, index) in activityList" :key="index">
			<view class="activity-box" v-if="item.state != '3'" :class="item.state == '4' ? 'count-activity' : ''">
				<view class="activity-info">
					<view class="state-name">
						<view>{{item.storeName}}</view>
						<view class="status"
							:class="[item.state == 0 ? 'nostart' : '', item.state == 2 ? 'finish' : '']">
							{{item.stateName}}</view>
					</view>
					<view class="activity-time">{{item.beginDate}}-{{item.endDate}}</view>
					<view class="activity-time" v-if="item.state == 2">提前结束时间：{{item.endEarlyTime}}</view>
				</view>
				<view class="rule-count-down">
					<view class="relu-set" @click="goActivityDetail(item)">
						<view>查看详情</view>
						<image :src="imgUrl + 'arrow.png'" mode=""></image>
					</view>
					<view class="count-down-time" v-if="item.state == '4'">
						<view>倒计时</view>
						<view><text class="count-down-day">{{item.endDay}}</text>天</view>
					</view>
				</view>
			</view>
		</block>
		<view v-if="activityList.length == 0" class="empty-box">
			<image :src="imgUrl + 'empty.png'" mode="widthFix"></image>
			<view>暂无活动</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				activityList: [],
				completed: false,
				pageIndex: 1,
				pageSize: 20,
				name: '',
				storeId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
		},
		onShow() {
			this.getActivityList()
		},
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex++
				that.request({
					url: that.config.activityList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						name: that.name,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						data.forEach(item => {
							item.beginDate = item.beginDate.slice(0, 11)
							item.endDate = item.endDate.slice(0, 11)
						})
						that.activityList.push(...data)
					}
				})
			}
		},
		methods: {
			getActivityList() {
				let that = this
				that.request({
					url: that.config.activityList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						name: that.name,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					data.forEach(item => {
						item.beginDate = item.beginDate.slice(0, 11)
						item.endDate = item.endDate.slice(0, 11)
					})
					that.activityList = data
				})
			},
			/* 搜索活动 */
			searchGoods() {
				this.completed = false
				this.getActivityList()
			},
			/* 跳转活动详情 */
			goActivityDetail(item) {
				uni.navigateTo({
					url: './detail?id=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.activity-box {
		background-color: #fff;
		margin: 14rpx 0;
		padding: 40rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	}
	
	.activity-box.count-activity {
		background-image: url(https://qiaokun.yuepong.com/hongbei%2FactivityCountDownBg.png);
		background-repeat: no-repeat;
		background-position: 100% 0;
		background-size: 192rpx;
	}

	.state-name {
		display: flex;
		align-items: center;
	}

	.status {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #7CD1F8;
		border: 1rpx solid #7CD1F8;
		background-color: #E5F6FE;
		font-size: 20rpx;
		margin-left: 20rpx;
	}

	.status.nostart {
		color: #FFC263;
		border: 1rpx solid #FFC263;
		background-color: #FFF3E0;
	}

	.status.finish {
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
		background-color: #FCEEEB;
	}

	.activity-time {
		color: #999;
		margin-top: 20rpx;
	}
	
	.rule-count-down {
		display: flex;
		align-items: center;
	}

	.relu-set {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

	.relu-set image {
		width: 16rpx;
		height: 16rpx;
		margin-left: 6rpx;
	}
	
	.count-down-time {
		color: #fff;
		font-size: 30rpx;
		padding-left: 90rpx;
		text-align: right;
	}
	
	.count-down-day {
		font-size: 40rpx;
	}
	
	.empty-box{
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-top: 260rpx;
	}
	
	.empty-box image{
		width: 96rpx;
		height: auto;
		margin-bottom: 30rpx;
	}
</style>
