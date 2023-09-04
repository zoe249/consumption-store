<template>
	<view :class="loading ? 'loading-state' : ''">
		<u-sticky>
			<block v-if="loginRefresh">
				<yp-nav title="店铺形象" :custome="custome" :shareState="shareState" :loginState="loginState" :storeHome="true"></yp-nav>
			</block>
		</u-sticky>
		<u-skeleton rows="3" avatar avatarSize="40" :loading="loading">
			<view class="store-map">
				<view class="store-sign">
					<image :src="storeInfo.sign" mode="widthFix"></image>
				</view>
				<view class="store-box">
					<view class="store-logo-box" @click="previewQrcode">
						<image class="store-logo" :src="storeInfo.logo ? storeInfo.logo : defaultHead"></image>
						<image class="store-qrcode" src="../../../static/store/qrcode.png"></image>
					</view>
					<view class="store-info">
						<view class="store-operate">
							<view class="business-time-box">
								<view class="store-name">{{storeInfo.name}}</view>
								<view class="business-time">{{storeInfo.businessLicenseDate}} 年店</view>
							</view>
							<view class="customer-num">粉丝数：{{storeInfo.storeCustomerCount}}</view>
						</view>
						<view class="store-address">
							{{storeInfo.state}}{{storeInfo.city}}{{storeInfo.district}}{{storeInfo.address}}
						</view>
						<view class="store-time">
							<view>
								<view class="open-time">营业时间：{{storeInfo.openingTime}}-{{storeInfo.closingTime}}</view>
								<block v-if="storeInfo.dayOffName == null">
									<view class="close-time">{{storeInfo.businessDayName}}营业</view>
								</block>
								<block v-else>
									<view class="close-time">{{storeInfo.dayOffName}}店休</view>
								</block>
							</view>
							<view class="store-icon">
								<view class="share-icon" @click="makeCall(storeInfo.phone)">
									<image src="../../../static/custome/phoneIcon.png" mode="heightFix"></image>
								</view>
								<view class="share-icon" @click="goMap(storeInfo)">
									<image src="../../../static/custome/localIcon.png" mode="heightFix"></image>
								</view>
								<view class="share-icon">
									<button open-type="share">
										<image src="../../../static/custome/storeShare.png" mode="heightFix"></image>
									</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<map style="width: 100%; height: 750rpx;" :latitude="latitude" :longitude="longitude" :markers="covers" :enable-traffic="true">
			</map>
		</u-skeleton>
		<!-- <view class="buginess-box">
			<view v-for="(item, index) in businessList" :key="index" class="business" @click="goBusiness(item)">
				<view class="business-img">
					<image :src="item.img"></image>
				</view>
				<view>{{item.name}}</view>
			</view>
		</view> -->
		<!-- 登录 -->
		<!-- <u-popup :show="isLogin" @close="close" mode="bottom">
			<view class="qr-code-popup">
				<on-login v-if="isLogin" :storeId="storeId" :isLogin="isLogin" @change="close"></on-login>
			</view>
		</u-popup> -->

		<!-- 会员二维码 -->
		<view v-if="qrcodeShow" class="qrcode-box" @touchmove.stop.prevent="stopRoll" @click="closeQrcode">
			<view class="qrcode-img" @click.stop="previewQrcode">
				<view class="qrcode-user-info">
					<image class="user-img" :src="storeInfo.logo"></image>
					<view>
						<view>{{storeInfo.name}}</view>
						<view class="user-phone">{{storeInfo.phone}}</view>
					</view>
				</view>
				<!-- <yp-qrcode :text="qrcodeCont" :size="size" :quality="quality"></yp-qrcode> -->
				<image :src="storeInfo.weChatQRCode" mode="" class="store-qrcode-img"></image>
				<view class="qrcode-tip">扫码可添加店家微信</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	// import onLogin from '../../../common/login/loginbak'
	import ypQrcode from "@/components/yp-qrcode/yp-qrcode.vue"
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				storeId: '', // 当前门店id
				storeInfo: {}, // 当前门店信息
				show: false,
				isLogin: false, // 判断是否登录
				custome: true,
				shareState: false,
				qrcodeShow: false,
				qrcodeCont: '', // 要生成的二维码值
				size: 180,
				quality: 'L',
				userInfo: {},
				latitude: '',
				longitude: '',
				covers: [{
					id: 1,
					latitude: '',
					longitude: '',
					iconPath: '/static/custome/local.png',
					width: 18,
					height: 23
				}], // 地图标记点配置
				loading: true,
				loginState: false, // 是否已注册
				loginRefresh: false
				// businessList: [{
				// 	img: '../../../static/custome/allGoods.png',
				// 	name: '所有宝贝',
				// 	url: '../../goods/index/index?storeId='
				// }, {
				// 	img: '../../../static/store/menu.png',
				// 	name: '每日菜单',
				// 	url: '../../dailyMenu/dailyMenu?storeId='
				// }, {
				// 	img: '../../../static/store/baked.png',
				// 	name: '商品预定',
				// 	url: '../../fresh/fresh?storeId='
				// }]
			}
		},
		components: {
			ypNav,
			// onLogin,
			ypQrcode
		},
		onLoad(options) {
			if (options.storeId) {
				this.storeId = options.storeId
			}
			// 获取用户信息
			this.userInfo = uni.getStorageSync('userInfo')
			let userInfo = {
				openId: this.userInfo.openId
			}
			// this.qrcodeCont = uni.getStorageSync('storeInfo').weChatQRCode
			this.shareState = options.shareState == 'true' ? true : false
			if (this.shareState) {
				// 分享进入
				uni.hideHomeButton()
			}
		},
		onShow() {
			// 获取当前门店信息
			this.getCurrentStoreInfo()
			this.onLogin()
			// if (uni.getStorageSync('token') === '') {
			// 	console.log('登录')
			// 	this.isLogin = true
			// } else {
			// 	// 获取当前门店信息
			// 	this.getCurrentStoreInfo()
			// }
		},
		onShareAppMessage(res) {
			return {
				title: this.storeInfo.name,
				imageUrl: this.storeInfo.sign,
				path: '/custom/storehome/index/index?storeId=' + this.storeId + '&shareState=true&custome=true'
			}
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
					} else {
						that.loginState = false
					}
				})
			},
			// close(value) {
			// 	this.isLogin = value
			// 	this.userInfo = uni.getStorageSync('userInfo')
			// 	this.getCurrentStoreInfo()
			// },
			// 获取当前店铺信息
			getCurrentStoreInfo() {
				let that = this
				that.request({
					url: that.config.stores + `/${this.storeId}`,
					header: {
						'Authorization': 'Bearer' + ' ' + uni.getStorageSync('token')
					},
				}).then((res) => {
					console.log('门店信息', res)
					const data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					that.latitude = data.latitude
					that.longitude = data.longitude
					that.covers[0].latitude = data.latitude
					that.covers[0].longitude = data.longitude
					setTimeout(() => {
						that.loading = false
					}, 1000)
				})
			},
			/* 拨打电话 */
			makeCall(phone) {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId + '&storeHome=true'
					})
				} else {
					uni.makePhoneCall({
						phoneNumber: phone
					})
				}
			},
			/* 跳转地图 */
			goMap(storeInfo) {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId + '&storeHome=true'
					})
				} else {
					uni.navigateTo({
						url: '../map/map?storeInfo=' + JSON.stringify(storeInfo)
					})
				}
			},
			// goBusiness(item) {
			// 	uni.navigateTo({
			// 		url: item.url + this.storeId
			// 	})
			// },
			/* 预览店主二维码 */
			// previewQrcode() {
			// let that = this
			// console.log('预览')
			// let arr = []
			// arr.push(that.storeInfo.weChatQRCode)
			// uni.previewImage({
			// 	urls: arr,
			// 	longPressActions: {
			// 		itemList: ['保存图片'],
			// 		success: function(data) {
			// 			console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			// 		},
			// 		fail: function(err) {
			// 			console.log(err.errMsg);
			// 		}
			// 	}
			// });
			// }
			/* 预览二维码 */
			previewQrcode() {
				this.qrcodeShow = true
			},
			closeQrcode() {
				this.qrcodeShow = false
			},
		}
	}
