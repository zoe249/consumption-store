<template>
	<view class="wrap">
		<view class="upload-box">
			<u-upload ref="uploadRef" :deletable="false" :fileList="fileList1" @delete="deletePic"
				@afterRead="afterRead" name="1" :maxCount="1" height="750rpx" width="750rpx">
			</u-upload>
		</view>
		<view class="store-box">
			<view class="store-img">
				<image :src="store.logo == null ? defaultHead : store.logo"></image>
			</view>
			<view>
				<view>{{store.name}}</view>
				<view class="store-address">{{store.state}}{{store.city}}{{store.district}}{{store.address}}</view>
			</view>
		</view>
		<view class="save-btn">
			<view class="replace-btn" @click="replace">替换</view>
			<view @click="submit">完成</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				store: {},
				storeId: '',
				userInfo: {},
				fileList1: [{
					url: '',
				}],
				qiniuToken: '',
				key: '',
				sign: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getQiniuToken()
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
					that.fileList1[0].url = that.store.sign
					that.key = that.store.sign.slice(28)
				})
			},
			replace() {
				this.$refs.uploadRef.chooseFile()
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
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 新增前删除原图片
				this.fileList1.splice(0, 1)
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
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
						title: '请输入店铺形象',
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
							sign: 'https://qiaokun.yuepong.com/' + that.key,
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
	.store-box {
		display: flex;
		align-items: center;
		background-color: #F2AB99;
		color: #fff;
		padding: 40rpx 46rpx;
		font-size: 28rpx;
	}

	.store-img {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-address {
		font-size: 24rpx;
		padding-top: 14rpx;
	}

	.wrap>>>.u-upload__wrap__preview {
		margin: 0;
	}

	.save-btn {
		margin-top: 54rpx;
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
</style>
