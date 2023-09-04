<template>
	<view>
		<view class="input-box">
			<u--input
			    placeholder="输入店铺名"
			    v-model="storeName" :clearable="true" fontSize="28rpx"
			  ></u--input>
		</view>
		<view class="save-btn" @click="submit">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				store: {}, // 店铺信息
				userInfo: {}, // 用户信息
				storeName: '',
				storeId: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.getStores()
		},
		methods: {
			getStores() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeId
				}).then(res => {
					let data = res.data.data
					that.store = data
					that.storeName = data.name
				})
			},
			submit() {
				var that = this
				if (that.storeName === '') {
					uni.showToast({
						title: '请输入店铺名',
						icon: 'none',
						duration: 2000
					})
				}
				else{
					that.request({
						url: that.config.stores + '/' + that.storeId,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							unionId: that.userInfo.uid,
							name: that.storeName
						}
					}).then(res => {
						if (res.data.code == '200000') {
							uni.showToast({
								title: '保存成功',
								icon: 'none',
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
		},
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