</script>

<style scoped>
	.loading-state {
		background-color: #fff;
		height: 100vh;
		padding: 24rpx;
	}

	.store-sign,
	.store-sign image {
		width: 750rpx;
		height: auto;
	}

	.store-map {
		position: relative;
		margin-bottom: 22rpx;
	}

	.store-box {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .7);
		color: #fff;
		font-size: 24rpx;
		padding: 40rpx 24rpx 40rpx 44rpx;
		display: flex;
	}

	.store-logo-box {
		margin-right: 20rpx;
		position: relative;
	}

	.store-logo {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-qrcode {
		position: absolute;
		top: 54rpx;
		right: -6rpx;
		width: 32rpx;
		height: 32rpx;
		border-radius: 10rpx;
	}

	.store-info {
		width: 85%;
	}

	.store-operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 18rpx;
	}

	.business-time-box {
		display: flex;
		align-items: center;
	}

	.store-name {
		font-size: 28rpx;
		margin-right: 12rpx;
	}

	.business-time {
		color: #fff;
		font-size: 20rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		width: 80rpx;
		border: 2rpx solid #fff;
		text-align: center;
	}

	.customer-num {
		font-size: 28rpx;
		color: #fff;
	}

	.store-icon {
		display: flex;
		align-items: center;
	}

	.share-icon {
		margin-right: 26rpx;
	}

	.share-icon:last-child {
		margin-right: 0;
	}

	.share-icon image {
		width: auto;
		height: 40rpx;
	}

	.share-icon button {
		background-color: transparent;
		padding: 0;
		height: unset;
		line-height: unset;
	}

	.share-icon button::after {
		border: none;
	}

	.store-address {
		padding-bottom: 20rpx;
		/* overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis; */
	}

	.store-time {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.open-time {
		margin-bottom: 16rpx;
	}

	.buginess-box {
		background-color: #fff;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #666;
		margin-top: 20rpx;
		padding: 40rpx 0;
	}

	.business {
		padding: 0 46rpx;
		text-align: center;
	}

	.business-img {
		padding-bottom: 32rpx;
	}

	.business-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	/* 二维码 */
	.qrcode-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qrcode-img {
		background-color: #fff;
		padding: 40rpx;
		border-radius: 10rpx;
		width: 500rpx;
	}

	.qrcode-user-info {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.user-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user-phone {
		color: #999;
		padding-top: 12rpx;
	}
	
	.store-qrcode-img{
		width: 360rpx;
		height: 360rpx;
		margin: 0 auto;
		display: block;
	}

	.qrcode-tip {
		color: #999;
		font-size: 28rpx;
		text-align: center;
		padding-top: 40rpx;
	}

	.custom-qrcode>>>.canvas-qrcode {
		float: unset !important;
	}
</style>
