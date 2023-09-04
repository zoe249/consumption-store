<template>
	<view>
		<view class="input-box">
			<u--input
			    placeholder="请输入联系电话"
			    v-model="phone" :clearable="true" fontSize="28rpx" :maxlength="11"
			  ></u--input>
		</view>
		<view class="save-btn" @click="savePhone">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				store: {}, // 店铺信息
				userInfo: {}, // 用户信息
				phone: '',
				storeId: ''
			}
		},
		onLoad: function(option) {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.getStoreInfo()
		},
		methods: {
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					let data = res.data.data
					that.store = data
					that.phone = data.phone
				})
			},
			/* 保存手机号 */
			savePhone() {
				var that = this
				if (that.phone === '') {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none',
						duration: 2000
					})
				} else if (!(/^1[3456789]\d{9}$/.test(that.phone))) {
					uni.showToast({
						title: '联系电话格式不正确',
						icon: 'none',
						duration: 2000
					})
				} else {
					that.request({
						url: that.config.stores + '/' + that.storeId,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							unionId: that.userInfo.uid,
							phone: that.phone
						}
					}).then(res => {
						if (res.data.code == '200000') {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							})
							setTimeout(() => {
								uni.navigateBack();
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
	}
</script>

<style scoped>
	.input-box{
		margin: 20rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.save-btn {
		margin: 40rpx 24rpx 0;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}
	.input-box >>> input{
		height: 80rpx;
		line-height: 80rpx;
	}
	.input-box >>> .u-input{
		padding-top: 0 !important;
		padding-bottom: 0 !important;
		padding-left: 20rpx !important;
		padding-right: 20rpx !important;
	}
</style>
