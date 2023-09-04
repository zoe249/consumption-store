<template>
	<view>
		<view class="card-title">
			<view class="time">参与时间</view>
			<view class="card-box">卡片</view>
			<view class="card-type">动作</view>
		</view>
		<view v-for="(item, index) in cardList" :key="index" class="card-detail-box" @click="goCurrentOrder(item)">
			<view class="time">
				<!-- <view class="store-name">{{item.storeName}}</view> -->
				<view class="store-time">{{item.createTime}}</view>
			</view>
			<view class="card-num card-box" :class="item.accountsType == '2' ? 'reduce-num' : ''">
				<view v-if="item.accountsType == '1'">+</view>
				<view v-if="item.accountsType == '2'">-</view>
				<view>{{item.tallyQuantity}}(余{{item.cardRemainNum}})</view>
			</view>
			<view class="card-type">{{item.transactionDetails}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardList: [],
				pageIndex: 1,
				pageSize: 10,
				completed: false
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.getCardDetailList()
		},
		onReachBottom() {
			this.pageIndex++
			this.getCardDetailList()
		},
		methods: {
			getCardDetailList() {
				let that = this
				if (!that.completed) {
					that.request({
						url: that.config.customerCardRecord,
						data: {
							pageIndex: that.pageIndex,
							pageSize: that.pageSize
						}
					}).then(res => {
						console.log('集卡明细', res)
						const data = res.data.data
						if (data.length === 0) {
							that.completed = true
						} else {
							that.cardList.push(...data)
						}
					})
				}
			},
			/* 跳转当前订单 */
			goCurrentOrder(item) {
				if (item.accountsType == 1) {
					// 消费赠卡
					// 跳转订单锚点
					// uni.navigateTo({
					// 	url: '../../custom/order/list?orderId=' + item.orderId + '&orderStatus=' + item.orderStatus
					// })
					// 跳转订单详情
					uni.navigateTo({
						url: '/custom/order/detail?id=' + item.orderId
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
	.card-title {
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 28rpx;
		color: #333;
		margin: 0 24rpx;
	}

	.card-detail-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		margin: 0 24rpx;
		border-bottom: 1rpx solid #ccc;
		font-size: 28rpx;
	}
	
	.store-name{
		font-size: 28rpx;
		color: #333;
	}

	.store-time {
		font-size: 28rpx;
		color: #999;
		padding-top: 16rpx;
	}
	
	.time{
		width: 30%;
		text-align: center;
	}
	
	.card-box{
		width: 30%;
		text-align: center;
	}

	.card-num {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #7CD1F8;
		font-size: 40rpx;
	}

	.card-num.reduce-num {
		color: #F2AB99;
	}
	
	.card-type{
		width: 40%;
		text-align: center;
	}
</style>
