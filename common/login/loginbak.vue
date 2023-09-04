<template>
	<view class="wray">
		<!-- 项目名称 -->
		<view class="applet-name">{{ appletName }}</view>

		<!-- 获取用户基础信息 -->
		<view v-if="isShow" class="describe">{{ describeUser }}</view>
		<button v-if="isShow" class="button-login" @click="onGotUserInfo">授权用户信息</button>

		<!-- 用户注册、获取手机号 -->
		<view v-if="!isShow" class="describe">{{ describe }}</view>
		<button v-if="!isShow" class="button-login" open-type="getPhoneNumber"
			@getphonenumber="getPhoneNumber">微信一键授权登录</button>

		<!-- 隔离层 -->
		<view style="height: 100rpx;"></view>

	</view>
</template>

<script>
	import Vue from 'vue';
	export default {
		props: {
			storeId: String
		},
		data() {
			return {
				isShow: true,
				appletName: this.config.appletName, // 小程序名称
				loginShow: true,
				timestamp: '',
				code: '', //微信登录code
				userInfoEncryptedData: '', //用户信息加密数据
				userInfoIv: '', //用户信息加密向量
				phoneEncryptedData: '', //用户手机加密信息
				phoneIv: '', //用户手机加密向量
				phone: '', // 用户的手机号
				userInfo: {}
			}
		},
		mounted() {
			this.userInfo = uni.getStorageSync('userLoginInfo').userInfo
			console.log('当前的storeId', this.storeId)
			// this.onLogin() // 先执行自动登录
			// 判断是否授权用户信息
			let userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			// 登录
			onLogin(res) {
				let that = this
				uni.showLoading({
					title: '登录中'
				})
				uni.login({
					success: res => {
						uni.setStorageSync('code', res.code)
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02&storeId=' + that.storeId + '&avatar=&nick_name=',
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
						}).then(res => {
							uni.hideLoading()
							// 用户存在
							let data = res.data
							// that.$refs.loading.close()
							if (res.statusCode == 200 && data.access_token) {
								// 保存 token 到全局
								uni.setStorageSync('token', data.access_token)
								that.getLoginUser()

							} else {
								console.log('走注册')
							}
						})
					}
				})
			},
			getPhoneNumber(e) {
				console.log('获取用户手机号', e)
				let that = this
				// 获取用户信息
				uni.getUserInfo({
					success: function(infoRes) {
						if (e.detail.errMsg == 'getPhoneNumber:ok') {
							uni.login({
								success: res => {
									uni.removeStorageSync('token')
									console.log('---------------------', that.config.register)
									that.request({
										url: that.config.decryptPhone,
										header: {
											'Content-Type': 'application/json; charset=utf-8'
										},
										method: 'POST',
										data: {
											code: res.code,
											phoneIv: e.detail.iv,
											phoneEncryptedData: e.detail.encryptedData,
										}
									}).then(res => {
										console.log(res, 111)
										// 注册成功后，再次登录一遍
										// that.onLogin()
										if (res.data.code == 200000) {
											that.phone = res.data.data
											that.register()
										}
									})
								}
							})
						}
					},
				})
			},
			// 注册用户
			register() {
				let that = this
				uni.login({
					success: res => {
						uni.removeStorageSync('token')
						that.request({
							url: that.config.register,
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
							data: {
								code: res.code,
								userInfoIv: that.userInfoIv,
								userInfoEncryptedData: that
									.userInfoEncryptedData,
								phone: that.phone
							}
						}).then(res => {
							if (res.data.code == 200000) {
								that.onLogin()
							}
						})
					}
				})
			},
			/* 获取登录用户管理的所有门店列表 */
			// getUserStore() {
			// 	let that = this
			// 	that.request({
			// 		url: that.config.staffStore
			// 	}).then(res => {
			// 		console.log('用户下门店列表', res)
			// 		const data = res.data.data
			// 		if (data.length < 2) {
			// 			// 只有一个店铺或无店铺权限
			// 			that.storeId = data[0].id
			// 			that.getLoginUser()
			// 		} else {
			// 			// 跳转店铺选择页面
			// 			uni.reLaunch({
			// 				url: '/store/storeList/storeList'
			// 			})
			// 		}
			// 	})
			// },
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
						this.$emit('change', false)
					} else {

					}
				})
			},
			// 点击获取用户信息
			onGotUserInfo(e) {
				let that = this
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						console.log('获取用户信息', res)
						that.userInfoEncryptedData = res.encryptedData
						that.userInfoIv = res.iv
						that.isShow = false
					}
				})

			},
			// 重新获取登录数据
			loginInfo() {
				let that = this
				uni.login({
					success: res => {
						uni.setStorageSync('code', res.code)
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02&avatar=' +
								that.userInfo.avatarUrl + '&nick_name=' + that.userInfo.nickname,
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
						}).then(res => {
							// 用户存在
							let data = res.data
							that.$refs.loading.close()
							if (res.statusCode == 200 && data.access_token) {
								// 保存 token 到全局
								uni.setStorageSync('token', data.access_token)
								// 获取登录用户
								that.getLoginUser()
							} else {
								// 跳转注册页面
								uni.reLaunch({
									url: '../main/main'
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
