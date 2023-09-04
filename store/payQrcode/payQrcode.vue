<template>
	<view class="wrap">
		<view class="upload-box">
			<view class="store-qrcode">
				<image :src="qrCode" mode="widthFix"></image>
			</view>
		</view>
		<view class="save-btn">
			<view class="replace-btn" @click="chooseImage">替换</view>
			<view @click="submit">完成</view>
		</view>
		<view class="qrcode-tip">打开微信 - 我 - 个人信息  获取二维码图片</view>
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
				weChatQRCode: '', //二维码url
				qrCode: '',
				key: ''
			}
		},
		onLoad(option) {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getStores()
			this.getQiniuToken()
		},
		methods: {
			chooseImage() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						console.log(res.tempFilePaths)
						// 这里赋值的是临时文件
						that.qrCode = res.tempFilePaths[0]
						// 可以走一遍七牛，拿到线上的地址 比如 https://qiaokun..../key
						// that.src = https://qiaokun..../key
						that.uploadFilePromise(that.qrCode)
					}
				});
			},
			getStores() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeId
				}).then(res => {
					let data = res.data.data
					that.store = data
					that.qrCode = data.payeeCode
					that.key = data.payeeCode.slice(28)
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
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: url,
						header: {
							"Content-Type": "multipart/form-data",
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							that.key = data.key
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			submit() {
				let that = this
				if (that.key === '') {
					uni.showToast({
						title: '请上传店主的收款码',
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
							payeeCode: 'https://qiaokun.yuepong.com/' + that.key,
						}
					}).then(res => {
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
		height: auto;
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
	.qrcode-tip{
		color: #999;
		font-size: 24rpx;
		text-align: center;
		padding-top: 20rpx;
	}
</style>
