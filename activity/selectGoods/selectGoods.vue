<template>
	<view>
		<view>
			<block v-for="(item, index) in goodsList" :key="index">
				<view class="store-box" @click="selectGoods(item.id)">
					<view class="store-info-box">
						<!-- <view :class="item.activityStatus ? 'shadow-box' : ''"></view> -->
						<view class="store-img">
							<image :src="item.picture"></image>
						</view>
						<view class="store-info">
							<view class="store-name">{{item.name}}</view>
							<view class="goods-price">￥{{item.marketPrice}}</view>
						</view>
					</view>
					<block>
						<view class="select-goods" :class="item.id == goodId ? 'isSelect-goods' : ''">
							<block v-if="item.id == goodId">
								<image src="../../static/store/check.png" mode=""></image>
							</block>
						</view>
					</block>
				</view>
			</block>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="save-btn" @tap="$u.throttle(saveGoods, 500)">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productName: '',
				pageIndex: 1,
				pageSize: 20,
				goodsList: [],
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				completed: false,
				storeId: '',
				goodsIdx: 0,
				goodId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.goodsIdx = options.index
			this.getGoodsList()
		},
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex++
				that.request({
					url: that.config.products,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						// data.forEach(item => {
						// 	item.select = false
						// })
						that.goodsList.push(...data)
					}
				})
			}
		},
		methods: {
			getGoodsList() {
				let that = this
				that.request({
					url: that.config.products,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					// data.forEach(item => {
					// 	item.select = false
					// })
					that.goodsList = data
				})
			},
			/* 选择商品 */
			selectGoods(id) {
				console.log(id)
				this.goodId = id
				// item.select = !item.select
			},
			saveGoods() {
				let arrId = []
				let arr = []
				this.goodsList.forEach(item => {
					// if (item.select) {
					// 	arr.push(item.name)
					// 	arrId.push(item.id)
					// }
					if (item.id == this.goodId) {
						arr.push(item.name)
						arrId.push(item.id)
					}
				})
				// arr = arr.join('、')
				console.log('选中商品', arrId)
				var pages = getCurrentPages()
				var prevPage = pages[pages.length - 2]
				prevPage.$vm.selectGoodsIdList = arrId
				prevPage.$vm.selectGoods = arr
				prevPage.$vm.selectGoodsIndex = this.goodsIdx
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.store-box {
		background-color: #fff;
		margin: 14rpx 0;
		padding: 20rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.store-info-box {
		display: flex;
		align-items: center;
		max-width: 90%;
		position: relative;
	}

	.store-info {
		font-size: 28rpx;
		color: #333;
	}

	.store-img {
		margin-right: 20rpx;
	}

	.store-img image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
	}

	.goods-price {
		color: #F2AB99;
		margin-top: 34rpx;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		text-align: center;
	}

	.select-goods image {
		width: 18rpx;
		height: 12rpx;
	}

	.isSelect-goods {
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.activity-state {
		width: 120rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		border: 1rpx solid #333;
		color: #333;
		font-size: 20rpx;
		text-align: center;
		background-color: #D6D6D6;
	}

	.save-btn {
		position: fixed;
		bottom: 64rpx;
		left: 24rpx;
		right: 24rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
