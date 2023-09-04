<template>
	<view class="content">
		<view class="wrap">
			<u-search placeholder="请输入顾客手机号" v-model="phone" :showAction="false" @search="searchOrder" :clearable="true"
				bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333" searchIconColor="#F2AB99"
				shape="square" @clear="searchOrder"></u-search>
		</view>
		<!-- 非预定版店铺 -->
		<block v-if="storeInfo.storeType != 3">
			<view class="nav-box">
				<u-tabs :list="orderNavList" lineColor="#F2AB99" activeStyle="color: #F2AB99;" @click="changeOrderNav"
					:scrollable="false"></u-tabs>
			</view>
			<view class="delivery-time-box" v-if="state == 1 && deliveryList.length !== 0">
				<view class="delivery-time">配送时间：{{deliveryTime}}</view>
				<view class="delivery-time-btn" v-if="deliveryState" @click="deliveryOrder">开始配送</view>
				<view class="delivery-time-btn no-delivery" v-if="!deliveryState">未到时间</view>
			</view>
			<block v-if="deliveryList.length != 0">
				<view class="containers" v-if="state == 1 || state == 2">
					<yp-delivery-list :list.sync="deliveryList" :state="state" listKey="name"
						@dragSortChange="dragSortChange" @finishDelivery="finishDelivery" />
				</view>
			</block>
		</block>

		<!-- 预定版 -->
		<block v-if="storeInfo.storeType == 3">
			<u-swipe-action>
				<u-swipe-action-item :options="funcBtn" @click="hideDelivery" v-for="(item, index) in deliveryList"
					:key="index" :index="index">
					<view class="delivery-list-box" @click="showDeliveryGoods(item, index)">
						<view class="delivery-box">
							<view class="delivery-left">
								<view class="order-num">#{{item.serialNumber}}</view>
								<view>
									<view class="address" @click.stop="location(item)">{{item.address}}
									</view>
									<view class="contact-info">
										<view>{{item.consignee}}{{item.gender}}</view>
										<view class="phone-icon" @click.stop="callPhone(item.contact)">
											<image :src="imgUrl + 'orderPhone.png'" mode=""></image>
											<view>{{item.contact}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="goods-box" v-if="item.goodsState">
							<view v-for="(goods, goodIdx) in item.productList" :key="goodIdx" class="goods-info">
								<view class="goods-name">{{goods.name}}</view>
								<view>x{{goods.count}}</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</block>
		<block v-else>
			<!-- 已完成配送单 -->
			<block v-if="state == 3 && deliveryList.length !== 0">
				<block v-for="(order, orderIdx) in finishDeliveryList" :key="orderIdx">
					<view class="delivery-list-box" v-for="(item, index) in order.deliveryOrderList" :key="index">
						<view class="delivery-box">
							<view class="delivery-left" @click="showDeliveryGoods(item)">
								<view class="order-num">#{{item.serialNumber}}</view>
								<view>
									<view class="address" @click.stop="location(item)">{{item.address}}</view>
									<view class="contact-info">
										<view>{{item.consignee}}{{item.gender}}</view>
										<view class="phone-icon" @click.stop="callPhone(item.contact)">
											<image :src="imgUrl + 'orderPhone.png'" mode=""></image>
											<view>{{item.contact}}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="delivery-state">
								<block v-if="item.deliveryState == 3">
									<view>配送完成</view>
									<view>{{item.actualDeliveryTime.slice(11, 16)}}</view>
								</block>
								<block v-if="item.deliveryState == 4">
									<view class="finish-delivery">终止配送</view>
								</block>
							</view>
						</view>
						<view class="goods-box" v-if="item.goodsState">
							<view v-for="(goods, goodIdx) in item.productList" :key="goodIdx" class="goods-info">
								<view class="goods-name">{{goods.name}}</view>
								<view>x{{goods.count}}</view>
							</view>
						</view>
					</view>
				</block>
			</block>
		</block>
		<view v-if="deliveryList.length == 0" class="no-order">
			<image src="../../static/store/noOrder.png" mode="widthFix"></image>
			<view>暂无配送单</view>
		</view>
	</view>
</template>

<script>
	import ypDeliveryList from '@/components/yp-deliveryList/yp-deliveryList.vue'
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				phone: '',
				orderNavList: [{
					name: '待配送',
					value: 1
				}, {
					name: '配送中',
					value: 2
				}, {
					name: '已完成',
					value: 3
				}],
				state: '',
				deliveryTime: '',
				deliveryList: [],
				deliveryState: false, // 是否到达配送时间
				finishDeliveryList: [],
				list: [],
				storeInfo: {},
				funcBtn: [{
					text: '删除',
					style: {
						backgroundColor: '#7CD1F8'
					}
				}],
				currentListLength: 0
			}
		},
		components: {
			ypDeliveryList
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			if (this.storeInfo.storeType == 3) {
				// 预定版
				this.state = 3
			} else {
				this.state = this.orderNavList[0].value
			}
			this.deliveryList = []
			this.getDeliveryOrderList()
		},
		methods: {
			/* 拨打电话 */
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			/* 获取配送单列表 */
			getDeliveryOrderList() {
				let that = this
				that.request({
					url: that.config.deliveries,
					data: {
						storeId: that.storeId,
						phone: that.phone,
						state: that.state
					}
				}).then(res => {
					console.log('配送单列表', res)
					const data = res.data.data
					if (data.length != 0) {
						if (that.state == 1) {
							// 待配送
							that.deliveryTime = data[0].deliveryTime.slice(11, 16)
							let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
							let time = new Date(dateDay + ' ' + this.deliveryTime) // 店铺配送时间
							let deliveryTime = time.getTime()
							let currentTime = new Date().getTime() // 当前时间
							console.log('配送时间', deliveryTime)
							console.log('当前时间', currentTime)
							if (currentTime < deliveryTime) {
								// 未到配送时间
								that.deliveryState = false
							} else {
								that.deliveryState = true
							}
						}

						data.forEach(item => {
							item.deliveryOrderList.forEach(value => {
								value.goodsState = false
							})
							that.deliveryList.push(...item.deliveryOrderList)
						})
						that.finishDeliveryList = data
					}
				})
			},
			/* 切换订单状态列表 */
			changeOrderNav(e) {
				console.log(e)
				this.state = e.value
				this.deliveryList = []
				this.getDeliveryOrderList()
			},
			/* 开始配送 */
			deliveryOrder() {
				let that = this
				uni.showModal({
					content: '是否开始配送',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
							that.request({
								url: that.config.deliveryOrder,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
								data: {
									storeId: that.storeId,
									actualDeliveryTime: that.deliveryTime
								}
							}).then(res => {
								console.log('开始配送', res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '操作成功',
										icon: 'none'
									})
									setTimeout(() => {
										that.deliveryList = []
										that.getDeliveryOrderList()
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
			/* 配送完成 */
			finishDelivery(e) {
				let that = this
				let item = that.deliveryList[e]
				console.log(item)
				uni.showModal({
					content: '是否配送完成',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
							that.request({
								url: `${that.config.deliveries}/${item.id}/finishShipping`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('配送完成', res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '配送完成',
										icon: 'none'
									})
									setTimeout(() => {
										that.deliveryList = []
										that.state = 2
										that.getDeliveryOrderList()
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
			/* 显示配送单商品 */
			showDeliveryGoods(item) {
				item.goodsState = !item.goodsState
			},
			/* 展开订单 */
			showDeliveryOrder(item) {
				item.unfoldState = !item.unfoldState
			},
			// 拖拽排序触发
			dragSortChange(e) {
				console.log('drag', e)
				let info = {}
				if (e.frontData == undefined) {
					info = {
						id: e.data.id,
						sortNum: 0
					}
				} else {
					info = {
						id: e.data.id,
						sortNum: e.frontData.sortNum
					}
				}
				this.editOrderSort(info)
				// e.frontData 插到谁后面
				// e.data 操作的数据
				let list = [...this.list]
				if (e.frontData) {
					let before = e.frontData.sort
					let after = e.data.sort
					list.splice(before, 0, list.splice(after, 1)[0])
				} else {
					list.splice(0, 0, list.splice(e.data.sort, 1)[0])
				}
				this.list = [...list]
			},
			/* 修改订单排序 */
			editOrderSort(e) {
				let that = this
				uni.showLoading({
					title: '操作中',
					mask: true
				})
				that.request({
					url: `${that.config.deliveries}/${e.id}/sort`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						sortNum: e.sortNum
					}
				}).then(res => {
					console.log('修改订单排序', res)
					if (res.data.code == '200000') {
						uni.hideLoading()
						that.deliveryList = []
						that.getDeliveryOrderList()
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
				this.deliveryList = []
				this.getDeliveryOrderList()
			},
			/* 跳转导航 */
			location(item) {
				let that = this
				console.log('11111111111')
				console.log(item)
				let latitude = parseFloat(item.latitude)
				let longitude = parseFloat(item.longitude)
				console.log('322222222222')
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function(res) {
						console.log('success')
					},
					fail(err) {
						console.log('打开失败', err)
					}
				})
			},
			/* 隐藏配送单 */
			hideDelivery(e) {
				console.log('隐藏配送单', e)
				let item = this.deliveryList[e.index]
				console.log('隐藏的配送单', item)
				let that = this
				that.request({
					url: `${that.config.deliveries}/${item.id}:hide`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log('隐藏配送单', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.deliveryList = []
							that.getDeliveryOrderList()
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
	}
</script>

<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.nav-box {
		background-color: #fff;
	}

	.delivery-date {
		padding: 30rpx 24rpx;
		color: #333;
		font-size: 28rpx;
	}

	.delivery-time-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #7CD1F8;
		background-color: #E8F0F4;
		font-size: 28rpx;
		padding: 20rpx 24rpx;
	}

	.delivery-time-btn {
		width: 144rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #fff;
		background-color: #7CD1F8;
		border-radius: 10rpx;
		text-align: center;
	}

	.delivery-time-btn.no-delivery {
		color: #999;
		background-color: #ccc;
	}

	.delivery-list-box {
		background-color: #fff;
		padding: 0 20rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
	}

	.delivery-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
	}

	.delivery-left {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
		justify-content: space-between;
		width: 80%;
	}

	.phone-icon {
		display: flex;
		align-items: center;
		padding-left: 80rpx;
	}

	.phone-icon image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
	}

	.func-btn image {
		width: 44rpx;
		height: 40rpx;
	}

	.order-num {
		color: #999;
		padding-right: 20rpx;
	}

	.address {
		font-size: 40rpx;
		font-weight: 600;
	}

	.contact-info {
		display: flex;
		align-items: center;
		padding-top: 40rpx;
	}

	.goods-box {
		border-top: 1rpx solid #ccc;
	}

	.goods-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
		font-size: 28rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.goods-info:last-child {
		border-bottom: 0;
	}

	.goods-name {
		padding-right: 18rpx;
	}

	.delivery-state {
		text-align: center;
		font-size: 28rpx;
		color: #7CD1F8;
	}

	.finish-delivery {
		color: #F2AB99;
	}

	.content>>>.u-swipe-action-item__content {
		background-color: unset;
	}

	.content>>>.u-swipe-action-item__right {
		top: 14rpx;
		bottom: 14rpx;
		right: 24rpx;
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