<template>
	<view>
		<view class="edit-box">
			<view class="edit-btn" @click="addDescription">
				<image src="../../static/goods/addIcon.png"></image>
				<view>文字</view>
			</view>
			<view class="edit-btn" @click="addDescImg">
				<image src="../../static/goods/addImg.png"></image>
				<view>图片</view>
			</view>
			<!-- <u-upload @afterRead="afterRead" name="1" multiple :maxCount="10">
				<view class="edit-btn add-img">
					<image src="../../static/goods/addImg.png"></image>
					<view>图片</view>
				</view>
			</u-upload> -->
		</view>
		<view v-for="(item, index) in fullDescList" :key="index" class="add-box">
			<view v-if="item.description != undefined">
				<view class="add-tip">
					<view>文字新增</view>
					<image src="../../static/goods/closeIcon.png" mode="" @click="deletePic(index)"></image>
				</view>
				<u--textarea v-model="item.description" placeholder="请输入内容"></u--textarea>
			</view>
			<view v-if="item.img != undefined || item.tempFilePath != undefined">
				<view class="add-tip">
					<view>图片新增</view>
					<view @click="deletePic(index)">
						<image src="../../static/goods/closeIcon.png"></image>
					</view>
				</view>
				<view @click="chooseImg(item, index)">
					<view class="upload-sign" v-if="item.img === '' && item.tempFilePath === ''">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
					<block v-if="item.img !== ''">
						<image :src="item.img" mode="widthFix" class="picture-box"></image>
					</block>
					<block v-if="item.tempFilePath !== '' && item.tempFilePath != undefined">
						<video :src="item.tempFilePath"></video>
					</block>
				</view>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
		<view class="save-btn" @click="saveDescription">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				fileList1: [], // 图片列表
				// fullDescList: [{
				// 	description: '',
				// 	pictureList: [],
				// 	select: true
				// }],
				pictureList: [],
				qiniuToken: '',
				editGood: false,
				fullDescList: [],
				tempFilePath: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.getQiniuToken()
			// this.editGood = options.editGood
			// if (options.fullDesc == 'null' || options.fullDesc === '') {
			// 	this.fullDescList = []
			// }
			// if (uni.getStorageSync('fullDescription') !== '') {
			// 	console.log('1111111111111')
			// 	this.editGood = 'true'
			// 	options.fullDesc = uni.getStorageSync('fullDescription')
			// }
			// if (this.editGood == 'true') {
			// 	console.log('2222222')
			// 	this.editGood = true
			// 	// 编辑商品
			// 	let fullDesc = options.fullDesc.split(',')
			// 	fullDesc.splice(fullDesc.length -1, 1)
			// 	let flag = -1
			// 	let leng = fullDesc.filter(data => (data.indexOf('https://') < 0)).length
			// 	for (let i = 0; i < leng - 1; i++) {
			// 		this.fullDescList.push({
			// 			description: '',
			// 			pictureList: [],
			// 			select: true
			// 		})
			// 	}
			// 	fullDesc.forEach(item => {
			// 		if (item.indexOf('https') > -1) {
			// 			this.fullDescList[flag].pictureList.push(item)
			// 		} else {
			// 			flag++
			// 			this.fullDescList[flag].description = item
			// 		}
			// 	})
			// 	console.log('fullDescList', this.fullDescList)
			// } else {
			// 	console.log('33333333333')
			// 	this.editGood = false
			// 	this.fullDescList = []
			// 	uni.setStorageSync('fullDescription', '')
			// }
			// let videoType = ['AVI', 'mov', 'rmvb', 'rm', 'FLV', 'mp4', '3GP']
			// let flag = false
			if (options.fullDesc != undefined && options.fullDesc !== '') {
				let fullDesc = options.fullDesc.split(',')
				console.log('fullDesc', fullDesc)
				fullDesc.forEach(item => {
					console.log(item.indexOf('https://'))
					console.log(item.indexOf('http://'))
					if (item.indexOf('https://') > -1) {
						// 照片
						this.fullDescList.push({
							img: item
						})
						// // 照片或视频
						// // AVI、mov、rmvb、rm、FLV、mp4、3GP
						// videoType.forEach(video => {
						// 	if (item.indexOf(video) > -1) {
						// 		console.log('是视频文件')
						// 		flag = true
						// 	}
						// })
						// if (flag) {
						// 	this.fullDescList.push({
						// 		tempFilePath: item
						// 	})
						// } else {
						// 	this.fullDescList.push({
						// 		img: item
						// 	})
						// }
					} else if (item.indexOf('http://') > -1) {
						// 视频
						this.fullDescList.push({
							tempFilePath: item
						})
					} else {
						// 文字
						this.fullDescList.push({
							description: item
						})
					}
				})
				console.log('fullDescList', this.fullDescList)
			}
		},
		methods: {
			/* 新增文字 */
			addDescription() {
				this.fullDescList.push({
					description: ''
				})
				// this.editGood = false
				// this.fullDescList.push({
				// 	description: '',
				// 	pictureList: [],
				// 	select: true
				// })
				// this.fontShow = true
			},
			/* 新增图片 */
			addDescImg() {
				this.fullDescList.push({
					img: '',
					tempFilePath: ''
				})
			},
			/* 选择图片 */
			chooseImg(item, index) {
				let that = this
				uni.chooseMedia({
					count: 1,
					mediaType: ['image', 'video'],
					sourceType: ['album', 'camera'],
					maxDuration: 15,
					camera: 'back',
					success(res) {
						console.log(res.tempFiles)
						if (res.tempFiles[0].thumbTempFilePath == undefined) {
							console.log('添加图片')
							// 添加图片
							item.img = res.tempFiles[0].tempFilePath
							that.uploadFilePromise(item)
						} else {
							console.log('添加视频')
							if (res.tempFiles[0].duration > 15) {
								uni.showToast({
									title: '视频不可超过15秒',
									icon: 'none'
								})
							} else {
								item.tempFilePath = res.tempFiles[0].tempFilePath
							}
						}
					}
				})
				// uni.chooseImage({
				// 	count: 1,
				// 	success: (rst) => {
				// 		item.img = rst.tempFilePaths[0]
				// 		that.uploadFilePromise(item)
				// 	}
				// })
			},
			// addPicture() {
			// 	this.$refs.uploadRef.chooseFile()
			// },
			// /* 删除文字 */
			// deleteDesc(item) {
			// 	item.description = ''
			// 	item.select = false
			// },
			/* 删除文字/图片 */
			deletePic(index) {
				this.fullDescList.splice(index, 1)
			},
			/* 上传图片 */
			uploadFilePromise(item) {
				let that = this
				let leng = this.fullDescList.length - 1
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
						filePath: item.img,
						header: {
							"Content-Type": "multipart/form-data",
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken,
						},
						success: (res) => {
							let pic = 'https://qiaokun.yuepong.com/' + JSON.parse(res.data).key
							item.img = pic
						}
					})
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
			/* 保存图文详情 */
			saveDescription() {
				let desc = ''
				console.log('fullDescList', this.fullDescList)
				this.fullDescList.forEach(item => {
					if (item.description !== '' && item.description != undefined) {
						desc += item.description + ','
					}
					if (item.img !== '' && item.img != undefined) {
						desc += item.img + ','
					}
					if (item.tempFilePath !== '' && item.tempFilePath != undefined) {
						desc += item.tempFilePath + ','
					}
				})
				desc = desc.slice(0, desc.length - 1)
				console.log('图文详情列表2', desc)
				uni.setStorageSync('fullDescription', desc)
				// 返回上一页
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.edit-box {
		padding: 40rpx 24rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
	}

	.edit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx dashed #F2AB99;
		border-radius: 16rpx;
		color: #F2AB99;
		width: 340rpx;
		margin-right: 20rpx;
		padding: 30rpx 0;
	}

	.edit-btn.add-img {
		border: 1rpx dashed #7CD1F8;
		color: #7CD1F8;
	}

	.edit-btn image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 14rpx;
	}

	.save-btn {
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		position: fixed;
		bottom: 20rpx;
		left: 24rpx;
		right: 24rpx;
		text-align: center;
		border-radius: 50rpx;
		font-size: 28rpx;
		z-index: 9999;
	}

	.add-box {
		margin: 0 24rpx 40rpx;
	}

	.add-tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		padding: 40rpx 20rpx 20rpx 0;
	}

	.add-tip image {
		width: 30rpx;
		height: 30rpx;
	}

	.picture-box {
		width: 100%;
		height: auto;
	}

	.upload-sign {
		width: 700rpx;
		height: 270rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}
</style>
