<template>
	<view>
		<u-sticky>
			<view class="wrap">
				<u-search placeholder="请输入手机号" v-model="phone" :showAction="false" @search="searchOrder"
					:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
					searchIconColor="#F2AB99" shape="square" @clear="searchOrder"></u-search>
			</view>
			<view class="nav-box" v-if="storeInfo.storeType != 3">
				<u-tabs :list="orderNavList" lineColor="#F2AB99" activeStyle="color: #F2AB99;" @click="changeOrderNav"></u-tabs>
			</view>
		</u-sticky>
		<block v-if="orderList.length !== 0">
			<yp-order-list :orderList="orderList" :isPay="isPay" @confirmReceiveMoney="confirmReceiveMoney"
				@orderRefund="orderRefund" @unfoldGoods="unfoldGoods" @orderFinish="orderFinish"
				@orderPayRefund="orderPayRefund" @cancleDelivery="cancleDelivery" @callPhone="callPhone"></yp-order-list>
		</block>

		<view v-else class="no-order">
			<image src="../../static/store/noOrder.png" mode="widthFix"></image>
			<view>暂无订单</view>
		</view>
	</view>
</template>

<script>
	import ypOrderList from '@/components/yp-orderList/yp-orderList.vue'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				navIdx: 0,
				orderNavList: [{
					name: '全部',
					value: ''
				}, {
					name: '待处理',
					value: 'pending'
				}, {
					name: '收款完成',
					value: 'havePaid'
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
				storeId: '',
				isPay: false,
				storeInfo: {}
			}
		},
		components: {
			ypOrderList
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			if (this.storeInfo.storeType == 3) {
				this.orderStatus = 'completed'
			} else {
				this.orderStatus = this.orderNavList[0].value
			}
			this.getOrderList()
			this.getOrderNum()
			this.getIsStorePay()
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
				this.getOrderList()
			},
			/* 获取订单列表 */
			getOrderList() {
				let that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				that.request({
					url: that.config.orderList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId,
						orderStatus: that.orderStatus,
						phone: that.phone
					}
				}).then(res => {
					console.log('订单列表', res)
					uni.hideLoading()
					if (res.statusCode == '200') {
						const data = res.data.data.data
						if (data.length == 0) {
							this.completed = true
						} else {
							data.forEach(item => {
								item.unfoldGoodsShow = false
							})
							that.orderList.push(...data)
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 搜索订单 */
			searchOrder() {
				this.orderList = []
				this.pageIndex = 1
				this.completed = false
				this.getOrderList()
			},
			/* 确认收款 */
			confirmReceiveMoney(item) {
				let that = this
				uni.showModal({
					content: '请确认是否已收款',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showLoading({
								title: '请稍候',
								mask: true
							})
							that.request({
								url: `${that.config.orderOperation}/${item.id}/collectMoney`,
								method: 'POST',
								header: {
									'Content-Type': 'application/json; charset=utf-8',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('收款', res)
								uni.hideLoading()
								if (res.data.code == '200000') {
									uni.showToast({
										title: '收款成功',
										icon: 'none'
									})
									setTimeout(() => {
										that.orderList = []
										that.pageIndex = 1
										that.completed = false
										that.getOrderList()
										that.getOrderNum()
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			/* 退款 */
			orderRefund(item) {
				let that = this
				uni.showModal({
					content: '请确认是否要退款',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showLoading({
								title: '请稍候',
								mask: true
							})
							that.request({
								url: `${that.config.orderOperation}/${item.id}/refund`,
								method: 'POST',
								header: {
									'Content-Type': 'application/json; charset=utf-8',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								uni.hideLoading()
								console.log('退款', res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '退款成功',
										icon: 'none'
									})
									setTimeout(() => {
										that.orderList = []
										that.pageIndex = 1
										that.completed = false
										that.getOrderList()
										that.getOrderNum()
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			unfoldGoods(item) {
				console.log('2222', item)
				item.unfoldGoodsShow = true
			},
			/* 订单完成 */
			orderFinish(item) {
				let that = this
				uni.showModal({
					content: '请确认订单是否已完成',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showLoading({
								title: '请稍候',
								mask: true
							})
							that.request({
								url: `${that.config.orderOperation}/${item.id}/finish`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json; charset=utf-8',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('订单完成', res)
								uni.hideLoading()
								if (res.data.code == '200000') {
									uni.showToast({
										title: '订单完成',
										icon: 'none'
									})
									setTimeout(() => {
										that.orderList = []
										that.pageIndex = 1
										that.completed = false
										that.getOrderList()
										that.getOrderNum()
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			/* 获取订单分类计数 */
			getOrderNum() {
				let that = this
				that.request({
					url: `${that.config.orderOperation}/${that.storeId}/orderStateCount`
				}).then(res => {
					console.log('订单分类计数', res)
					const data = res.data.data
					that.orderNavList[1].name = '待处理(' + data.pendingCount + ')' // 待处理
					that.orderNavList[2].name = '收款完成(' + data.payCount + ')' // 收款完成
					that.orderNavList[3].name = '已完成(' + data.finishCount + ')' // 已完成
				})
			},
			/* 微信退款 */
			orderPayRefund(item) {
				let that = this
				uni.showModal({
					content: '请确认是否要退款',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showLoading({
								title: '请稍候',
								mask: true
							})
							that.request({
								url: `${that.config.wechatPay}/${item.id}/JSAPIRefund`,
								method: 'POST',
								header: {
									'Content-Type': 'application/json; charset=utf-8',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('退款', res)
								uni.hideLoading()
								if (res.data.code == '200000') {
									uni.showToast({
										title: '退款成功',
										icon: 'none'
									})
									setTimeout(() => {
										that.orderList = []
										that.pageIndex = 1
										that.completed = false
										that.getOrderList()
										that.getOrderNum()
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			/* 获取店铺是否开启微信支付 */
			getIsStorePay() {
				let that = this
				that.request({
					url: `${that.config.openJsApiPayStatus}/${that.storeId}`
				}).then(res => {
					console.log('店铺是否开启微信支付', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.isPay = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
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
				let that = this
				console.log(item)
				uni.showModal({
					content: '是否取消配送',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '处理中',
								mask: true
							})
							that.request({
								url: `${that.config.deliveries}/${item.id}/stopDelivery`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('取消配送', res)
								uni.hideLoading()
								if (res.data.code == '200000') {
									uni.showToast({
										title: '取消配送完成',
										icon: 'none'
									})
									setTimeout(() => {
										that.orderList = []
										that.pageIndex = 1
										that.completed = false
										that.getOrderList()
										that.getOrderNum()
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
			/* 拨打电话 */
			callPhone(item) {
				uni.makePhoneCall({
					phoneNumber: item.phone
				})
			}
		}
	}
</script>

<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.nav-box {
		background-color: #fff;
		margin-bottom: 14rpx;
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
</style>