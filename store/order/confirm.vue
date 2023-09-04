<template>
	<view>
		<u-sticky>
			<yp-nav title="订单确认"></yp-nav>
		</u-sticky>
		<view class="store-goods">
			<view class="user-info">
				<view class="user-info-img">
					<image :src="orderInfo.avatar" mode=""></image>
				</view>
				<view>{{orderInfo.nickname}}</view>
			</view>
			<view class="goods-list">
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
			<view class="total-price-box">合计: ￥{{orderInfo.amountReceived}}</view>
		</view>
		<view class="rule-box" v-if="orderInfo.acquireCardNum != 0">
			<image :src="imgUrl + 'rule.png'" mode="widthFix"></image>
			<view class="rule-desc">
				<block v-if="orderInfo.acquireCardNum == 0">订单商品金额每满<text
						class="price">{{orderInfo.thresholdValue}}</text>元可获得卡片一张</block>
				<block v-else>您当前订单商品已满<text class="price">{{orderInfo.thresholdValue}}</text>元，可获得<text
						class="price">{{orderInfo.acquireCardNum}}</text>张卡片</block>
			</view>
		</view>
		<view class="order-info-box" v-if="orderInfo.receivingWay == '1'">
			<view class="order-info">自提信息</view>
			<view>
				<view class="order-info">
					<view class="order-tip">自提时间</view>
					<view>{{orderInfo.allowTakeTime}}之后</view>
				</view>
				<view class="order-info">
					<view class="order-tip">顾客联系方式</view>
					<view>{{orderInfo.phone}}</view>
				</view>
			</view>
		</view>
		<view class="order-info-box" v-if="orderInfo.receivingWay == '2'">
			<view class="order-info">配送信息</view>
			<view>
				<view class="order-info">
					<view class="order-tip">开始配送时间</view>
					<view>{{orderInfo.presetsDeliveryTime}}</view>
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
								)
							</view>
							<view>{{orderInfo.contact}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-info-box">
			<view class="order-info">订单信息</view>
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
					<view>微信支付</view>
				</view>
			</view>
		</view>
		<view class="save-btn" @click="confirmReceiveMoney">确认收款</view>
		<view style="height: 1rpx;"></view>
	</view>
</template>

<script>
	import ypNav from '@/components/yp-nav/yp-nav.vue'
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
			},
			/* 确认收款 */
			confirmReceiveMoney() {
				let that = this
				uni.showModal({
					content: '请确认是否已收款',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍候',
								mask: true
							})
							that.request({
								url: `${that.config.orderOperation}/${that.orderInfo.id}/finish`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json; charset=utf-8',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('完结订单', res)
								uni.hideLoading()
								if (res.data.code == '200000') {
									uni.showToast({
										title: '收款成功',
										icon: 'none'
									})
									setTimeout(() => {
										uni.navigateTo({
											url: './tip'
										})
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.user-info {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		padding: 36rpx 0;
		font-weight: 600;
		border-bottom: 2rpx solid #eee;
	}

	.user-info-img image {
		width: 80rpx;
		height: 80rpx;
		display: block;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.order-state {
		margin: 30rpx 24rpx;
		font-size: 40rpx;
	}

	.store-goods {
		margin: 14rpx 24rpx;
		background-color: #fff;
		padding: 0 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.goods-list{
		padding: 48rpx 0 0;
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
		padding: 30rpx 0;
		font-size: 40rpx;
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
		padding: 0 20rpx;
	}

	.order-info-title {
		padding: 30rpx 0;
		color: #333;
	}

	.order-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		font-size: 28rpx;
		border-bottom: 2rpx solid #eee;
		color: #333;
	}

	.order-tip {
		min-width: 120rpx;
		color: #999;
	}

	.order-address {
		font-size: 24rpx;
		text-align: right;
	}

	.order-consiger {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.ziti-address {
		display: flex;
		align-items: center;
	}

	.ziti-address image {
		width: 20rpx;
		height: auto;
	}

	.save-btn {
		margin: 40rpx auto;
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
		font-size: 28rpx;
		width: 180rpx;
	}
</style>