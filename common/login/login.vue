<template>
	<view class="wray">
		<!-- 项目名称 -->
		<view class="applet-name">{{ appletName }}</view>

		<!-- 获取用户基础信息 -->
		<view v-if="userShow" class="describe">{{ describeUser }}</view>
		<button v-if="userShow" class="button-login" @click="onGotUserInfo">授权用户信息</button>

		<!-- 用户注册、获取手机号 -->
		<view v-if="!userShow" class="describe">{{ describe }}</view>
		<button v-if="!userShow" class="button-login" open-type="getPhoneNumber"
			@getphonenumber="getPhoneNumber">微信一键授权登录</button>

		<!-- 隔离层 -->
		<view style="height: 100rpx;"></view>

	</view>
</template>

<script>
	import Vue from 'vue';
	export default {
		data() {
			return {
				appletName: this.config.appletName, // 小程序名称
				loginShow: true,
				userShow: true,
				stateData: {},
				describeUser: this.config.describeUser, // 小程序名称
				describe: this.config.describe, // 小程序名称
				location: '', // 当前位置
				totalNum: 0 // 购物车商品角标
			}
		},
		mounted() {
			// this.getLocation()
			// this.onLogin() // 先执行自动登录
			// 判断是否授权用户信息
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo.nickname == '' || userInfo.nickname == undefined) {
				this.userShow = true
			} else {
				this.userShow = false
			}
		},
		methods: {
			// 登录
			onLogin(res) {
				let that = this
				uni.login({
					success: res => {
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin,
							method: 'POST',
							data: {
								grant_type: 'wx_mini_program', // 固定值
								client_id: 'app_client', // 固定值
								client_secret: '123', // 固定值
								user_type: '2', // 固定值
								code: res.code,
								location: that.location
							}
						}).then(res => {
							// 用户存在
							if (res.statusCode == 200 && res.data.message != "身份验证失败") {
								that.userShow = Boolean
								// 保存 token 到全局
								getApp().globalData.accessToken = res.data.access_token
								uni.setStorageSync('token', res.data.access_token)
								// 登录状态
								getApp().globalData.loginState = true
								// 获取用户id
								that.userId()
								that.$emit('isToken', true)
								uni.showToast({
									title: '登录成功',
								})
							} else {
								that.userShow = true
							}
						})
					}
				})
			},
			getPhoneNumber(e) {
				let that = this
				let userProfile = uni.getStorageSync('userProfile')
				// 获取用户信息
				uni.getUserInfo({
					success: function(infoRes) {
						if (e.detail.errMsg == 'getPhoneNumber:ok') {
							uni.login({
								success: res => {
									console.log(userProfile)
									uni.removeStorageSync('token')
									that.request({
										url: that.config.registerPhone,
										method: 'POST',
										header: {
											'Content-Type': 'application/json; charset=utf-8'
										},
										data: {
											code: res.code,
											userInfoIv: userProfile.iv,
											userInfoEncryptedData: userProfile.encryptedData,
											phoneIv: e.detail.iv,
											phoneEncryptedData: e.detail.encryptedData,
											kocStatus: 2
										}
									}).then(res => {
										console.log(res);
										// 用户注册成功
										if (res.statusCode == 200 && res.data.message != "身份验证失败") {
											// 保存 token 到全局
											getApp().globalData.accessToken = res.data.accessToken
											uni.setStorageSync('token', res.data.access_token)
											// 登录状态
											getApp().globalData.loginState = true

											// 重新获取登录数据
											that.loginInfo()

										} else {
											uni.showToast({
												title: res.data.detail,
												icon: 'none',
												duration: 2000
											})
											// 用户未注册 保存 token 到全局
											getApp().globalData.accessToken = ''
											// 登录状态
											getApp().globalData.loginState = false
										}
									})
								}
							})
						}
					},
					fail: function() {
						// 获取用户信息失败后。请跳转授权页面
						uni.showModal({
							title: '提示',
							content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting() // 打开权限设置
								}
							}
						})
					}
				})
			},
			// 点击获取用户信息
			onGotUserInfo(e) {
				let that = this
				/*
				 * @Description: 2021年4月13日后发布的新版本小程序，
				 * 				开发者调用wx.getUserInfo或<button open-type="getUserInfo"/>将不再弹出弹窗，
				 * 				直接返回匿名的用户个人信息，获取加密后的openID、unionID数据的能力不做调整。
				 * 				新增getUserProfile接口，可获取用户头像、昵称、性别及地区信息，开发者每次通过该接口获取用户个人信息均需用户确认.
				 * @Author: lili
				 * @Date: 2021-04-08
				 */
				wx.getUserProfile({
					desc: '授权用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						console.log(res)
						getApp().globalData.userInfo = res.userInfo
						uni.setStorageSync('userInfo', res.userInfo)
						uni.setStorageSync('userProfile', res)
						uni.setStorageSync('isUserInfo', true)
						that.onLogin()
					}
				})
			},
			// 重新获取登录数据
			loginInfo() {
				let that = this
				uni.login({
					success: res => {
						that.request({
							url: that.config.getLogin,
							method: 'POST',
							data: {
								grant_type: 'wx_mini_program', // 固定值
								client_id: 'app_client', // 固定值
								client_secret: '123', // 固定值
								user_type: '2', // 固定值
								code: res.code,
								location: that.location
							}
						}).then(res => {
							// 用户存在
							if (res.statusCode == 200 && res.data.message != "身份验证失败") {
								// 保存 token 到全局
								getApp().globalData.accessToken = res.data.access_token
								uni.setStorageSync('token', res.data.access_token)
								// 登录状态
								getApp().globalData.loginState = true

								// 获取用户id
								that.userId()
								that.getCartProductList()
								that.$emit('isToken', true)
								uni.showToast({
									title: '登录成功',
									duration: 2000
								})
							}
						})
					}
				})
			},
			// 获取用户id
			userId() {
				let that = this
				that.request({
					url: that.config.userInfo
				}).then(res => {
					if (res.statusCode != 200) return
					// 保存用户信息到全局
					getApp().globalData.userId = res.data
					uni.setStorageSync('kocsInfo', res.data)
					this.getKocAmountInfo()
				})
			},
		}
	}
</script>

<style scoped>
	.applet-name {
		width: 500rpx;
		margin: 70rpx auto 0;
		text-align: center;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 80rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.describe {
		width: 650rpx;
		margin: 50rpx auto 0;
		font-size: 28rpx;
		color: #666666;
		text-align: center;
		line-height: 40rpx;
	}

	.button-login {
		width: 300rpx;
		height: 70rpx;
		margin: 50rpx auto 70rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 70rpx;
		background-color: #C73C23;
	}
</style>
