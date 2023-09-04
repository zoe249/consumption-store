<template>
	<view>
		<view class="order-state">
			<block v-if="orderInfo.orderStatus == 'pending'">等待商家处理</block>
			<block v-if="orderInfo.orderStatus == 'havePaid'">商家已收款,等待取餐</block>
			<block v-if="orderInfo.orderStatus == 'completed'">交易成功</block>
			<block v-if="orderInfo.orderStatus == 'refunded'">线下退款成功</block>
			<block v-if="orderInfo.orderStatus == '1'">待配送</block>
			<block v-if="orderInfo.orderStatus == '2'">配送中</block>
			<block v-if="orderInfo.orderStatus == 'unpaid'">待支付</block>
			<block v-if="orderInfo.orderStatus == '4'">配送终止</block>
		</view>
		<view class="store-goods">
			<view>{{orderInfo.storeName}}</view>
			<view>
				<view class="goods-box" v-for="(good, idx) in orderInfo.orderItems" :key="idx">
					<view class="goods-img">
						<image :src="good.picture"></image>
						<view class="goods-name">{{good.productName}}</view>
					</view>
					<view class="price-num">
						<view class="goods-price">￥{{good.price}}</view>
						<view>x{{good.quantity}}</view>
					</view>
				</view>
			</view>
			<view class="price-box" v-if="orderInfo.receivingWay == '2'">
				<view>配送费</view>
				<view>￥{{orderInfo.actualDeliveryFee}}</view>
			</view>
			<view class="price-box" v-if="orderInfo.discountPrice != 0">
				<view>消费红包抵扣</view>
				<view class="price">￥-{{orderInfo.discountPrice}}</view>
			</view>
			<view class="total-price-box">合计 ￥{{orderInfo.amountReceived}}</view>
		</view>
		<view class="rule-box" v-if="orderInfo.acquireCardNum != 0">
			<image :src="imgUrl + 'rule.png'" mode="widthFix"></image>
			<view class="rule-desc">
				<block v-if="orderInfo.acquireCardNum == 0">订单商品金额每满<text class="price">{{orderInfo.thresholdValue}}</text>元可获得卡片一张</block>
				<block v-else>您当前订单商品已满<text class="price">{{orderInfo.thresholdValue}}</text>元，可获得<text
						class="price">{{orderInfo.acquireCardNum}}</text>张卡片</block>
			</view>
		</view>
		<view class="order-info-box" v-if="orderInfo.receivingWay == '1'">
			<view class="order-info-title">自提信息</view>
			<view>
				<view class="order-info">
					<view class="order-tip">自提时间</view>
					<view>{{orderInfo.allowTakeTime}}之后</view>
				</view>
				<view class="order-info">
					<view class="order-tip">自提地址</view>
					<view class="ziti-address" @click="location">
						<view>{{orderInfo.address}}</view>
						<image src="../../static/store/local.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="order-info">
					<view class="order-tip">商家联系方式</view>
					<view>{{orderInfo.phone}}</view>
				</view>
			</view>
		</view>
		<view class="order-info-box" v-if="orderInfo.receivingWay == '2'">
			<view class="order-info-title">配送信息</view>
			<view>
				<view class="order-info">
					<view class="order-tip">开始配送时间</view>
					<view>{{orderInfo.presetsDeliveryTime}}</view>
				</view>
				<view class="order-info">
					<view class="order-tip">预计送达时间</view>
					<view>{{orderInfo.allowTakeTime}}</view>
				</view>
				<view class="order-info">
					<view class="order-tip">配送地址</view>
					<view class="order-address">
						<view>{{orderInfo.address}}</view>
						<view class="order-consiger">
							<view>{{orderInfo.consignee}}</view>
							<view>(
								<block v-if="orderInfo.gender == 1">先生</block>
								<block v-if="orderInfo.gender == 2">女士</block>
							)</view>
							<view>{{orderInfo.contact}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-info-box">
			<view class="order-info-title">订单信息</view>
			<view>
				<view class="order-info">
					<view class="order-tip">订单编号</view>
					<view>{{orderInfo.orderNum}}</view>
				</view>
				<view class="order-info">
					<view class="order-tip">下单时间</view>
					<view>{{createTime}}</view>
				</view>
				<view class="order-info">
					<view class="order-tip">支付方式</view>
					<view>{{orderInfo.paymentMethodName}}支付</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				latitude: '',
				longitude: '',
				orderId: '',
				orderInfo: {},
				createTime: ''
			}
		},
		onLoad(options) {
			this.orderId = options.id
			this.getOrderInfo()
		},
		methods: {
			/* 使用应用内置地图查看位置 */
			location() {
				let that = this
				let latitude = parseFloat(that.orderInfo.storeLatitude)
				let longitude = parseFloat(that.orderInfo.storeLongitude)
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function(res) {
						console.log('success')
					}
				})
			},
			/* 获取订单详情 */
			getOrderInfo() {
				let that = this
				that.request({
					url: `${that.config.orderOperation}/${that.orderId}`
				}).then(res => {
					console.log('订单详情', res)
					const data = res.data.data
					that.orderInfo = data
					that.createTime = date.parseTime(Date.parse(data.createTime), "{y}-{m}-{d} {h}:{i}:{s}") 
				})
			}
		}
	}
</script>

<style scoped>
	.order-state {
		margin: 30rpx 24rpx;
		font-size: 40rpx;
	}

	.store-goods {
		margin: 14rpx 24rpx;
		background-color: #fff;
		padding: 30rpx 24rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.goods-box {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.goods-img {
		display: flex;
	}

	.goods-img image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.goods-name {
		padding-top: 20rpx;
	}

	.price-num {
		text-align: right;
		padding-top: 20rpx;
	}

	.goods-price {
		color: #F2AB99;
		padding-bottom: 20rpx;
	}

	.total-price-box {
		display: flex;
		justify-content: flex-end;
	}

	.price-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.rule-box {
		margin: 14rpx 24rpx;
		padding: 30rpx 24rpx;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
	}

	.rule-box image {
		width: 24rpx;
		height: 24rpx;
		margin: 0 10rpx 0 0;
	}

	.card-num {
		color: #F2AB99;
	}

	.order-info-box {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	
	.order-info-title{
		padding: 20rpx 20rpx 0;
		font-weight: 600;
	}

	.order-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.order-tip {
		min-width: 120rpx;
	}

	.order-address {
		font-size: 24rpx;
	}

	.order-consiger {
		display: flex;
		align-items: center;
	}

	.ziti-address {
		display: flex;
		align-items: center;
	}

	.ziti-address image {
		width: 20rpx;
		height: auto;
	}
</style>
