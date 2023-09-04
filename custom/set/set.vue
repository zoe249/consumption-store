<template>
	<view>
		<view class="address-manager" @click="editPersonalInfo">
			<view class="address-icon">个人资料</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
		<view class="address-manager" @click="managerAddress">
			<view class="address-icon">地址管理</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
		<view class="address-manager" @click="goStoreApply">
			<view class="address-icon">店铺入驻</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
		<view class="address-manager" @click="productFeedback">
			<view class="address-icon">产品反馈</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
		<view class="address-manager" @click="aboutProcedure">
			<view class="address-icon">关于悦小店</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
		<button open-type="contact" class="address-manager">
			<view class="address-icon">联系客服</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</button>
		<view class="address-manager" @click="goLogoutUser">
			<view class="address-icon">注销账号</view>
			<u-icon name="arrow-right" size="10"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressId: '',
				auditResult: '',
				applyId: '',
				isApplyState: false,
				addState: false
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.addressId = options.addressId
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.getApplyDetailByUser()
		},
		methods: {
			/* 跳转修改个人资料 */
			editPersonalInfo() {
				uni.navigateTo({
					url: './personalData'
				})
			},
			/* 地址管理 */
			managerAddress() {
				uni.navigateTo({
					url: '../address/choose?managerState=true&storeId=' + this.storeId
				})
			},
			/* 产品反馈 */
			productFeedback() {
				uni.navigateTo({
					url: './feedback'
				})
			},
			/* 关于悦小店 */
			aboutProcedure() {
				uni.navigateTo({
					url: './about'
				})
			},
			/* 跳转注销账号 */
			goLogoutUser() {
				uni.navigateTo({
					url: './logout'
				})
			},
			/* 跳转店铺入驻 */
			goStoreApply() {
				this.addState = uni.getStorageSync('addState')
				console.log('addState', this.addState)
				console.log('isApplyState', this.isApplyState)
				if (!this.isApplyState || this.addState) {
					console.log('11111111')
					// 未申请过审核
					uni.navigateTo({
						url: '/store/settled/tip'
					})
				} else {
					if (this.auditResult == 5) {
						console.log('222222')
						// 顾客取消申请
						uni.navigateTo({
							url: '/store/settled/tip'
						})
					} else {
						console.log('33333')
						uni.navigateTo({
							url: '/store/settled/add?applyId=' + this.applyId + '&auditResult=' + this.auditResult
						})
					}
				}
			},
			/* 根据账户获取审核详情 */
			getApplyDetailByUser() {
				let that = this
				that.request({
					url: that.config.userStoreMaterials
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						// 已申请过审核
						const data = res.data.data
						that.auditResult = data.auditResult
						that.applyId = data.id
						that.isApplyState = true
					} else {
						that.isApplyState = false
					}
				})
			}
		}
	}
</script>

<style scoped>
	.address-manager {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		border-radius: 10rpx;
		padding: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		line-height: unset;
	}
	
	.address-manager::after {
		border: none;
	}
	
	.address-icon {
		display: flex;
		align-items: center;
		color: #000;
		font-size: 28rpx;
	}
</style>