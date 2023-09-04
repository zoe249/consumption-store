<template>
	<view>
		<view class="store-box" :style="{ 'padding-top': statusBarHeight + 9 + 'px'}">
			<view class="store-nav">授权登录页</view>
		</view>
		<view class="login-box">
			<view class="logo">
				<image :src="imgUrl + 'fresh.png'" mode="widthFix"></image>
			</view>
			<view class="login-tip">初次见面，我们认识一下吧</view>
		</view>
		<view class="login-title-box">
			<view class="login-title">悦小店想要获取以下权限：</view>
			<view>获取你的公开信息（昵称、头像等）</view>
		</view>
		<view class="login-btn-box">
			<view class="login-btn btn" @click="onGotUserInfo">
				<image :src="imgUrl + 'weChat.png'" mode="widthFix"></image>
				<view>授权登录</view>
			</view>
			<view class="cancle-btn btn" @click="cancelLogin">暂不授权</view>
		</view>
		<view class="select-agreement">
			<view class="select-goods" @click="selectAgreement">
				<block v-if="agreementState">
					<view class="isSelect-goods"></view>
				</block>
			</view>
			<view class="agreement">
				允许悦小店在必要场景下，合理使用您的个人信息，并充分保障您的合法权利<text @click="goAgreement('userAgreement')"
					class="agreement-desc">《用户协议》</text><text @click="goAgreement('privacyPolicy')"
					class="agreement-desc">《隐私政策》</text>
			</view>
		</view>
		<view class="slogan-box">
			<view>想让你的生活有面包~</view>
			<view class="enslogan">Bread in your life ~</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				statusBarHeight: 0,
				storeId: '', //门店id
				userInfo: {},
				addStoreState: false, // 是否从创建店铺进的
				pageIndex: 1,
				pageSize: 10,
				storeHome: false,
				dailyMenu: false,
				goodsReverse: false,
				backState: false,
				agreementState: false,
				code: ''
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
			this.storeId = option.storeId == undefined ? '' : option.storeId
			uni.setStorageSync('storeId', this.storeId)
			this.addStoreState = option.addStoreState
			this.storeHome = option.storeHome == 'true' ? true : false
			this.dailyMenu = option.dailyMenu == 'true' ? true : false
			this.goodsReverse = option.goodsReverse == 'true' ? true : false
			this.backState = option.backState == 'true' ? true : false
		},
		methods: {
			/* 获取微信用户信息 */
			onGotUserInfo(e) {
				if (this.agreementState) {
					let that = this
					uni.getUserProfile({
						desc: '用于完善会员资料',
						success: (res) => {
							console.log('获取用户信息', res)
							that.userInfo = res.userInfo
							uni.setStorageSync('userLoginInfo', res)
							that.onLogin()
						},
						fail() {
							uni.navigateTo({
								url: '/custom/trend/trend?storeId=' + this.storeId
							})
						}
					})
				} else {
					uni.showToast({
						title: '请勾选隐私政策',
						icon: 'none'
					})
				}
			},
			/* 取消登录 */
			cancelLogin() {
				if (this.backState) {
					uni.navigateBack()
				} else {
					uni.navigateTo({
						url: '/custom/trend/trend?storeId=' + this.storeId
					})
				}
			},
			// 自动登录
			onLogin() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				uni.login({
					success: res => {
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02&store_id=' + that.storeId + '&avatar=' +
								that.userInfo.avatarUrl + '&nick_name=' + that.userInfo.nickName,
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							}
						}).then(res => {
							uni.hideLoading()
							console.log(res, '注册返回数据');
							// 用户存在
							let data = res.data
							// that.$refs.loading.close()
							if (res.statusCode == 200 && data.access_token) {
								// 保存 token 到全局
								uni.setStorageSync('token', data.access_token)
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
								// 登录失败
								uni.showToast({
									title: res.data.detail,
									icon: 'none'
								})
								uni.reLaunch({
									url: '../register/register?storeId=' + that.storeId +
										'&addStoreState=' + that.addStoreState +
										'&storeHome=' + that.storeHome + '&dailyMenu=' + that
										.dailyMenu + '&goodsReverse=' + that.goodsReverse
								})
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
						// 只有一个店铺或无店铺权限
						if (data.length == 1) {
							that.storeId = data[0].id
						}
						that.getLoginUser()
					} else {
						// 跳转店铺选择页面
						uni.reLaunch({
							url: '/store/storeList/storeList'
						})
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
						if (data.roleId == 0)
							uni.reLaunch({
								url: '/custom/home/index/index?storeId=' + that.storeId
							})
						else {
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
							})
						}
						// 未注册
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 勾选协议 */
			selectAgreement() {
				this.agreementState = !this.agreementState
			},
			/* 隐私政策 */
			goAgreement(type) {
				uni.navigateTo({
					url: '/custom/set/agreement?type=' + type
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
		width: 32rpx;
		height: auto;
		margin-right: 14rpx;
	}

	.cancle-btn {
		color: #999;
		background-color: #F4F4F4;
		margin-top: 40rpx;
	}

	.slogan-box {
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

	.select-agreement {
		display: flex;
		justify-content: center;
		margin: 14rpx 24rpx;
		color: #999;
		font-size: 24rpx;
		line-height: 48rpx;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #000;
		border-radius: 50%;
		width: 20rpx;
		height: 20rpx;
		margin: 12rpx 10rpx 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-goods image {
		width: 18rpx;
		height: 12rpx;
	}

	.isSelect-goods {
		background-color: #F2AB99;
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
	}

	.agreement {
		width: 90%;
	}

	.agreement-desc {
		color: #F2AB99;
		text-decoration: underline;
	}
</style>
