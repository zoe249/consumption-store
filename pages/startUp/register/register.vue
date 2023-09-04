<template>
	<view>
		<view class="store-box" :style="{ 'padding-top': statusBarHeight + 9 + 'px'}">
			<view class="store-nav">授权登录页</view>
		</view>
		<view class="login-box">
			<view class="logo">
				<image :src="imgUrl + 'fresh.png'" mode="widthFix"></image>
			</view>
			<view class="login-tip">为了更好的为你服务</view>
		</view>
		<view class="login-title-box">
			<view class="login-title">悦小店想要获取以下权限:</view>
			<view>获取你的手机号</view>
		</view>
		<view class="login-btn-box">
			<button class="login-btn btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<image :src="imgUrl + 'phone.png'" mode="widthFix"></image>
				<view>授权手机号</view>
			</button>
			<view class="cancle-btn btn" @click="cancelLogin">暂不授权</view>
		</view>
		<view class="slogan-box">
			<view>想让你的生活有面包~</view>
			<view class="enslogan">Bread in your life ~</view>
		</view>
	</view>
</template>

<script>
	import onLoading from '@/components/yp-loading/yp-loading.vue'
	export default {
		components: {
			onLoading
		},
		data() {
			return {
				imgUrl: this.config.imgUrl,
				statusBarHeight: 0,
				storeId: '', //门店id
				userLoginInfo: '', //用户登录信息
				addStoreState: false,
				pageIndex: 1,
				pageSize: 10,
				storeHome: false,
				dailyMenu: false,
				goodsReverse: false,
				code: '',
				_config: this.config
			}
		},
		onLoad(option) {
			uni.hideShareMenu()
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
				}
			})
			this.userLoginInfo = uni.getStorageSync('userLoginInfo');
			this.storeId = option.storeId == undefined ? '' : option.storeId
			this.addStoreState = option.addStoreState == 'true' ? true : false
			this.storeHome = option.storeHome == 'true' ? true : false
			this.dailyMenu = option.dailyMenu == 'true' ? true : false
			this.goodsReverse = option.goodsReverse == 'true' ? true : false
			this.code = uni.getStorageSync('code')
		},
		onShow() {
			let that = this
			uni.login({
				success: rs => {
					that.code = rs.code
					console.log('code', that.code)
				}
			})
		},
		methods: {
			// 解析手机号
			getPhoneNumber(e) {
				console.log('获取用户手机号', e)
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					uni.removeStorageSync('token')
					uni.request({
						url: `${that.config.protocol}${that.config.host}customer-service/api/v1.0/customers/register/weChat`,
						header: {
							'Content-Type': 'application/json; charset=utf-8'
						},
						method: 'POST',
						data: {
							code: that.code,
							phoneIv: e.detail.iv,
							phoneEncryptedData: e.detail.encryptedData,
						},
						success(res) {
							console.log(res)
							uni.hideLoading()
							console.log('注册', res);
							if (res.data.code == 200000) {
								uni.reLaunch({
									url: '/pages/startUp/index/index?storeId=' + that.storeId +
										'&addStoreState=' + that.addStoreState +
										'&storeHome=' + that.storeHome + '&dailyMenu=' + that
										.dailyMenu + '&goodsReverse=' + that.goodsReverse
								})
								// that.onLogin()
							} else {
								uni.showToast({
									title: res.data.detail,
									icon: 'none'
								})
							}
						}
					})
				} else {
					uni.hideLoading()
				}
			},
			// 注册用户
			// register() {
			// 	let that = this
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 	uni.login({
			// 		success: rs => {
			// 			uni.removeStorageSync('token')
			// 			uni.request({
			// 				url: 'https://www.yuepong.cn/dev/vibraphone/api-gateway/customer-service/api/v1.0/customers/register/weChat',
			// 				method: 'POST',
			// 				header: {
			// 					'Content-Type': 'application/json; charset=utf-8'
			// 				},
			// 				data: {
			// 					code: rs.code,
			// 					userInfoIv: res.userInfo.iv,
			// 					userInfoEncryptedData: res.userInfo
			// 						.encryptedData,
			// 					phone: that.phone
			// 				},
			// 				success() {
			// 					uni.hideLoading()
			// 					console.log('解析注册用户数据', res);
			// 					if (res.data.code == 200000) {
			// 						that.onLogin()
			// 					} else {
			// 						uni.showToast({
			// 							title: res.data.detail,
			// 							icon: 'none'
			// 						})
			// 					}
			// 				}
			// 			})
			// 		},
			// 		complete() {
			// 			uni.hideLoading()
			// 		}
			// 	})
			// },
			// 自动登录
			onLogin() {
				let that = this
				uni.login({
					success: rs => {
						uni.removeStorageSync('token')
						uni.request({
							url: `${that.config.protocol}${that.config.host}auth-service/api/v1.0/oauth/token` +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								rs.code + '&user_type=02&store_id=' + that.storeId + '&avatar=' +
								that.userLoginInfo.userInfo.avatarUrl + '&nick_name=' + that
								.userLoginInfo.userInfo.nickName,
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
							success() {
								console.log(res, '注册返回数据');
								// 用户存在
								let data = res.data
								if (res.statusCode == 200 && data.access_token) {
									// 保存 token 到全局
									uni.setStorageSync('token', data.access_token)
									// if (that.storeHome) {
									// 	// 从分享进入店铺主页
									// 	uni.reLaunch({
									// 		url: '/custom/storehome/index/index?storeId=' + that.storeId + '&shareState=true'
									// 	})
									// } else 
									if (that.dailyMenu) {
										// 从分享进入菜单
										uni.reLaunch({
											url: '/custom/dailyMenu/dailyMenu?storeId=' + that
												.storeId + '&shareState=true'
										})
									} else if (that.goodsReverse) {
										// 从分享进入商品预定
										uni.reLaunch({
											url: '/custom/fresh/fresh?storeId=' + that
												.storeId +
												'&shareState=true&receivingWay=1'
										})
									} else {
										that.getUserStore()
									}
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							}
						})
					}
				})
			},
			/* 获取登录用户管理的所有门店列表 */
			getUserStore() {
				let that = this
				that.request({
					url: that.config.manageStaffStore,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log('用户下门店列表', res)
					const data = res.data.data
					if (data.length < 2) {
						// 只有一个店铺或无店铺，顾客角色
						// 无门店id，进入虚拟店铺
						// that.storeId = '1550312409233756160' // 开发环境虚拟店铺门店id
						// that.storeId = '1539055200571101184' // 测试环境虚拟店铺门店id
						// // that.storeId = '1546688329209221120' // 正式环境虚拟店铺门店id
						// that.getStoreInfo()
						// that.storeId = uni.getStorageSync('storeId')
						console.log('是否有门店id', that.storeId)
						if (that.storeId === '') {
							// 无门店id，进入店圈页面
							uni.reLaunch({
								url: '/custom/trend/trend'
							})
						}
						that.getLoginUser() // 获取登录用户信息
					} else {
						// 商家角色
						if (that.storeId === '') {
							// 无门店id，跳转店铺选择页面
							uni.reLaunch({
								url: '/store/storeList/storeList'
							})
						} else {
							// 有门店id，跳转店铺主页
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
							})
						}
					}
				})
			},
			// 获取登录用户信息
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
						console.log(data, '用户信息')
						console.log('storeId', that.storeId)
						if (that.storeId !== '') {
							// 有门店id
							console.log('addStoreState', that.addStoreState)
							if (that.addStoreState) {
								// 创建店铺
								uni.reLaunch({
									url: '/store/addStore/addStore'
								})
							} else {
								if (data.roleId == 0) {
									uni.reLaunch({
										url: '/custom/home/index/index?storeId=' + that.storeId
									})
								} else {
									console.log('33333333333333333')
									uni.reLaunch({
										url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
									})
								}
							}
						}
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			cancelLogin() {
				uni.navigateTo({
					url: '/custom/trend/trend?storeId=' + this.storeId
				})
			},
			/* 获取门店信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeId
				}).then(res => {
					console.log('获取门店信息', res)
					let data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					// 跳转顾客端主页
					uni.reLaunch({
						url: '/custom/home/index/index?storeId=' + that.storeId
					})
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

<style scoped>
	.store-nav {
		text-align: center;
		padding: 0 0 38rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.logo {
		text-align: center;
		margin: 258rpx 0 40rpx;
		padding: 0 24rpx;
	}

	.logo image {
		width: 110rpx;
		height: auto;
	}

	.login-box {
		text-align: center;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.login-tip {
		color: #333;
		font-size: 28rpx;
		padding-bottom: 38rpx;
	}

	.login-title-box {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 40rpx 0 0;
	}

	.login-title {
		padding-bottom: 20rpx;
	}

	.login-btn-box {
		margin: 0 76rpx;
	}

	.btn {
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 50rpx;
		text-align: center;
		font-size: 26rpx;
		margin-top: 80rpx;
	}

	.login-btn {
		color: #fff;
		background-color: #66C5D7;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.login-btn image {
		width: 22rpx;
		height: auto;
		margin-right: 14rpx;
	}

	.cancle-btn {
		color: #999;
		background-color: #F4F4F4;
		margin-top: 40rpx;
	}

	.slogan-box {
		width: 268rpx;
		text-align: center;
		position: fixed;
		bottom: 40rpx;
		left: 50%;
		margin-left: -134rpx;
		font-size: 28rpx;
		color: #333;
	}

	.enslogan {
		color: #999;
		padding-top: 26rpx;
	}
</style>
