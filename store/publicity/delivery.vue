<template>
	<view>
		<view class="upload-tip">
			<view>注意事项</view>
			<view>1、为避免图片因比例导致的变形，请在上传前将图片尺寸设置为350*135</view>
		</view>
		<view class="banner-pic" v-if="deliveryPicture !== ''">
			<view class="delete-img">
				<image :src="imgUrl + 'delete.png'" mode="" @click="selectImg(index)"></image>
			</view>
			<image :src="deliveryPicture" mode="widthFix"></image>
		</view>
		<view class="upload-box">
			<u-upload @afterRead="afterRead" :multiple="false">
				<view class="upload-sign">
					<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
				</view>
			</u-upload>
		</view>
		<view style="height: 165rpx;"></view>
		<view class="add-btn-box">
			<view class="add-btn" @click="editStoreBanner">完成</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				picList: [],
				deliveryPicture: '',
				storeId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.getStorePublicity()
			this.getQiniuToken()
		},
		methods: {
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this.picList.length
				lists.map((item) => {
					this.picList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.picList[fileListLen]
					this.picList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
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
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							console.log('上传后的图片', data)
							let pic = 'https://qiaokun.yuepong.com/' + data.key
							that.deliveryPicture = pic
						},
						fail(err) {
							console.log('上传失败', err)
						}
					});
				})
			},
			/* 删除图片 */
			selectImg(index) {
				this.deliveryPicture = ''
			},
			/* 保存送货到家图 */
			editStoreBanner() {
				let that = this
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						deliveryPicture: that.deliveryPicture
					}
				}).then(res => {
					console.log('保存送货到家图', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
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
			},
			/* 获取送货到家图 */
			getStorePublicity() {
				let that = this
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`
				}).then(res => {
					console.log('获取送货到家图', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.deliveryPicture = data.deliveryPicture == null ? '' : data.deliveryPicture
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
	
	.add-btn-box{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 40rpx 24rpx;
		background-color: #fff;
	}
	
	.add-btn{
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
		font-size: 28rpx;
	}
</style>
