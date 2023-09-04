<template>
	<view>
		<view class="my-card-box">
			<view class="card-tip">我的集卡</view>
			<view class="card-list">
				<view v-for="(card, index) in activityInfo.cardList" :key="index" class="card-box">
					<image :src="card.cardPicture"></image>
					<view class="card-count">{{card.count}}</view>
					<view>{{card.name}}</view>
				</view>
			</view>
		</view>
		<view class="change-btn" @click="goExchangeGoods">去兑换</view>
		<view class="exchange-tip" @click="changeRecordShow">明细</view>
		<view class="exchange-box" v-if="recordShow">
			<view class="lottery-head">
				<view class="exchange-time">时间</view>
				<view class="exchange-num">兑换商品</view>
				<view class="exchange-card">卡片</view>
			</view>
			<view v-for="(record, index) in recordList" :key="index" class="lottery-detail">
				<view class="exchange-time">{{record.createTime}}</view>
				<view class="exchange-num">{{record.productName}}*{{record.productCount}}</view>
				<view class="exchange-card">{{record.cardListCount}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activityId: '', // 活动id
				activityInfo: {},
				recordList: [], // 兑换明细
				recordShow: false,
				storeId: '',
				pageIndex: 1,
				pageSize: 10
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getActivityInfo()
		},
		methods: {
			/* 获取门店进行中的集卡游戏详情 */
			getActivityInfo() {
				let that = this
				that.request({
					url: `${that.config.activityList}/${that.storeId}/detailOfOngoingActivity`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.activityInfo = data
					that.getExchangeRecord()
				})
			},
			/* 获取兑换记录 */
			getExchangeRecord() {
				let that = this
				that.request({
					url: that.config.exchangeRecord,
					data: {
						id: that.activityInfo.id,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log('兑换记录', res)
					that.recordList = res.data.data
				})
			},
			changeRecordShow() {
				this.recordShow = !this.recordShow
			},
			goExchangeGoods() {
				uni.navigateTo({
					url: '../selectExchange/selectExchange?id=' + this.activityInfo.id
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
</style>

<style scoped>
	.my-card-box {
		padding: 20rpx 0;
	}

	.card-tip {
		color: #333;
		font-size: 28rpx;
		padding-left: 24rpx;
	}

	.card-box {
		position: relative;
		margin-right: 60rpx;
		margin-top: 40rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.card-count {
		position: absolute;
		right: -6rpx;
		top: -12rpx;
		background-color: #F2AB99;
		color: #fff;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		font-size: 24rpx;
		text-align: center;
	}
	
	.card-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 0 0 64rpx;
	}

	.card-box image {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		margin-bottom: 8rpx;
		border: 1rpx solid #eee;
		border-radius: 10rpx;
	}
	
	.change-btn {
		margin: 60rpx 24rpx 0;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
	
	.lottery-head {
		display: flex;
		align-items: center;
		text-align: center;
		font-size: 28rpx;
		color: #999;
		padding: 40rpx 0;
	}
	
	.lottery-detail {
		display: flex;
		align-items: center;
		text-align: center;
		padding: 20rpx 0;
	}
	
	.lottery-time {
		width: 40%;
	}
	
	.lottery-num {
		width: 20%;
	}
	
	.lottery-card {
		width: 40%;
	}
	
	.exchange-time {
		width: 40%;
	}
	
	.exchange-num {
		width: 50%;
	}
	
	.exchange-card {
		width: 10%;
	}
	
	.exchange-tip{
		margin: 40rpx 24rpx 0;
		display: block;
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1rpx solid #333;
		color: #333;
		font-size: 28rpx;
		border-radius: 50rpx;
	}
	
	.exchange-box{
		margin: 0 24rpx;
	}
</style>
