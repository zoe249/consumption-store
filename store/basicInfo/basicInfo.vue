<template>
	<view>
		<u-sticky>
			<view class="nav-box" :style="{ 'padding-top': statusBarHeight + 9 + 'px'}">
				<view @click="goHome">
					<u-icon name="home" color="#333" size="22"></u-icon>
				</view>
				<view>基本信息设置</view>
				<view style="width: 20rpx;"></view>
			</view>
			<view class="step-box">
				<view v-for="(item, index) in stepList" :key="index" class="step-cont"
					:class="stepIdx < index ? '' : 'active-step'">
					<view class="step-img">
						<image :src="item.img" mode="widthFix" v-if="stepIdx < index"></image>
						<image :src="item.activeImg" mode="widthFix" v-else></image>
					</view>
					<view>{{item.name}}</view>
				</view>
			</view>
		</u-sticky>
		<!-- 店铺头像 -->
		<view v-if="stepIdx == 0" class="upload-avatar-box">
			<view class="upload-tip">请上传店铺头像</view>
			<block v-if="storeLogo !== ''">
				<view class="goods-img-box">
					<image :src="storeLogo" class="goods-img" />
					<image src="../../static/goods/closeIcon.png" class="delete-goods-img" @click="deletePic('1')">
					</image>
				</view>
			</block>
			<block v-else>
				<view class="upload-avatar" @click="chooseStoreImg('1')">
					<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
				</view>
			</block>
		</view>
		<!-- 基础信息 -->
		<view v-if="stepIdx == 1">
			<view class="upload-tip">请设置店铺基础信息</view>
			<view class="store-base-info">
				<view class="base-info">
					<view>店铺名称</view>
					<view>{{storeInfo.name}}</view>
				</view>
				<view class="base-info">
					<view>店铺地址</view>
					<view class="input-box" @click="selectLocation">
						<input type="text" placeholder="省市区" :disabled="true" class="input-right"
							:placeholder-style="style" v-model="areaValue">
						<u-icon name="arrow-right" color="#666" size="12"></u-icon>
					</view>
				</view>
				<view class="base-info">
					<input type="text" placeholder="详细地址" class="input-address" :placeholder-style="style"
						v-model="address">
				</view>
				<view class="base-info">
					<view>店铺联系方式</view>
					<view>
						<input type="text" placeholder="输入联系电话" class="input-right" :placeholder-style="style"
							v-model="phone">
					</view>
				</view>
			</view>
		</view>
		<!-- 店铺形象 -->
		<view v-if="stepIdx == 2" class="upload-avatar-box">
			<view class="upload-tip">请上传店铺形象图</view>
			<block v-if="storeSign !== ''">
				<view class="goods-img-box">
					<image :src="storeSign" class="store-sign" mode="widthFix" />
					<image src="../../static/goods/closeIcon.png" class="delete-goods-img" @click="deletePic('2')">
					</image>
				</view>
			</block>
			<block v-else>
				<view class="upload-sign" @click="chooseStoreImg('2')">
					<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
				</view>
			</block>
		</view>
		<!-- 二维码 -->
		<view v-if="stepIdx == 3">
			<view class="upload-avatar-box">
				<view class="upload-tip">请上传<text class="price">店主</text>二维码</view>
				<block v-if="storeQrcode !== ''">
					<view class="goods-img-box">
						<image :src="storeQrcode" class="store-qrcode" mode="widthFix" />
						<image src="../../static/goods/closeIcon.png" class="delete-goods-img" @click="deletePic('4')">
						</image>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseStoreImg('3')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
			<view class="upload-avatar-box">
				<view class="upload-tip">请上传<text class="price">店铺</text>收款码</view>
				<block v-if="storePayQrcode !== ''">
					<view class="goods-img-box">
						<image :src="storePayQrcode" class="store-qrcode" mode="widthFix" />
						<image src="../../static/goods/closeIcon.png" class="delete-goods-img" @click="deletePic('4')">
						</image>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseStoreImg('4')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
		</view>
		<!-- 营业时间 -->
		<block v-if="stepIdx == 4">
			<view class="upload-tip">请设置营业时间</view>
			<view class="open-hours">
				<view class="open-title">营业时间</view>
				<view class="time-box">
					<picker mode="time" :value="openingTime" @change="changeOpenTime">
						<view class="time">{{openingTime}}</view>
					</picker>
					<view class="zhi">—</view>
					<picker mode="time" :value="closingTime" @change="changeCloseTime">
						<view class="time">{{closingTime}}</view>
					</picker>
				</view>
			</view>
			<view class="open-week-hours">
				<view class="open-title">营业日期</view>
				<view v-for="(item, index) in timeList" :key="index" class="week-box"
					:class="item.isSelect ? 'week-active' : ''" @click="selectWeek(item)">{{item.value}}</view>
			</view>
			<view class="delivery-time">
				<view class="open-title">自提时间(全部商品出炉时间)</view>
				<view class="time-box">
					<picker mode="time" :value="lastExtractionTime" @change="changeLastExtractionTime">
						<view class="time">{{lastExtractionTime}}</view>
					</picker>
				</view>
			</view>
		</block>

		<view style="height: 170rpx;"></view>
		<view class="submit-btn">
			<view class="last-step" @click="lastStep" v-if="stepIdx != 0">上一步</view>
			<view @click="nextStep" :class="stepIdx == 0 ? 'next-step' : ''" v-if="stepIdx != 4">下一步</view>
			<view v-if="stepIdx == 4" @click="saveStoreInfo">完成</view>
		</view>
	</view>
