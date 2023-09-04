<template>
	<view>
		<view v-for="(item, index) in elementList" :key="index" class="element-box" @click="elementDetail(item)">
			<view>{{item.name}}</view>
			<view class="price-spec">
				<view>￥{{item.price}}/</view>
				<view>{{item.quantity}}{{item.unit}}</view>
			</view>
		</view>
		<view style="height: 150rpx;"></view>
		<view class="add-btn" @click="addElement">新建原料</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: '',
				pageIndex: 1,
				pageSize: 10,
				completed: false,
				elementList: []
			}
		},
		onShow() {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.elementList = []
			this.getElementList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getElementList()
			}
		},
		methods: {
			/* 获取原料列表 */
			getElementList() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId,
						name: '',
						supplierName: ''
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						for (let i = 0; i < data.length; i++) {
							if (this.elementList.filter(e => e.name == data[i].name).length == 0) {
								this.elementList.push(data[i])
							}
						}
						// that.elementList = data
					} else {
						that.completed = true
					}
				})
			},
			/* 跳转新建原料 */
			addElement() {
				uni.navigateTo({
					url: './edit'
				})
			},
			/* 原料详情 */
			elementDetail(item) {
				uni.navigateTo({
					url: './detail?elementName=' + item.name + '&elementId=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.element-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 30rpx 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.price-spec {
		display: flex;
		align-items: center;
	}

	.add-btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
