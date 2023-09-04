<template>
	<view class="wrap">
		<view class="upload-box">
			<view class="store-qrcode">
				<image :src="qrCode"></image>
			</view>
		</view>
		<view class="save-btn">
			<view class="replace-btn" @click="chooseImage">替换</view>
			<view @click="saveQrcode">完成</view>
		</view>
		<view class="qrcode-tip">打开微信 - 我 - 个人信息 获取二维码图片</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				store: {}, // 店铺信息
				storeId: '',
				userInfo: {}, // 用户信息
				qiniuToken: '', //七牛云token
				key: '', //上传文件的key值
				weChatQRCode: '', //二维码url
				qrCode: ''
			}
		},
		onLoad: function(option) {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getStoreInfo()
			this.getQiniuToken()
		},
		methods: {
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					console.log('门店信息', res)
					let data = res.data.data
					that.store = data
					that.qrCode = data.weChatQRCode
					that.key = data.weChatQRCode.slice(28)
				})
			},
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			/* 选择图片 */
			chooseImage() {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths))
						console.log(res.tempFilePaths)
						that.qrCode = res.tempFilePaths[0]
						that.uploadFilePromise(that.qrCode)
					}
				})
			},
			uploadFilePromise(url) {
				let that = this
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl,
						filePath: url,
						header: {
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken,
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							that.key = data.key
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					})
				})
			},
			/* 保存二维码 */
			saveQrcode() {
				let that = this
				if (that.key === '') {
					uni.showToast({
						title: '请上传店主的二维码',
						icon: 'none',
						duration: 2000
					})
				} else {
					that.request({
						url: `${that.config.stores}/${that.storeId}`,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							unionId: that.userInfo.uid,
							weChatQRCode: 'https://qiaokun.yuepong.com/' + that.key,
						}
					}).then(res => {
						console.log('保存', res)
						let data = res.data
						if (data.code == 200000) {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 2000)
						} else {
							uni.showToast({
								title: data.detail,
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
	.store-qrcode {
		margin: 20rpx 0;
		text-align: center;
	}

	.store-qrcode image {
		width: 534rpx;
		height: 534rpx;
	}

	.save-btn view {
		margin: 20rpx 24rpx;
		border-radius: 50rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #fff;
		color: #F2AB99;
		font-size: 28rpx;
	}

	.save-btn view.replace-btn {
		background-color: #F2AB99;
		color: #fff;
	}

	.qrcode-tip {
		color: #999;
		font-size: 24rpx;
		text-align: center;
		padding-top: 20rpx;
	}
</style>
