<template>
	<view>
		<view class="element-operate">
			<view class="element-name">
				<view>{{supplierName}}</view>
				<view @click="changeOperate">
					<u-icon name="more-dot-fill" color="#F2AB99" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view>
			<!-- <view>供货列表</view> -->
			<view v-for="(item, index) in supplierList" :key="index" class="element-box" @click="editElement(item)">
				<view>{{item.name}}</view>
				<view class="supplier-spec">
					<view>￥{{item.price}}/</view>
					<view>{{item.quantity}}{{item.unit}}</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @click="addElement">新建原料</view>
		
		<!-- 重命名 -->
		<u-modal :show="renameSupplierShow" @confirm="editSupplierInfo" @cancel="cancelRenameSupplier" :showCancelButton="true"
			confirmColor="#F2AB99" title="重命名">
			<view class="add-tip">
				<input type="text" v-model="supplierRename" placeholder="名称" placeholderStyle="text-align: center; color: #ccc; line-height: 60rpx;" />
			</view>
		</u-modal>
		
		<u-overlay :show="operateShow" @click="changeOperate" opacity="rgba(0, 0, 0, 0)">
			<view class="operate-box" v-if="operateShow">
				<view @click="openRenameSupplier" class="operate-name">重命名</view>
				<view @click="deleteSupplier" class="operate-name">删除</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: '',
				supplierList: [],
				operateShow: false,
				supplierName: '',
				renameSupplierShow: false,
				supplierId: '',
				supplierRename: ''
			}
		},
		onLoad(options) {
			this.supplierName = options.supplierName == undefined ? '' : options.supplierName
			this.supplierId = options.supplierId == undefined ? '' : options.supplierId
			this.storeId = uni.getStorageSync('storeInfo').id
			this.supplierRename = this.supplierName
		},
		onShow() {
			this.supplierList = []
			this.getElementList()
		},
		methods: {
			/* 获取供货商原料列表 */
			getElementList() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId,
						name: '',
						supplierName: that.supplierName
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						that.supplierList = data
					}
				})
			},
			changeOperate() {
				this.operateShow = !this.operateShow
			},
			/* 打开重命名 */
			openRenameSupplier() {
				this.supplierRename = this.supplierName
				this.renameSupplierShow = true
				this.operateShow = false
			},
			cancelRenameSupplier() {
				this.renameSupplierShow = false
			},
			/* 修改供货商信息 */
			editSupplierInfo() {
				let that = this
				that.request({
					url: `${that.config.suppliersInfo}/${that.supplierId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						chName: that.supplierRename
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.supplierName = that.supplierRename
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.renameSupplierShow = false
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除供货商 */
			deleteSupplier() {
				let that = this
				uni.showModal({
					content: '确定要删除该供货商',
					success: function (res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.suppliersInfo}/${that.supplierId}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log(res)
								if (res.data.code == '200000') {
									that.storeId = res.data.data
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									})
									setTimeout(() => {
										uni.navigateBack()
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
			/* 原料编辑 */
			editElement(item) {
				uni.navigateTo({
					url: '../element/edit?elementId=' + item.id + '&elementName=' + item.name + '&supplierName=' + this.supplierName + '&supplierId=' + this.supplierId
				})
			},
			/* 新建原料 */
			addElement() {
				uni.navigateTo({
					url: '../element/edit?supplierName=' + this.supplierName + '&supplierId=' + this.supplierId
				})
			}
		}
	}
</script>

<style scoped>
	.element-operate {
		position: relative;
	}
	
	.element-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 40rpx;
		font-size: 40rpx;
		color: #333;
		font-weight: 600;
	}

	.operate-box {
		background-color: #fff;
		position: absolute;
		right: 0;
		top: 80rpx;
		width: 120rpx;
		text-align: center;
		color: #333;
		font-size: 28rpx;
		border-radius: 10rpx;
		padding: 0 40rpx;
		box-shadow: 10rpx 10rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.operate-name{
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}
	
	.operate-name:last-child{
		border-bottom: 0;
	}

	.element-cont {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
		padding: 0 20rpx;
	}

	.element-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		background-color: #fff;
		color: #333;
	}

	.supplier-spec {
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
	
	.add-tip {
		color: #999;
		text-align: center;
		background-color: #F4F4F4;
		padding-left: 20rpx;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
	
	.add-tip input{
		height: 60rpx;
		line-height: 60rpx;
	}
</style>