</template>

<script>
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				statusBarHeight: 0,
				imgUrl: this.config.imgUrl,
				stepList: [{
					activeImg: this.config.imgUrl + 'avatar.png',
					img: '',
					name: '店铺头像'
				}, {
					activeImg: this.config.imgUrl + 'baseinfoFill.png',
					img: this.config.imgUrl + 'baseinfo.png',
					name: '基础信息'
				}, {
					activeImg: this.config.imgUrl + 'signFill.png',
					img: this.config.imgUrl + 'sign.png',
					name: '店铺形象'
				}, {
					activeImg: this.config.imgUrl + 'qrcodeFill.png',
					img: this.config.imgUrl + 'qrcode.png',
					name: '二维码'
				}, {
					activeImg: this.config.imgUrl + 'timeFill.png',
					img: this.config.imgUrl + 'time.png',
					name: '营业时间'
				}],
				stepIdx: 0,
				storeLogo: '',
				avatarList: [],
				qiniuToken: '',
				style: 'color: #999; font-size: 28rpx;',
				phone: '',
				areaValue: '',
				address: '',
				state: '',
				city: '',
				district: '',
				longitude: '',
				latitude: '',
				storeSign: '',
				businessCardList1: [], // 店铺形象
				storeQrcode: '',
				storePayQrcode: '',
				openingTime: '', //营业开始时间
				closingTime: '', //营业结束时间
				timeList: [{
					value: '周一',
					isSelect: false,
					key: '1'
				}, {
					value: '周二',
					isSelect: false,
					key: '2'
				}, {
					value: '周三',
					isSelect: false,
					key: '3'
				}, {
					value: '周四',
					isSelect: false,
					key: '4'
				}, {
					value: '周五',
					isSelect: false,
					key: '5'
				}, {
					value: '周六',
					isSelect: false,
					key: '6'
				}, {
					value: '周日',
					isSelect: false,
					key: '7'
				}],
				businessDay: '', //营业日
				dayOff: '', //休息日
				lastExtractionTime: '', // 最晚提货时间
				storeId: '',
				storeInfo: {},
				applyId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
				}
			})
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = options.storeId
			this.applyId = options.applyId == undefined ? '' : options.applyId
		},
		onShow() {
			this.onLogin()
		},
		methods: {
			/* 登录 */
			onLogin() {
				let that = this
				uni.login({
					success: res => {
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02' + '&store_id=' + that.storeId + '&avatar=&nick_name=',
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
						}).then(res => {
							// 用户存在
							let data = res.data
							if (res.statusCode == 200) {
								console.log('登录成功')
								// 保存 token 到全局
								uni.setStorageSync('token', data.access_token)
								that.loginState = true
								that.getLoginUser() // 获取用户信息
								// that.attentionStore() // 关注店铺
							} else {
								console.log('未登录')
								that.loginState = false
							}
							that.loginRefresh = false
							that.$nextTick(() => {
								that.loginRefresh = true
							})
						})
					}
				})
			},
			/* 获取登录用户信息 */
			getLoginUser() {
				let that = this
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					if (res.data.code == 200000) {
						let data = res.data.data
						// 缓存用户信息
						uni.setStorageSync('userInfo', data)
						that.getQiniuToken()
						if (that.applyId === '') {
							that.getStoreInfo()
							that.getStoreDetail()
						} else {
							that.getStoreApplyInfo()
						}
						// that.getStoreDetailInfo()
					} else {
						that.loginState = false
					}
				})
			},
			/* 获取店铺初始创建信息 */
			getStoreDetail() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}/storeEstablishInfo`
				}).then(res => {
					console.log('店铺详情', res)
					const data = res.data.data
					// that.storeInfo = res.data.data
					that.phone = data.phone
				})
			},
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`,
				}).then(res => {
					let data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					if (that.storeInfo.openingTime == undefined) {
						that.openingTime = '08:00'
						that.closingTime = '20:00'
					} else {
						that.openingTime = that.storeInfo.openingTime
						that.closingTime = that.storeInfo.closingTime
					}
					// 最晚提货时间
					if (that.storeInfo.lastExtractionTime == undefined) {
						// 默认比营业结束时间提前一小时
						let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
						let closingTime = new Date(dateDay + ' ' + that.closingTime)
						that.lastExtractionTime = date.parseTime(Number(closingTime.getTime() - 3600000),
							"{h}:{i}")
					} else {
						that.lastExtractionTime = that.storeInfo.lastExtractionTime
					}
					that.state = data.state
					that.city = data.city
					that.district = data.district
					that.areaValue = that.state + that.city + that.district
					that.address = data.address
					that.longitude = data.longitude
					that.latitude = data.latitude
					
					that.storeLogo = data.logo == null ? '' : data.logo
					that.storeSign = data.sign == null ? '' : data.sign
					that.storeQrcode = data.weChatQRCode == null ? '' : data.weChatQRCode
					that.storePayQrcode = data.payeeCode == null ? '' : data.payeeCode
					that.store = data
					if (data.businessDay !== null) {
						const nowData = data.businessDay.split(',')
						this.timeList.forEach(item => {
							if (nowData.some(itemt => itemt === item.key)) {
								item.isSelect = true
							} else {
								item.isSelect = false
							}
						})
					}
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
			// 删除图片
			deletePic(type) {
				// this.avatarList.splice(event.index, 1)
				if (type == '1') {
					// 店铺头像
					this.storeLogo = ''
				} else if (type == '2') {
					// 店铺形象
					this.storeSign = ''
				} else if (type == '3') {
					// 店铺二维码
					this.storeQrcode = ''
				} else if (type == '4') {
					// 店铺收款二维码
					this.storePayQrcode = ''
				}
			},
			uploadFilePromise(url, type) {
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
							let pic = 'https://qiaokun.yuepong.com/' + data.key
							if (type == '1') {
								// 店铺头像
								that.storeLogo = pic
							} else if (type == '2') {
								// 店铺形象
								that.storeSign = pic
							} else if (type == '3') {
								// 店铺二维码
								that.storeQrcode = pic
							} else if (type == '4') {
								// 店铺收款二维码
								that.storePayQrcode = pic
							}
						},
						fail(err) {
							console.log('上传失败', err)
						}
					});
				})
			},
			/* 下一步 */
			nextStep() {
				this.stepIdx++
			},
			/* 上一步 */
			lastStep() {
				this.stepIdx--
			},
			// /* 获取店铺详细信息 */
			// getStoreDetailInfo() {
			// 	let that = this
			// 	that.request({
			// 		url: that.config.stores + '/' + that.storeId
			// 	}).then(res => {
			// 		console.log('店铺详细信息', res)
			// 		let data = res.data.data
			// 		that.storeLogo = data.logo
			// 		that.storeSign = data.sign
			// 		that.storeQrcode = data.weChatQRCode
			// 		that.storePayQrcode = data.payeeCode
			// 		that.store = data
			// 		if (data.businessDay !== null) {
			// 			const nowData = data.businessDay.split(',')
			// 			this.timeList.forEach(item => {
			// 				if (nowData.some(itemt => itemt === item.key)) {
			// 					item.isSelect = true
			// 				} else {
			// 					item.isSelect = false
			// 				}
			// 			})
			// 		}
			// 	})
			// },
			selectWeek(item) {
				item.isSelect = !item.isSelect
			},
			/* 修改店铺开始时间 */
			changeOpenTime(e) {
				this.openingTime = e.detail.value
			},
			/* 修改店铺结束时间 */
			changeCloseTime(e) {
				this.closingTime = e.detail.value
			},
			/* 修改最晚提货时间 */
			changeLastExtractionTime(e) {
				this.lastExtractionTime = e.detail.value
			},
			/* 保存店铺基本信息 */
			saveStoreInfo() {
				var that = this
				let data = this.timeList.map(item => {
					if (item.isSelect) {
						return item.key
					}
				})
				data = data.filter(item => item !== undefined)
				this.businessDay = data.join(',')
				data = this.timeList.map(item => {
					if (!item.isSelect) {
						return item.key
					}
				})
				data = data.filter(item => item !== undefined)
				this.dayOff = data.join(',')
				that.request({
					url: that.config.stores + '/' + that.storeId,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						logo: that.storeLogo,
						openingTime: that.openingTime,
						closingTime: that.closingTime,
						businessDay: that.businessDay,
						dayOff: that.dayOff,
						sign: that.storeSign,
						weChatQRCode: that.storeQrcode,
						phone: that.phone,
						state: that.state,
						city: that.city,
						district: that.district,
						address: that.address,
						longitude: that.longitude,
						latitude: that.latitude,
						payeeCode: that.storePayQrcode,
						lastExtractionTime: that.lastExtractionTime
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none',
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
							})
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 手动选择位置定位 */
			selectLocation() {
				let that = this
				uni.chooseLocation({
					success: function(res) {
						console.log('选择位置', res)
						that.address = res.address + res.name
						that.latitude = res.latitude
						that.longitude = res.longitude
						that.getLocation()
					}
				})
			},
			getLocation() {
				let that = this
				// 逆地址解析方法
				let qqmapsdk = new QQMapWX({
					// 填写自己的Key值，这个值是与AppID绑定的
					key: '2XOBZ-JNIKG-CEIQ5-IIBLI-JPQVE-VVFUZ'
				});
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: that.latitude,
						longitude: that.longitude
					},
					success(res) {
						console.log('地址', res);
						that.state = res.result.address_component.province
						that.city = res.result.address_component.city
						that.district = res.result.address_component.district
						that.areaValue = that.state + that.city + that.district
						// 截取详细地址
						var reg = new RegExp(that.state + that.city + that.district, "g");
						var address = that.address.replace(reg, "");
						that.address = address
					}
				})
			},
			/* 选择图片 */
			chooseStoreImg(type) {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(res.tempFilePaths);
						that.uploadFilePromise(res.tempFilePaths[0], type)
					}
				});
			},
			/* 返回顾客端 */
			goHome() {
				uni.reLaunch({
					url: '/store/storeHomepage/storeHomepage?storeId=' + this.storeId
				})
			},
			/* 获取审核店铺信息 */
			getStoreApplyInfo() {
				let that = this
				that.request({
					url: that.config.applyStoreInfo,
					data: {
						materialId: that.applyId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.storeId = res.data.data.id
						that.getStoreInfo()
						that.getStoreDetail()
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
	/* .step-box>>>.u-text__value--content {
		color: #ccc;
	}

	.step-box>>>.u-text__value--main {
		color: #F2AB99;
		font-size: 28rpx !important;
	}

	.step-box>>>.u-steps-item__wrapper__circle {
		background-color: #eee;
		border: none !important;
		width: 60rpx !important;
		height: 60rpx !important;
	} */
	
	.nav-box {
		background-color: #fff;
		color: #333;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 38rpx 24rpx;
	}

	.step-box {
		background-color: #fff;
		padding: 40rpx 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #CCCCCC;
	}

	.step-cont {
		text-align: center;
		position: relative;
		width: 112rpx;
	}

	.active-step {
		color: #F2AB99;
	}

	.active-step .step-img {
		background-color: #F2AB99;
	}

	.step-img {
		background-color: #eee;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 30rpx;
	}

	.step-img image {
		width: 30rpx;
		height: auto;
	}

	.step-cont:nth-child(n+2):after {
		content: '';
		height: 2rpx;
		width: 68rpx;
		background: #eee;
		position: absolute;
		left: -45%;
		top: 30rpx;
	}

	.step-cont.active-step:nth-child(n+2):after {
		background: #F2AB99;
	}

	.upload-avatar-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.upload-tip {
		color: #333;
		font-size: 32rpx;
		padding: 40rpx 0;
		text-align: center;
	}

	.upload-avatar {
		width: 240rpx;
		height: 240rpx;
		background-color: #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}

	.submit-btn {
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #F4F4F4;
		padding: 40rpx 24rpx;
	}

	.submit-btn view {
		height: 80rpx;
		line-height: 80rpx;
		width: 342rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
	}

	.submit-btn view.last-step {
		background-color: transparent;
		color: #F2AB99;
		margin-right: 14rpx;
	}

	.submit-btn view.next-step {
		width: 100%;
	}

	.store-base-info {
		margin: 0 24rpx;
		padding: 0 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.base-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
		color: #333;
		font-size: 28rpx;
	}

	.base-info:last-child {
		border-bottom: 0;
	}

	.base-info input {
		text-align: right;
	}

	.input-address {
		width: 100%;
	}

	.input-box {
		display: flex;
		align-items: center;
	}

	.upload-sign {
		background-color: #fff;
		border-radius: 10rpx;
		width: 700rpx;
		height: 340rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-qrcode {
		width: 400rpx;
		height: 400rpx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.open-hours {
		display: flex;
		align-items: center;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 0 24rpx 20rpx;
	}

	.open-title {
		color: #999;
		font-size: 28rpx;
		padding-right: 36rpx;
		min-width: 108rpx;
		line-height: 64rpx;
	}

	.time-box {
		display: flex;
		align-items: center;
	}

	.time {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		width: 200rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		border-radius: 10rpx;
	}

	.zhi {
		padding: 0 20rpx;
	}

	.open-week-hours {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 20rpx 24rpx;
		font-size: 28rpx;
		color: #999;
	}

	.week-box {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		border: 1rpx solid #999;
		background-color: #EBEBEB;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.week-box.week-active {
		border: 1rpx solid #F2AB99;
		color: #F2AB99;
		background-color: #FCEEEB;
	}

	.week-box:nth-child(5),
	.week-box:nth-child(6),
	.week-box:nth-child(7),
	.week-box:nth-child(8) {
		margin-bottom: 0;
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

	.delivery-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 20rpx 24rpx;
	}

	.goods-img-box {
		position: relative;
	}

	.goods-img {
		width: 240rpx;
		height: 240rpx;
		background-color: #fff;
		border-radius: 50%;
	}

	.delete-goods-img {
		position: absolute;
		right: -15rpx;
		top: -15rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.store-sign {
		width: 700rpx;
		height: auto;
	}

	.store-qrcode {
		width: 400rpx;
		height: auto;
	}
</style>
