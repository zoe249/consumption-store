<template>
	<view>
		<u-sticky>
			<view class="nav-cont" :style="{ 'padding-top': statusBarHeight + 9 + 'px'}">
				<view @click="goCustomeHome">
					<block v-if="orderState">
						<u-icon name="home" color="#333" size="20"></u-icon>
					</block>
					<block v-else>
						<u-icon name="arrow-left" color="#333" size="20"></u-icon>
					</block>
				</view>
				<view>我的订单</view>
				<view style="width: 20rpx;"></view>
			</view>
			<view class="nav-box" v-if="storeInfo.storeType != 3">
				<u-tabs :list="orderNavList" lineColor="#F2AB99" activeStyle="color: #F2AB99;" @click="changeOrderNav"
					:scrollable="false" :current="navIdx">
				</u-tabs>
			</view>
		</u-sticky>
		<block v-if="loginState">
			<block v-if="orderList.length !== 0">
				<scroll-view scroll-y="true" :scroll-into-view="'id' + orderId" scroll-with-animation class="scroll-order-list">
					<view class="order-info" v-for="(item, index) in orderList" :key="index" :id="'id' + item.id" @click="goOrderDetail(item)">
						<view class="store-info-box">
							<view class="store-img">
								<image :src="item.storeLogo" mode=""></image>
								<view class="store-name">{{item.storeName}}</view>
							</view>
							<view class="order-state" v-if="item.orderStatus == 'pending'">等待商家处理</view>
							<view class="order-state have-paid" v-if="item.orderStatus == 'havePaid'">商家已收款,等待取餐</view>
							<view class="order-state" v-if="item.orderStatus == 'completed'">交易成功</view>
							<view class="order-state have-paid" v-if="item.orderStatus == 'refunded'">线下退款成功</view>
							<view class="order-state" v-if="item.orderStatus == '1'">待配送</view>
							<view class="order-state" v-if="item.orderStatus == '2'">配送中</view>
							<view class="order-state" v-if="item.orderStatus == 'unpaid'">待支付</view>
							<view class="order-state" v-if="item.orderStatus == '4'">配送终止</view>
						</view>
						<view class="goods-cont">
							<view class="goods-box" v-for="(goods, idx) in item.orderItems" :key="idx">
								<view class="goods-img">
									<image :src="goods.picture"></image>
									<view class="goods-name">{{goods.productName}}</view>
								</view>
								<view class="price-num">
									<view class="goods-price">￥{{goods.price}}</view>
									<view>x{{goods.quantity}}</view>
								</view>
							</view>
							<view class="delivery-fee" v-if="item.receivingWay == '2'">
								<view>配送费</view>
								<view>￥{{item.actualDeliveryFee}}</view>
							</view>
							<view class="delivery-fee" v-if="item.discountPrice != 0">
								<view>消费红包抵扣</view>
								<view>￥{{item.discountPrice}}</view>
							</view>
						</view>
						<view class="total-price-box">
							<!-- <view v-if="item.receivingWay == 1">取餐时间：{{item.allowTakeTime}}之后</view>
							<view v-if="item.receivingWay == 2">预计最晚送达时间：{{item.allowTakeTime}}</view> -->
							合计：<text class="total-price">￥{{item.amountReceived}}</text>
						</view>
						<view class="order-operate" v-if="item.acquireCardNum != 0">
							<view>获得卡片</view>
							<view class="total-price">{{item.acquireCardNum}}张</view>
						</view>
						<view class="order-operate">
							<block v-if="item.receivingWay == 1">
								<view>取餐时间</view>
								<view class="order-time">{{item.allowTakeTime}}之后</view>
							</block>
							<block v-if="item.receivingWay == 2">
								<view>预计最晚送达时间</view>
								<view class="order-time">{{item.allowTakeTime}}之后</view>
							</block>
						</view>
						<view class="order-operate">
							<view>下单时间</view>
							<view class="order-time">{{item.createTime}}</view>
						</view>
						<view class="contact-store-box">
							<!-- <view>
								<block v-if="item.acquireCardNum != 0">
									获得卡片：<text class="total-price">{{item.acquireCardNum}}张</text>
								</block>
							</view> -->
							<view class="wait-pay-btn" v-if="item.orderStatus == 'unpaid'">
								<view class="cancle-btn" @click.stop="cancleOrder(item)">取消订单</view>
								<view @click.stop="getPayParameters(item)">继续支付</view>
							</view>
							<view @click.stop="callStorePhone(item.storePhone)" class="contact-store" v-else>联系商家</view>
						</view>
					</view>
				</scroll-view>
			</block>
			
			<view v-else class="no-order">
				<image src="../../static/store/noOrder.png" mode="widthFix"></image>
				<view>暂无订单</view>
			</view>
		</block>
		
		<view v-else @click="userLogin" class="login-btn">未登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navIdx: 0,
				orderNavList: [{
					name: '全部',
					value: ''
				}, {
					name: '待支付',
					value: 'unpaid'
				}, {
					name: '进行中',
					value: 'pending'
				}, {
					name: '已完成',
					value: 'completed'
				}],
				pageIndex: 1,
				pageSize: 10,
				storeId: '',
				orderStatus: '',
				phone: '',
				orderList: [],
				completed: false,
				orderState: false,
				statusBarHeight: 0,
				orderId: '',
				token: '',
				loginState: false,
				storeInfo: {}
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.token = uni.getStorageSync('token')
			if (this.token === '') {
				console.log('顾客订单未登录')
				this.loginState = false
			} else {
				console.log('顾客订单已登录')
				this.loginState = true
			}
			this.storeId = uni.getStorageSync('storeInfo').id
			this.storeInfo = uni.getStorageSync('storeInfo')
			if (this.storeInfo.storeType == 3) {
				this.orderStatus = 'completed'
			} else {
				this.orderStatus = this.orderNavList[0].value
			}
			this.orderState = options.orderState == 'true' ? true : false
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
				}
			})
			
			this.orderStatus = options.orderStatus == undefined ? this.orderNavList[0].value : options.orderStatus
			if (this.orderStatus == 'unpaid') {
				this.navIdx = 1
			} else if (this.orderStatus == 'pending') {
				this.navIdx = 2
			} else if (this.orderStatus == 'completed') {
				this.navIdx = 3
			}
			
			// 下单成功跳转至列表，隐藏返回首页按钮
			if (this.orderState) {
				uni.hideHomeButton()
				this.navIdx = 2
				this.orderStatus = 'pending'
			}
			this.orderId = options.orderId
		},
		onShow() {
			this.pageIndex = 1
			this.completed = false
			this.orderList = []
			this.getOrderList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getOrderList()
			}
		},
		methods: {
			/* 切换订单状态搜索 */
			changeOrderNav(item) {
				this.navIdx = item.index
				this.orderStatus = item.value
				this.orderList = []
				this.pageIndex = 1
				this.completed = false
				this.orderId = ''
				this.getOrderList()
			},
			/* 获取订单列表 */
			getOrderList() {
				let that = this
				that.request({
					url: that.config.userOrderList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						orderStatus: that.orderStatus
					}
				}).then(res => {
					console.log('订单列表', res)
					if (res.data.code == '200000') {
						const data = res.data.data.data
						if (data.length == 0) {
							that.completed = false
						} else {
							that.orderList.push(...data)
						}
					// } else {
					// 	uni.showToast({
					// 		title: res.data.detail,
					// 		icon: 'none'
					// 	})
					}
				})
			},
			/* 门店电话 */
			callStorePhone(e) {
				uni.makePhoneCall({
					phoneNumber: e
				})
			},
			goCustomeHome() {
				if (this.orderState) {
					console.log('11111111111')
					uni.reLaunch({
						url: '../home/index/index?storeId=' + this.storeId
					})
				} else {
					console.log('222222222222')
					uni.navigateBack()
				}
			},
			/* 取消订单 */
			cancleOrder(item) {
				let that = this
				uni.showModal({
					content: '确定要取消订单吗',
					success: function (res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.cancleOrder}/${item.id}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
							}).then(res => {
								console.log('取消订单', res)
								if (res.data.code == '200000') {
									setTimeout(() => {
										uni.reLaunch({
											url: './list?orderState=true'
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
			},
			/* 获取微信支付参数 */
			getPayParameters(item) {
				let that = this
				that.request({
					url: `${that.config.wechatPay}/${item.id}/JSAPIPayParam`
				}).then(res => {
					console.log('微信支付参数', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						uni.requestPayment({
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: 'prepay_id=' + data.payId,
							signType: data.signType,
							paySign: data.paySign,
							success(res) {
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(() => {
									uni.reLaunch({
										url: './paySucc'
									})
								}, 2000)
							},
							fail() {
								setTimeout(() => {
									uni.reLaunch({
										url: './waitPay?orderId=' + that.orderId
									})
								}, 2000)
							}
						})
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 订单详情 */
			goOrderDetail(item) {
				uni.navigateTo({
					url: './detail?id=' + item.id
				})
			},
			userLogin() {
				uni.navigateTo({
					url: '/pages/startUp/login/login'
				})
			}
		}
	}
</script>

<style scoped>
	.nav-cont {
		background-color: #fff;
		color: #333;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 38rpx 24rpx;
	}

	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.nav-box {
		background-color: #fff;
		margin-bottom: 14rpx;
	}
	
	.scroll-order-list{
		height: 100vh;
	}

	.order-info {
		margin: 14rpx 24rpx;
		padding: 0 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.store-info-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 0 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.store-img {
		display: flex;
		align-items: center;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-name {
		margin-left: 30rpx;
	}

	.order-state {
		color: #F2AB99;
	}

	.have-paid {
		color: #7CD1F8;
	}

	.goods-cont {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.goods-box {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0 0;
	}

	.goods-box:first-child {
		padding-top: 0;
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
		padding-top: 16rpx;
	}

	.price-num {
		text-align: right;
		padding-top: 16rpx;
	}

	.goods-price {
		padding-bottom: 16rpx;
	}
	
	.delivery-fee {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 10rpx;
	}
	

	.order-operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0 26rpx;
	}
	
	.order-time{
		color: #999;
	}

	.contact-store-box {
		display: flex;
		justify-content: flex-end;
		padding: 20rpx 0 30rpx;
		border-top: 1rpx solid #eee;
	}

	.contact-store {
		width: 162rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1rpx solid #F2AB99;
		color: #F2AB99;
		border-radius: 50rpx;
	}
	
	.total-price-box{
		text-align: right;
		font-size: 28rpx;
		color: #333;
		padding: 26rpx 0;
	}

	.total-price {
		color: #F2AB99;
	}

	.no-order {
		color: #333;
		font-size: 28rpx;
		margin: 260rpx auto;
		text-align: center;
	}

	.no-order image {
		width: 94rpx;
		height: auto;
		margin-bottom: 20rpx;
	}
	
	.wait-pay-btn{
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.wait-pay-btn view{
		width: 162rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1rpx solid #F2AB99;
		color: #fff;
		background-color: #F2AB99;
		border-radius: 50rpx;
		font-size: 28rpx;
	}
	
	.wait-pay-btn view.cancle-btn{
		border-color: #999;
		color: #999;
		margin-right: 20rpx;
		background-color: #fff;
	}
	
	.login-btn{
		width: 300rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #fff;
		background-color: #F2AB99;
		border-radius: 10rpx;
		text-align: center;
		margin: 200rpx auto 0;
	}
</style>
