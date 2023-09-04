<template>
	<view>
		<view class="banner-pic" v-if="storeQrcode !== ''">
			<!-- <view class="delete-img">
				<image :src="imgUrl + 'delete.png'" mode=""></image>
			</view> -->
			<image :src="storeQrcode" mode="widthFix"></image>
		</view>
		<view class="upload-box" v-else>
			<view class="upload-sign">
				<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
			</view>
		</view>
		<view style="height: 165rpx;"></view>
		<view class="add-btn-box">
			<view class="add-btn" @click="generateProgramCode" v-if="storeQrcode === ''">生成小程序码</view>
			<block v-else>
				<view class="add-btn again-add" @click="generateProgramCode">重新生成</view>
				<view class="add-btn" @click="savePic">保存至本地</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				picList: [],
				storeQrcode: '',
				storeId: '',
				qiniuToken: '',
				storeQrcodePath: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.getQiniuToken()
			this.getStoreInfo()
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
					that.storeQrcode = data.smallCode == null ? '' : data.smallCode
					uni.getImageInfo({
						src: data.smallCode,
						success: (image) => {
							console.log(image)
							that.storeQrcodePath = image.path
						},
						fail: (err) => {
							uni.hideLoading()
						}
					});
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
			uploadFilePromise() {
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
						filePath: that.storeQrcodePath,
						header: {
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							console.log('上传后的图片', data)
							let pic = 'https://qiaokun.yuepong.com/' + data.key
							that.storeQrcode = pic
							that.saveQrcode()
						},
						fail(err) {
							console.log('上传失败', err)
						}
					});
				})
			},
			/* 生成小程序码 */
			generateProgramCode() {
				let that = this
				uni.request({
					url: `${that.config.protocol}${that.config.host}store-service/api/v1.0/stores/weChat/miniProgram/qrCode`,
					responseType: 'arraybuffer',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime(),
						Authorization: `Bearer ${uni.getStorageSync('token')}`
					},
					method: 'POST',
					data: {
						path: 'custom/home/index/index',
						storeId: that.storeId
					},
					success(res) {
						console.log('小程序码', res)
						if (res.statusCode == '200') {
							const data = res.data
							let url = 'data:image/png;base64,' + uni.arrayBufferToBase64(data)
							// base64格式转换成临时图片路径
							base64ToPath(url)
								.then(path => {
									console.log('转换成功', path)
									that.storeQrcodePath = path
									that.uploadFilePromise()
								})
								.catch(error => {
									console.error(error)
								})
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					}
				})
			},
			/* 保存二维码 */
			saveQrcode() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						smallCode: that.storeQrcode
					}
				}).then(res => {
					console.log('保存', res)
					let data = res.data
					if (data.code == 200000) {
						uni.showToast({
							title: '生成成功',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 保存到相册 */
			savePic() {
				var that = this
				uni.saveImageToPhotosAlbum({
					filePath: that.storeQrcodePath,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						})
					},
					complete() {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style>
	.upload-tip {
		background-color: #F2FAFE;
		color: #7CD1F8;
		font-size: 28rpx;
		padding: 36rpx 24rpx;
		line-height: 44rpx;
	}

	.upload-box {
		margin: 14rpx 24rpx 0;
		background-color: #eee;
		border-radius: 10rpx;
	}

	.upload-sign {
		width: 700rpx;
		height: 270rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}

	.banner-pic {
		margin: 14rpx 24rpx 0;
		position: relative;
		border-radius: 10rpx;
	}

	.banner-pic image {
		width: 700rpx;
		height: auto;
		display: block;
	}

	.delete-img {
		background-color: rgba(0, 0, 0, .5);
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
	}

	.delete-img image {
		width: 48rpx;
		height: 54rpx;
	}

	.add-btn-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 40rpx 24rpx;
		background-color: #fff;
	}

	.add-btn {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
		font-size: 28rpx;
	}
	
	.add-btn.again-add{
		background-color: #fff;
		color: #F2AB99;
		margin-bottom: 14rpx;
	}
</style>