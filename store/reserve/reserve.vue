<template>
	<view>
		<u-sticky>
			<view class="nav-box">
				<u-tabs :list="navLsit" :scrollable="false" lineColor="#F2AB99" activeStyle="color: #F2AB99;"
					@click="changeNav"></u-tabs>
			</view>
		</u-sticky>
		<view v-if="navIdx == 0" class="order-goods-box">
			<view v-for="(item, index) in orderGoodsList" :key="index" class="goods-box">
				<view>{{item.productName}}</view>
				<view>x{{item.quantity}}</view>
			</view>
			<view class="create-menu" @click="goDailyMenu">明日菜单生成</view>
		</view>
		<view v-if="navIdx == 1">
			<block v-if="orderList.length !== 0">
				<yp-order-list :orderList="orderList" :tomorrowOrder="true" @callPhone="callPhone" @unfoldGoods="unfoldGoods"></yp-order-list>
			</block>
			<view v-else class="no-order">
				<image src="../../static/store/noOrder.png" mode="widthFix"></image>
				<view>暂无订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ypOrderList from '@/components/yp-orderList/yp-orderList.vue'
	export default {
		data() {
			return {
				navLsit: [{
					name: '商品预定',
				}, {
					name: '明日订单',
				}],
				navIdx: 0,
				storeId: '',
				orderGoodsList: [],
				orderList: [],
				pageIndex: 1,
				pageSize: 10,
				completed: false
			}
		},
		components: {
			ypOrderList
		},
		onLoad() {
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.orderList = []
			this.getOrderGoodsList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getOrderList()
			}
		},
		methods: {
			changeNav(e) {
				console.log(e)
				this.navIdx = e.index
				if (this.navIdx == 0) {
					this.getOrderGoodsList()
				} else {
					this.orderList = []
					this.getOrderList()
				}
			},
			/* 获取明日预定订单商品列表 */
			getOrderGoodsList() {
				let that = this
				that.request({
					url: that.config.tomorrowOrderGoods,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.orderGoodsList = data
				})
			},
			/* 获取明日订单列表 */
			getOrderList() {
				let that = this
				that.request({
					url: that.config.tomorrowOrder,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						data.forEach(item => {
							item.unfoldGoodsShow = false
						})
						that.orderList.push(...data)
					}
				})
			},
			/* 跳转生成明日菜单 */
			goDailyMenu() {
				uni.setStorageSync('orderGoodsList', this.orderGoodsList)
				uni.navigateTo({
					url: '/store/dailyMenu/dailyMenu?reserveGoods=true'
				})
			},
			unfoldGoods(item) {
				console.log('2222', item)
				item.unfoldGoodsShow = true
			},
		}
	}
</script>

<style scoped>
	.nav-box {
		background-color: #fff;
		margin-bottom: 14rpx;
	}
	
	.goods-box{
		margin: 14rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #000;
		padding: 20rpx 26rpx;
		background-color: #fff;
	}
	
	.create-menu{
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
		font-size: 28rpx;
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