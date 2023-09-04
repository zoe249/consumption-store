<template>
	<view>
		<view class="order-info" v-for="(item, index) in list" :key="index">
			<view class="delivery-goods-box">
				<view class="delivery-state" v-if="item.receivingWay == '2'">送货到家</view>
				<view class="delivery-state ziti-state" v-if="item.receivingWay == '1'">预定自提</view>
				<view v-if="item.orderStatus != 'pending' && item.receivingWay == '2'">#{{item.deliveryNum}}</view>
			</view>
			<view class="order-info-box">
				<view class="store-info-box">
					<view class="store-img">
						<image :src="item.avatar" mode=""></image>
						<view>{{item.nickname}}</view>
					</view>
					<view class="order-state">
						<block v-if="item.orderStatus == 'pending'">等待处理</block>
						<block v-if="item.orderStatus == 'havePaid'">等待顾客取餐</block>
						<block v-if="item.orderStatus == 'completed'">交易成功</block>
						<block v-if="item.orderStatus == 'refunded'">线下退款成功</block>
						<block v-if="item.orderStatus == '1'">待配送</block>
						<block v-if="item.orderStatus == '2'">配送中</block>
						<block v-if="item.orderStatus == '4'">配送终止</block>
					</view>
				</view>
				<!-- 配送单 -->
				<block v-if="item.receivingWay == '2'">
					<view class="store-info-box">
						<view class="order-left order-address">配送地址</view>
						<view>{{item.address}}</view>
					</view>
					<view class="store-info-box">
						<view class="phone-box">
							<view class="order-left">联系人</view>
							<view>{{item.consignee}}
								<block v-if="item.gender == '1'">先生</block>
								<block v-if="item.gender == '2'">女士</block>
							</view>
						</view>
						<view class="symbol">|</view>
						<view class="phone-box">
							<view class="order-left">手机</view>
							<view class="phone-icon" @click="callPhone(item)">
								<image :src="imgUrl + 'orderPhone.png'" mode=""></image>
								<view>{{item.contact}}</view>
							</view>
						</view>
					</view>
					<view class="delivery-time">
						<view class="order-left">配送时间</view>
						<view>{{item.allowTakeTime}}</view>
					</view>
				</block>
				<!-- 自提单 -->
				<block v-if="item.receivingWay == '1'">
					<view class="store-info-box">
						<view class="phone-box">
							<view class="order-left">手机</view>
							<view class="phone-icon" @click="callPhone(item)">
								<image :src="imgUrl + 'orderPhone.png'" mode=""></image>
								<view>{{item.phone}}</view>
							</view>
						</view>
						<view class="symbol">|</view>
						<view class="phone-box">
							<view class="order-left">取餐时间</view>
							<view>{{item.allowTakeTime}}之后</view>
						</view>
					</view>
				</block>
				<view class="goods-cont">
					<block v-for="(goods, idx) in item.orderItems" :key="idx">
						<block v-if="idx < 3">
							<view class="goods-box">
								<view class="goods-img">
									<image :src="goods.picture"></image>
									<view class="goods-name">{{goods.productName}}</view>
								</view>
								<view class="price-num">
									<view class="goods-price">￥{{goods.price}}</view>
									<view>x{{goods.quantity}}</view>
								</view>
							</view>
						</block>
						<block v-if="item.unfoldGoodsShow">
							<view class="goods-box" v-if="idx > 2">
								<view class="goods-img">
									<image :src="goods.picture"></image>
									<view class="goods-name">{{goods.productName}}</view>
								</view>
								<view class="price-num">
									<view class="goods-price">￥{{goods.price}}</view>
									<view>x{{goods.quantity}}</view>
								</view>
							</view>
						</block>
					</block>
		
					<view class="store-info-box delivery-fee" v-if="item.receivingWay == '2'">
						<view>配送费</view>
						<view>￥{{item.actualDeliveryFee}}</view>
					</view>
					<view class="store-info-box delivery-fee" v-if="item.discountPrice != 0">
						<view>消费红包抵扣</view>
						<view>￥{{item.discountPrice}}</view>
					</view>
					<block v-if="item.orderItems.length > 3">
						<view class="unfold-goods" v-if="!item.unfoldGoodsShow" @click="unfoldGoods(item)">
							<view class="unfold-goods-btn">展开剩余{{item.orderItems.length - 3}}件</view>
						</view>
					</block>
				</view>
				<view class="store-info-box card-num" v-if="item.acquireCardNum !== 0">
					<view>顾客获得卡片</view>
					<view>{{item.acquireCardNum}}张</view>
				</view>
				<view class="store-info-box">
					<view class="order-left">预定方式</view>
					<view>{{item.paymentMethodName}}支付</view>
				</view>
				<view class="store-info-box" v-if="item.paymentMethod == 1">
					<view class="order-left">储值卡手机号</view>
					<view>{{item.valueCardCode}}</view>
				</view>
				<view class="store-info-box">
					<view class="order-left">订单编号</view>
					<view>{{item.orderNum}}</view>
				</view>
				<view class="store-info-box">
					<view class="order-left">下单时间</view>
					<view>{{item.createTime}}</view>
				</view>
				<view class="submit-order-box">
					<view class="total-price-box">
						<text>合计：</text>
						<text class="total-price">￥{{item.amountReceived}}</text>
					</view>
					<view class="order-btn" v-if="!tomorrowOrder">
						<!-- 待处理订单 -->
						<block v-if="item.orderStatus == 'pending'">
							<view class="submit-order" @click="confirmReceiveMoney(item)">确认收款</view>
						</block>
						<!-- 收款完成 -->
						<block
							v-if="item.orderStatus == 'havePaid' || item.orderStatus == '1' || item.orderStatus == '2'">
							<!-- <view class="submit-order refunded" @click="orderPayRefund(item)">退款</view> -->
							<view class="submit-order refunded" @click="storeOrderRefund(item)">退款</view>
							<!-- 自提订单可操作订单完成 -->
							<view class="submit-order" @click="orderFinish(item)" v-if="item.receivingWay == '1'">
								订单完成</view>
						</block>
						<!-- 配送终止 -->
						<block v-if="item.orderStatus == '4'">
							<view class="submit-order refunded" @click="storeOrderRefund(item)">退款</view>
							<view class="submit-order" @click="orderFinish(item)">订单完成</view>
						</block>
						<!-- 已完成-退款成功 -->
						<block v-if="item.orderStatus == 'refunded'">
							<view class="submit-order have-paid">退款成功</view>
						</block>
						<!-- 收款完成 待配送或配送中订单 -->
						<block v-if="item.orderStatus == '1' || item.orderStatus == '2'">
							<view class="submit-order have-paid" @click="cancleDelivery(item)">取消配送</view>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				imgUrl: this.config.imgUrl,
				list: []
			}
		},
		props: {
			orderList: Array,
			isPay: Boolean,
			tomorrowOrder: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			orderList() {
				console.log('改变')
				this.list = this.orderList
			}
		},
		mounted() {
			this.list = this.orderList
		},
		methods: {
			/* 确认收款 */
			confirmReceiveMoney(item) {
				this.$emit('confirmReceiveMoney', item)
			},
			/* 退款 */
			orderRefund(item) {
				this.$emit('orderRefund', item)
			},
			unfoldGoods(item) {
				console.log('11111', item)
				this.$emit('unfoldGoods', item)
			},
			/* 订单完成 */
			orderFinish(item) {
				this.$emit('orderFinish', item)
			},
			/* 微信退款 */
			orderPayRefund(item) {
				this.$emit('orderPayRefund', item)
			},
			/* 判断退款 */
			storeOrderRefund(item) {
				if (this.isPay) {
					// 微信支付退款
					console.log('微信退款')
					this.orderPayRefund(item)
				} else {
					// 线下退款
					console.log('线下退款')
					this.orderRefund(item)
				}
			},
			/* 取消配送 */
			cancleDelivery(item) {
				this.$emit('cancleDelivery', item)
			},
			/* 拨打电话 */
			callPhone(item) {
				console.log('拨打电话')
				this.$emit('callPhone', item)
			}
		}
	}
