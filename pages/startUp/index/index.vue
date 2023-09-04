<template>
	<view>
		<!-- 加载 -->
		<yp-loading ref="loading"></yp-loading>
		<!-- 无网络提示 -->
		<u-no-network></u-no-network>
		<view class="logo">
			<image :src="imgUrl + 'fresh.png'" mode="widthFix"></image>
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
				storeList: [], // 门店列表信息
				userInfo: {}, // 用户信息
				storeId: '', //门店id
				isManager: false, // 是否是管理员
				storeInfo: {},
				_storeId: '',
				manger: false,
				addStoreState: false,
				storeHome: false,
				dailyMenu: false,
				goodsReverse: false,
			}
		},
		onLoad(option) {
			uni.hideShareMenu()
			console.log('通过小程序码跳转', option)
			this._storeId = option.scene == undefined ? '' : option.scene
			this.storeId = option.scene == undefined ? '' : option.scene
			console.log('登录门店id', option.storeId)
			this._storeId = option.storeId
			if (option.storeId) {
				this.storeId = option.storeId == 'undefined' ? '' : option.storeId
				this.storeId = option.storeId == 'null' ? '' : option.storeId
			}
			uni.setStorageSync('storeId', this.storeId)
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.manger = option.manger == 'true' ? true : false
			this.addStoreState = option.addStoreState == 'true' ? true : false
			this.storeHome = option.storeHome == 'true' ? true : false
			this.dailyMenu = option.dailyMenu == 'true' ? true : false
			this.goodsReverse = option.goodsReverse == 'true' ? true : false
		},
		onShow() {
			uni.hideHomeButton()
			//自动登录
			this.onLogin()
		},
		methods: {
			/* 登录获取token */
			onLogin() {
				let that = this
				that.$refs.loading.open()
				uni.login({
					success: res => {
						uni.removeStorageSync('token')
						console.log('code', res.code)
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02&store_id=' + that.storeId + '&avatar=&nick_name=',
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							}
						}).then(res => {
							// 用户存在
							let data = res.data
							console.log('首次登录返回', data);
							that.$refs.loading.close()
							if (res.statusCode == 200) {
								// 登录成功
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
									that.getIsManager() // 判断是否为系统管理员
								}
							} else {
								if (that.manger) {
									// 管理员跳转登录页面
									console.log('管理跳转登录')
									console.log('storeId', that.storeId)
									uni.reLaunch({
										url: '../login/login?storeId=' + that.storeId
									})
								} else {
									// that.storeId = '1550312409233756160' // 开发环境虚拟店铺门店id
									// // that.storeId = '1539055200571101184' // 测试环境虚拟店铺门店id
									// // that.storeId = '1546688329209221120' // 正式环境虚拟店铺门店id
									// // that.getStoreInfo()
									
									// console.log('1111111111111111')
									// // 进入顾客端店圈tab
									// uni.reLaunch({
									// 	url: '/custom/home/index/index?navIdx=1&storeId=' + that.storeId
									// })
									
									// 无门店id，进入悦小圈
									uni.reLaunch({
										url: '/custom/trend/trend'
									})
								}
							}
						})
					}
				})
			},
			/* 获取当前登录的用户是否为管理员 */
			getIsManager() {
				let that = this
				that.request({
					url: that.config.loginUserRole
				}).then(res => {
					console.log('是否为系统管理员', res)
					that.isManager = res.data.data
					if (that.isManager) {
						// 管理员
						console.log('是管理员', that.storeId)
						if (that.storeId === '') {
							console.log('管理员无门店id')
							// 跳转管理端
							uni.reLaunch({
								url: '/store/manage/manage'
							})
						} else {
							console.log('管理员有门店id')
							that.getLoginUser() // 获取登录用户信息
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
							})
						}
					} else {
						console.log('非管理员')
						// 非管理员，判断是商家还是顾客
						that.getUserStore() // 获取登录用户管理的所有门店列表
					}
				})
			},
			/* 获取登录用户管理的所有门店列表 */
			getUserStore() {
				let that = this
				that.request({
					url: that.config.manageStaffStore
				}).then(res => {
					console.log('用户下门店列表', res)
					const data = res.data.data
					if (data.length == 0) {
						console.log('顾客角色')
						// 无店铺，顾客角色
						if (that.storeInfo === '' || that.storeInfo == null) {
							console.log('顾客角色  无门店id')
							// 无门店id，进入店圈页面
							uni.reLaunch({
								url: '/custom/trend/trend'
							})
						} else {
							console.log('顾客角色  有门店id')
							// 有门店id，取存储过的门店信息
							that.storeId = that.storeInfo.id
							// 跳转顾客端主页
							console.log('33333333333333333')
							uni.reLaunch({
								url: '/custom/home/index/index?storeId=' + that.storeId
							})
							that.getLoginUser() // 获取登录用户信息
						}
					} else if (data.length == 1) {
						// 只有一个店铺，判断客户角色
						console.log('只有一个店铺判断角色')
						that.storeId = data[0].id
						that.getLoginUser()
					} else {
						console.log('商家角色')
						// 多个店铺，商家角色，跳转店铺选择页面
						uni.setStorageSync('storeInfo', '') // 清空存储门店信息
						this.storeId = this._storeId == undefined ? '' : this._storeId // 从分享进入门店id取页面传入的id，其他清空门店id为空
						if (that.storeId === '') {
							console.log('商家角色  无门店id')
							uni.reLaunch({
								url: '/store/storeList/storeList'
							})
						} else {
							console.log('商家角色  有门店id')
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + this.storeId
							})
						}
					}
				})
			},
			/* 获取登录用户信息 */
			getLoginUser() {
				let that = this
				console.log('门店id', that.storeId)
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log('首次获取登录用户信息', res);
					if (res.data.code == 200000) {
						let data = res.data.data
						// 缓存用户信息
						uni.setStorageSync('userInfo', data)
						console.log(data, '用户信息')
						if (data.roleId == 0) {
							// 无店铺权限，顾客角色
							uni.reLaunch({
								url: '/custom/home/index/index?storeId=' + that.storeId
							})
						} else {
							// 商家角色
							uni.reLaunch({
								url: '/store/storeHomepage/storeHomepage?storeId=' + that.storeId
							})
						}
					} else {
						// 未登录
						// uni.reLaunch({
						// 	url: '../login/login?storeId=' + that.storeId
						// })
						// that.storeId = '1550312409233756160' // 开发环境虚拟店铺门店id
						// that.storeId = '1539055200571101184' // 测试环境虚拟店铺门店id
						// that.storeId = '1546688329209221120' // 正式环境虚拟店铺门店id
						that.getStoreInfo()
					}
				})
			},
			/* 获取门店信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					let data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					// 跳转顾客端主页
					console.log('44444444444444')
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
		background-color: #FFFFFF;
	}
</style>

<style scoped>
	.logo {
		text-align: center;
		margin: 258rpx 0 40rpx;
		padding: 0 24rpx;
	}

	.logo image {
		width: 110rpx;
		height: auto;
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
		padding-top: 12rpx;
	}
</style>
