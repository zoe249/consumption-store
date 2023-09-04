<template>
	<view>
		<view>
			<view v-for="(item, index) in supplierList" :key="index" class="supplier-box" @click="selectSupplier(item)">
				<view>{{item.chName}}</view>
			</view>
		</view>
		<view class="add-btn" @click="openSupplierShow">
			<image :src="imgUrl + 'supplierAdd.png'" mode=""></image>
			<view>新增供货商</view>
		</view>

		<u-modal :show="addSupplierShow" @confirm="addSupplier" @cancel="cancelAddSupplier" :showCancelButton="true"
		 confirmColor="#F2AB99" title="添加">
			<view>
				<view class="add-tip">输入新供货商的名称</view>
				<input type="text" class="add-input" v-model="supplierName" placeholder="名称" placeholderStyle="text-align: center; color: #ccc;">
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				storeId: '',
				pageIndex: 1,
				pageSize: 10,
				completed: false,
				supplierList: [],
				selectState: false,
				addSupplierShow: false,
				supplierName: '',
				submitState: true
			}
		},
		onLoad(options) {
			this.selectState = options.selectState == 'true' ? true : false
			if (this.selectState) {
				uni.setNavigationBarTitle({
					title: '选择供货商'
				})
			}
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.supplierList = []
			this.getSupplierList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getSupplierList()
			}
		},
		methods: {
			/* 获取供货商列表 */
			getSupplierList() {
				let that = this
				that.request({
					url: that.config.suppliersInfo,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						that.supplierList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* 选择供货商 */
			selectSupplier(item) {
				if (this.selectState) {
					var pages = getCurrentPages()
					var prevPage = pages[pages.length - 2]
					prevPage.$vm.supplierName = item.chName
					prevPage.$vm.supplierId = item.id
					uni.navigateBack()
				} else {
					uni.navigateTo({
						url: './detail?supplierId=' + item.id + '&supplierName=' + item.chName
					})
				}
			},
			openSupplierShow() {
				this.supplierName = ''
				this.addSupplierShow = true
			},
			cancelAddSupplier() {
				this.addSupplierShow = false
			},
			/* 新增供货商 */
			addSupplier() {
				let that = this
				if (this.submitState) {
					this.submitState = false
					that.request({
						url: that.config.suppliersInfo,
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'Transaction-No': new Date().getTime()
						},
						data: {
							storeId: that.storeId,
							chName: that.supplierName
						}
					}).then(res => {
						console.log(res)
						that.submitState = true
						if (res.data.code == '200000') {
							uni.showToast({
								title: '新增成功',
								icon: 'none'
							})
							that.addSupplierShow = false
							that.supplierList = []
							that.getSupplierList()
							// setTimeout(() => {
							// 	if (that.selectState) {
							// 		var pages = getCurrentPages()
							// 		var prevPage = pages[pages.length - 2]
							// 		prevPage.$vm.supplier = that.supplierName
							// 		uni.navigateBack()
							// 	}
							// }, 2000)
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
	}
</script>

<style scoped>
	.supplier-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 30rpx 20rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		color: #333;
		font-size: 28rpx;
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 40rpx auto;
		background-color: #62B279;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		width: 344rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.add-btn image {
		width: 26rpx;
		height: 26rpx;
		display: block;
		margin-right: 14rpx;
	}

	.add-tip {
		color: #999;
		text-align: center;
	}
	
	.add-input {
		color: #999;
		text-align: center;
		background-color: #F4F4F4;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		margin-top: 10rpx;
	}
	
	.add-input input{
		height: 60rpx;
		line-height: 60rpx;
	}
</style>
