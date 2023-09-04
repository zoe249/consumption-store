<template>
	<view>
		<view class="element-operate">
			<view class="element-name">
				<view>{{_elementName}}</view>
				<view @click="changeOperate">
					<u-icon name="more-dot-fill" color="#F2AB99" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view>
			<view class="supplier-box" v-for="(item, index) in elementInfo" :key="index" @click="goEditSupplier(item)">
				<view>{{item.supplierName}}</view>
				<view class="supplier-spec">
					<view>￥{{item.price}}元/</view>
					<view>{{item.quantity}}{{item.unit}}</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @click="addSupplier">新价格</view>

		<!-- 重命名 -->
		<u-modal :show="renameElementShow" @confirm="editElementInfo" @cancel="cancelRenameElement" :showCancelButton="true"
		 confirmColor="#F2AB99" title="重命名">
			<view class="add-tip">
				<input type="text" v-model="elementName" placeholder="名称" placeholderStyle="text-align: center; color: #ccc; line-height: 60rpx;" />
			</view>
		</u-modal>
		
		<u-overlay :show="operateShow" @click="changeOperate" opacity="rgba(0, 0, 0, 0)">
			<view class="operate-box">
				<view @click="openRenameElement" class="operate-name">重命名</view>
				<view @click="deleteElement" class="operate-name">删除</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: '',
				operateShow: false,
				renameElementShow: false,
				elementName: '',
				_elementName: '',
				elementId: '',
				elementInfo: []
			}
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.elementId = options.elementId
			this.elementName = options.elementName
			this._elementName = this.elementName
		},
		onShow() {
			this.getElementInfo()
		},
		methods: {
			changeOperate() {
				this.operateShow = !this.operateShow
			},
			/* 获取原料详情 */
			getElementInfo() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId,
						name: that.elementName
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.elementInfo = data
				})
			},
			/* 打开重命名 */
			openRenameElement() {
				this.renameElementShow = true
				this.operateShow = false
			},
			cancelRenameElement() {
				this.renameElementShow = false
			},
			/* 修改原料信息 */
			editElementInfo() {
				let that = this
				that.request({
					url: `${that.config.ingredientInfo}/${that.elementId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.elementName
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.renameElementShow = false
							that._elementName = that.elementName
							that.getElementInfo()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除原料 */
			deleteElement() {
				let that = this
				uni.showModal({
					content: '确定要删除该原料',
					success: function (res) {
						if (res.confirm) {
							that.request({
								url: that.config.deleteRecipeElement,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
								data: {
									storeId: that.storeId,
									name: that.elementName
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
			/* 供货商编辑 */
			goEditSupplier(item) {
				uni.navigateTo({
					url: '../element/edit?supplierId=' + item.id + '&elementName=' + this.elementName + '&elementId=' + item.id +
						'&supplierName=' + item.supplierName
				})
			},
			/* 新价格 */
			addSupplier() {
				uni.navigateTo({
					url: '../element/edit?elementName=' + this.elementName
				})
			}
		}
	}
</script>

<style scoped>
	.element-operate {
		position: relative;
		margin: 40rpx;
	}

	.element-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	.supplier-box {
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