</script>

<style scoped>
	.order-info {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.order-info-box {
		padding: 0 20rpx;
	}
	
	.store-info-box.delivery-fee {
		border-bottom: 0;
		padding: 30rpx 0 10rpx;
	}
	
	.store-info-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}
	
	.card-num {
		color: #FFC263;
	}
	
	.store-img {
		display: flex;
		align-items: center;
	}
	
	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 28rpx;
	}
	
	.order-state {
		color: #F2AB99;
	}
	
	.phone-box {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.phone-icon {
		display: flex;
		align-items: center;
	}
	
	.phone-icon image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
	}
	
	.symbol {
		color: #ccc;
		padding: 0 14rpx;
	}
	
	.order-left {
		color: #999;
		min-width: 120rpx;
	}
	
	.order-address {
		margin-right: 20rpx;
	}
	
	.goods-cont {
		border-bottom: 1rpx solid #eee;
		padding-bottom: 20rpx;
	}
	
	.goods-box {
		display: flex;
		justify-content: space-between;
		padding-top: 20rpx;
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
		padding-bottom: 20rpx;
	}
	
	.unfold-goods {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30rpx 0;
	}
	
	.unfold-goods-btn {
		padding: 0 22rpx;
		height: 44rpx;
		line-height: 44rpx;
		font-size: 22rpx;
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
		border-radius: 50rpx;
	}
	
	.submit-order-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 30rpx 0;
		font-size: 28rpx;
		color: #333;
	}
	
	.total-price-box {
		font-size: 32rpx;
	}
	
	.submit-order {
		border: 1rpx solid #F2AB99;
		background-color: #F2AB99;
		color: #fff;
		width: 162rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-left: 20rpx;
	}
	
	.submit-order.have-paid {
		border: 1rpx solid #eee;
		background-color: #eee;
		color: #999;
	}
	
	.submit-order.refunded {
		background-color: #fff;
		color: #F2AB99;
	}
	
	.total-price {
		color: #F2AB99;
	}
	
	.order-btn {
		display: flex;
		align-items: center;
	}
	
	.delivery-goods-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
		font-size: 48rpx;
		padding: 20rpx 20rpx 0 0;
	}
	
	.delivery-state {
		background-color: #F2AB99;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		width: 126rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-top-right-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
	}
	
	.delivery-state.ziti-state {
		background-color: #7CD1F8;
	}
	
	.delivery-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		position: relative;
	}
	
	.delivery-time:before {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 4rpx;
		background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
		background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
		background-size: 160rpx;
		content: '';
	}
</style>