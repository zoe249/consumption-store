<template>
	<view class="wrap">
		<u-cell-group class="store-group" :border="false">
			<u-cell title="头像" isLink @click="replace()" :titleStyle="{'color': '#999'}">
				<view slot="value">
					<u-upload ref="uploadRef" :deletable="false" :fileList="fileList1" @delete="deletePic"
						@afterRead="afterRead" name="1" multiple :maxCount="1" height="100rpx" width="100rpx">
					</u-upload>
				</view>
			</u-cell>
			<u-cell title="名称" isLink url="/store/updateName/updateName" :titleStyle="{'color': '#999'}">
				<view slot="value">
					<view class="store-value">
						{{store.name}}
					</view>
				</view>
			</u-cell>
			<u-cell title="店铺地址" isLink url="/store/updateAddress/updateAddress" :border="false" :titleStyle="{'color': '#999'}">
				<view slot="value">
					<view class="store-value" v-if="store.state !== null">
						{{store.state}}{{store.city}}{{store.district}}{{store.address}}
					</view>
				</view>
			</u-cell>
		</u-cell-group>
		<u-cell-group class="store-group" :border="false">
			<u-cell title="联系电话" isLink url="/store/updatePhone/updatePhone" :titleStyle="{'color': '#999'}">
				<view slot="value" class="">
					<view class="store-value" v-if="store.phone !== null">
						{{store.phone}}
					</view>
				</view>
			</u-cell>
			<u-cell title="店铺形象" isLink url="/store/updateSign/updateSign" :titleStyle="{'color': '#999'}"></u-cell>
			<block v-if="store.storeType != 1">
				<u-cell title="店铺收款码" isLink url="/store/payQrcode/payQrcode" :titleStyle="{'color': '#999'}"></u-cell>
			</block>
			<u-cell title="店主的二维码" isLink url="/store/updateWeChatQRCode/updateWeChatQRCode" :titleStyle="{'color': '#999'}">
			</u-cell>
			<u-cell title="营业时间" isLink url="/store/updateTime/updateTime" :titleStyle="{'color': '#999'}">
				<view slot="value" class="">
					<view class="store-value" v-if="store.openingTime !== null">
						{{store.openingTime}}-{{store.closingTime}}
					</view>
				</view>
			</u-cell>
			<!-- 展示版隐藏 -->
			<block v-if="store.storeType != 1">
				<u-cell title="配送设置" isLink url="/store/deliverySet/deliverySet" :border="false" :titleStyle="{'color': '#999'}"></u-cell>
			</block>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				store: {},
				userInfo: {}, // 用户信息
				qiniuToken: '', //七牛云token
				hey: '', //上传文件的hey值
				src: '',
				fileList1: [{
					url: '',
				}],
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.store = uni.getStorageSync('storeInfo')
			this.getQiniuToken()
		},
		onShow() {
			this.getStores()
		},
		methods: {
			replace() {
				this.$refs.uploadRef.chooseFile()
			},
			getStores() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.store.id
				}).then(res => {
					let data = res.data.data
					that.store = data
					uni.setStorageSync('storeInfo', data)
					that.fileList1[0].url = data.logo == null ? that.defaultHead : data.logo
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
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							that.key = data.key
							that.submit()
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
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
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							that.key = data.key
							that.submit()
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			submit() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.store.id,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						unionId: that.userInfo.uid,
						logo: 'https://qiaokun.yuepong.com/' + that.key
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						})
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

<style scoped>
	.wrap >>> .u-cell-group {
		margin: 24rpx 20rpx;
		background: #ffffff;
		border-radius: 10rpx;
	}
	
	.wrap >>> .u-cell__body{
		padding: 26rpx 0;
		margin: 0 20rpx;
		border-bottom: 1rpx solid #F4F4F4;
	}
	
	.wrap >>> .u-cell__body:last-child{
		border-bottom: 0;
	}
	
	.wrap >>> .u-line{
		display: none;
	}
	
	.wrap >>> .u-cell__title-text{
		font-size: 28rpx;
		min-width: 132rpx;
	}
	
	.wrap >>> .u-upload__wrap__preview image{
		border-radius: 50%;
	}
	
	.store-value{
		font-size: 28rpx;
		line-height: 44rpx;
	}
	
	.wrap >>> .u-upload__wrap__preview{
		margin: 0 12rpx 0 0;
	}
	
	.wrap >>> .u-cell__right-icon-wrap{
		margin: 0;
	}

	.store-group {
		margin-bottom: 20rpx;
	}

	img {
		width: 160rpx;
		height: 160rpx;
	}
</style>
