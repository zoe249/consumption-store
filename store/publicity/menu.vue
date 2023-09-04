<template>
	<view>
		<view class="upload-tip">
			<view>注意事项</view>
			<view>1、为避免图片因比例导致的变形，请在上传前将图片尺寸设置为350*135</view>
		</view>
		<view class="menu-tip">菜单图</view>
		<view class="banner-pic" v-if="tomorrowMenu !== ''">
			<view class="delete-img">
				<image :src="imgUrl + 'delete.png'" mode="" @click="deleteImg('1')"></image>
			</view>
			<image :src="tomorrowMenu" mode="widthFix"></image>
		</view>
		<view class="upload-box">
			<u-upload @afterRead="afterRead" :multiple="false" name="1">
				<view class="upload-sign">
					<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
				</view>
			</u-upload>
		</view>
		<view class="menu-tip">首页图</view>
		<view class="banner-pic" v-if="tomorrowHomeMenu !== ''">
			<view class="delete-img">
				<image :src="imgUrl + 'delete.png'" mode="" @click="deleteImg('2')"></image>
			</view>
			<image :src="tomorrowHomeMenu" mode="widthFix"></image>
		</view>
		<view class="upload-box">
			<view class="default-box" v-if="isDefalut">
				<image mode="widthFix" :src="defaultPic" class="default-upload-img"></image>
				<view class="mask">
					<view class="delete-img">
						<image :src="imgUrl + 'delete.png'" mode="" @click="handleDelete"></image>
					</view>
				</view>
			</view>
			
			<u-upload v-else @afterRead="afterRead" :multiple="false" name="2" :deletable="deletable">
				
				<view class="upload-sign">
					<!-- <image mode="widthFix" :src="defaultPic" class="default-upload-img"></image> -->
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
				tomorrowMenu: '',
				storeId: '',
				tomorrowHomeMenu: '',
				type: '' ,// 1菜单图，2首页图
				defaultPic:'https://qiaokun.yuepong.com/tomorrow-home-menu-default.jpg',
				isDefalut: false, // 是否显示删除图片的按钮
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
				console.log(event.name)
				this.type = event.name
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
							if (that.type == 1) {
								// 菜单图
								that.tomorrowMenu = pic
							} else if (that.type == 2) {
								// 首页图
								that.tomorrowHomeMenu = pic
							}
						},
						fail(err) {
							console.log('上传失败', err)
						}
					});
				})
			},
			/* 删除图片 */
			deleteImg(type) {
				if (type == 1) {
					// 菜单图
					this.tomorrowMenu = ''
				} else if (type == 2) {
					// 首页图
					this.tomorrowHomeMenu = ''
				}
			},
			/* 保存明日菜单图 */
			editStoreBanner() {
				let that = this
				if (this.isDefalut) {
					that.tomorrowHomeMenu = that.defaultPic
					this.isDefalut = false
				}
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						tomorrowMenu: that.tomorrowMenu,
						tomorrowMenuHomePic: that.tomorrowHomeMenu
					}
				}).then(res => {
					console.log('保存明日菜单图', res)
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
			/* 获取明日菜单图 */
			getStorePublicity() {
				let that = this
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`
				}).then(res => {
					console.log('获取明日菜单图', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.tomorrowMenu = data.tomorrowMenu == null ? '' : data.tomorrowMenu
						that.tomorrowHomeMenu = data.tomorrowMenuHomePic == null ? '' : data.tomorrowMenuHomePic
						if (that.tomorrowHomeMenu) {
							that.isDefalut = false
						} else {
							that.isDefalut = true
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			
			// 删除默认图片
			handleDelete() {
				this.isDefalut = false
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
	
	.menu-tip{
		color: #999;
		font-size: 28rpx;
		margin: 24rpx;
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
	
	.default-box {
		position: relative;
		width: 700rpx;
		height: 270rpx;
		display: flex;
		justify-content: center;
	}
	
	.default-box .mask{
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
	
	.default-upload-img { 
		width: 100%;
		height: 100%;
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
