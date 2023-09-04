<template>
	<view>
		<view>
			<view v-for="(item, index) in elementList" :key="index" class="element-box" @click="goStockDetail(item)">
				<view>{{item.name}}</view>
				<view class="price-spec">
					<u-icon name="arrow-right" color="#999" size="14"></u-icon>
				</view>
			</view>
		</view>
		<view style="height: 150rpx;"></view>
		<view class="add-btn" @click="openStockShow">存货位置</view>

		<!-- 存货点 -->
		<u-popup :show="stockShow" @close="closeStockShow" :closeable="true" mode="bottom">
			<view class="element-stock">
				<view class="stock-title">
					<view>
						<u-icon name="arrow-right" color="#999" size="20"></u-icon>
					</view>
					<view>存货点</view>
				</view>
				<view class="stock-box" v-for="(item, index) in stockPointList" :key="index" @longpress="openDeletePoint(item)">{{item.name}}</view>
				<view class="add-stock-point" @click="openAddStockPoint">新增位置</view>
			</view>
		</u-popup>
		
		<!-- 新增位置 -->
		<u-modal :show="addPointShow" @confirm="addStockPoint" @cancel="cancelAddStockPoint" :showCancelButton="true"
			confirmColor="#F2AB99" title="新增位置">
			<view>
				<view class="add-tip">输入存货位置</view>
				<u-input v-model="pointName" placeholder="名称" placeholderStyle="text-align: center; color: #ccc;">
				</u-input>
			</view>
		</u-modal>
		
		<!-- 位置删除 -->
		<u-modal :show="deletePointShow" @confirm="deletePoint" @cancel="cancelDeletePoint" :showCancelButton="true"
			confirmColor="#F2AB99" title="位置删除" confirmText="删除">
			<view>
				<view class="stock-name">{{stockInfo.name}}</view>
				<view class="add-tip">删除存货位置后，该位置的所有原料存货记录都会被清除，请慎重操作</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageIndex: 1,
				pageSize: 10,
				completed: false,
				elementList: [],
				stockPointList: [{
					name: '前厅'
				}, {
					name: '后厨'
				}, {
					name: '厨房'
				}],
				stockShow: false,
				addPointShow: false,
				deletePointShow: false,
				stockInfo: {},
				pointName: ''
			}
		},
		onLoad() {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.elementList = []
			this.getElementList()
		},
		// onReachBottom() {
		// 	if (!this.completed) {
		// 		this.pageIndex++
		// 		this.getElementList()
		// 	}
		// },
		methods: {
			/* 获取原料列表 */
			getElementList() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId
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
						// that.elementList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* 存货位置 */
			openStockShow() {
				this.stockShow = true
				this.getStockPointList()
			},
			closeStockShow() {
				this.stockShow = false
			},
			/* 获取存货点列表 */
			getStockPointList() {
				let that = this
				that.request({
					url: that.config.stockPointInfo,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						that.stockPointList = data
					}
				})
			},
			/* 新增位置 */
			openAddStockPoint() {
				this.pointName = ''
				this.stockShow = false
				this.addPointShow = true
			},
			cancelAddStockPoint() {
				this.addPointShow = false
			},
			addStockPoint() {
				let that = this
				that.request({
					url: that.config.stockPointInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.pointName,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.openStockShow()
							that.addPointShow = false
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除存货点 */
			openDeletePoint(item) {
				this.stockShow = false
				this.deletePointShow = true
				this.stockInfo = item
			},
			cancelDeletePoint() {
				this.deletePointShow = false
			},
			deletePoint() {
				let that = this
				that.request({
					url: `${that.config.stockPointInfo}/${that.stockInfo.id}`,
					method: 'DELETE',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.deletePointShow = false
							that.openStockShow()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 存货详情 */
			goStockDetail(item) {
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
		padding: 30rpx 20rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		background-color: #fff;
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
	
	.element-stock{
		padding: 0 20rpx;
	}
	
	.stock-title{
		padding: 20rpx 0;
		display: flex;
		align-items: center;
	}
	
	.stock-box{
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}
	
	.add-stock-point{
		margin: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
	
	.add-tip{
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
	
	.stock-name{
		text-align: center;
		color: #333;
	}
</style>
