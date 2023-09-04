<template>
	<view class="daily-menu">
		<u-sticky>
			<block v-if="loginRefresh">
				<yp-nav title="明日菜单" :shareState="shareState" :loginState="loginState" :dailyMenu="true"></yp-nav>
			</block>
		</u-sticky>
		<view class="menu-img-box" @click="goMenu">
			<image :src="tomorrowMenu" mode="widthFix"></image>
		</view>
		<view v-if="memuPicture === null" class="menu-empty">
			<image src="../../static/store/default.png" mode="widthFix"></image>
			<view>
				明日未设置菜单
			</view>
		</view>
		<view class="menu-img" v-else>
			<!-- 标准版 -->
			<block v-if="storeInfo.storeAttribute == '1'">
				<yp-menu-waterfall :productList="goodsList" :menu="true" v-if="sonRefresh"
					@goToGoodsDetail="goToGoodsDetail"></yp-menu-waterfall>
			</block>
			<!-- 个性版 -->
			<block v-if="storeInfo.storeAttribute == '2'">
				<image :src="memuPicture" mode="widthFix" @click="saveImgShow"></image>
			</block>
		</view>

		<!-- 保存 -->
		<u-popup :show="saveShow" mode="bottom" round="10" @close="cancleSave">
			<view class="save-img-box">
				<view @click="saveImage">
					<view class="save-img">
						<image src="../../static/goods/saveIcon.png" mode="widthFix"></image>
					</view>
					<view class="save-btn">保存到相册</view>
				</view>
				<view class="cancle-save" @click="cancleSave">取消</view>
			</view>
		</u-popup>

		<!-- 商品详情 -->
		<u-popup :show="detailShow" @close="closeDetailShow" :round="10">
			<scroll-view class="detail-box" scroll-y="true" :style="'max-height:' + (screenHeight - 130 - statusBarHeight) + 'px'">
				<yp-detail ref="detail" :productsId="productsId" :tomorrowMenu="true" @closeDetailShow="closeDetailShow"></yp-detail>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import ypMenuWaterfall from '@/components/yp-menu-waterfull/yp-menu-waterfull.vue'
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	import ypDetail from '@/components/yp-goodDetail/yp-detail.vue'
	export default {
		data() {
			return {
				// list: ['今日菜单', '明日菜单'],
				timeIdx: 0,
				storeId: '',
				memuDate: '',
				productName: '',
				memuPicture: '', // 菜单合成图
				pageIndex: 1,
				pageSize: 20,
				completed: false,
				subscribeState: false, // 是否订阅过消息
				mainSwitch: false, // 设置页面是否打开了订阅消息
				saveShow: false,
				goodsList: [],
				storeInfo: {},
				goodsClassList: [{
					name: '面包',
					value: 1
				}, {
					name: '其他',
					value: 0
				}],
				productClass: '',
				detailShow: false,
				productsId: '', // 查看详情商品id
				sonRefresh: false,
				shareState: false,
				loginState: false,
				loginRefresh: false,
				tomorrowMenu: '',
				userInfo: {},
				statusBarHeight: 0,
				screenHeight: 0
			}
		},
		components: {
			ypNav,
			ypMenuWaterfall,
			ypDetail
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.getStoreInfo()
			this.loginState = options.loginState == 'true' ? true : false
			if (!this.loginState) {
				this.onLogin()
			} else {
				// 已登录
				this.sonRefresh = false
				this.loginRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
					this.loginRefresh = true
				})
				// this.attentionStore() // 关注店铺
			}
			// this.storeInfo = uni.getStorageSync('storeInfo')
			this.productClass = this.goodsClassList[0].value
			this.shareState = options.shareState == 'true' ? true : false
			// 获取当前日期时间
			// var myDate = new Date()
			// this.memuDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
			// 获取明日日期
			var day = new Date()
			day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
			var tomorrow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
			this.memuDate = tomorrow
			this.pageIndex = 1
			this.goodsList = []
			this.getStorePublicity()
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
					that.screenHeight = res.screenHeight
					console.log('screenHeight', that.screenHeight)
				}
			})
		},
		onShow() {
			let that = this
			// 获取设置，用户订阅消息的订阅状态
			uni.getSetting({
				withSubscriptions: true,
				success(res) {
					console.log('设置', res)
					that.mainSwitch = res.subscriptionsSetting.mainSwitch
					if (res.mainSwitch && res.subscriptionsSetting.MuIFzjoFDPW2ekEUKXGCF722PpOnHVLFmPqdglpflMc ==
						'reject') {
						// 设置页面订阅消息按钮打开了并且勾选了 “始终保持以上选择”
						that.subscribeState = true
					}
				}
			})
		},
		onReachBottom() {
			this.pageIndex++
			this.getMenuList()
		},
		methods: {
			// changeDate(index) {
			// 	this.timeIdx = index
			// 	if (index == 0) {
			// 		// 今日菜单
			// 		var myDate = new Date()
			// 		this.memuDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
			// 	} else if (index == 1) {
			// 		// 明日菜单
			// 		var day = new Date()
			// 		day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
			// 		var tomorrow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
			// 		this.memuDate = tomorrow
			// 	}
			// 	this.getMenuList()
			// },
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeId
				}).then(res => {
					console.log('店铺', res)
					const data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					that.getMenuList()
				})
			},
			/* 获取菜单主图 */
			getMenuList() {
				let that = this
				if (!that.completed) {
					that.request({
						url: that.config.menuGoodsList,
						data: {
							pageIndex: that.pageIndex,
							pageSize: that.pageSize,
							memuDate: that.memuDate, // 日期
							storeId: that.storeId,
							productName: that.productName,
							productClass: ''
						}
					}).then(res => {
						console.log(res)
						const data = res.data.data
						if (data.pageDate.data.length == 0) {
							that.completed = true
						} else {
							data.pageDate.data.forEach(item => {
								if (item.status) {
									that.goodsList.push(item)
								}
							})
							that.sonRefresh = false
							that.$nextTick(() => {
								that.sonRefresh = true
							})
						}
						that.memuPicture = data.memuPicture
						// that.goodsList = data.pageDate.data
					})
				}
			},
			/* 订阅消息 */
			subscribe() {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId + '&dailyMenu=true'
					})
				} else {
					let that = this
					if (that.subscribeState) {
						// 取消订阅
						uni.showModal({
							title: '请前往设置页面取消订阅',
							success() {
								uni.openSetting({
									success(res) {
										console.log('设置权限', res.authSetting)
									}
								})
							}
						})
					} else {
						if (that.mainSwitch) {
							// 打开了订阅消息按钮
							wx.requestSubscribeMessage({
								tmplIds: ['MuIFzjoFDPW2ekEUKXGCF722PpOnHVLFmPqdglpflMc'],
								success(res) {
									console.log('订阅成功', res)
									that.subscribeState = true
								},
								fail(err) {
									console.log('订阅失败', err)
								}
							})
						} else {
							uni.showModal({
								title: '请前往设置页面打开订阅消息开关',
								success() {
									uni.openSetting({
										success(res) {
											console.log('设置权限', res.authSetting)
										}
									})
								}
							})
						}
					}
				}
			},
			/* 判断是否有相册权限 */
			saveImage() {
				let that = this
				console.log('长按保存')
				uni.getSetting({
					success(res) {
						if (Object.keys(res.authSetting).length > 0) {
							if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
								// 未授权相册权限时，授权提示
								uni.authorize({
									scope: 'scope.writePhotosAlbum',
									success() {
										that.savePic()
									}
								})

							} else if (res.authSetting['scope.writePhotosAlbum']) {
								// 相册授权直接保存
								that.savePic()
							} else {
								// 已授权相册，但是关闭授权后，重新打开设置权限打开相册权限
								uni.openSetting({
									success(res) {
										console.log('设置权限', res.authSetting)
									}
								})
							}
						}
					}
				})
			},
			/* 保存到相册 */
			savePic() {
				var that = this
				uni.getImageInfo({
					src: that.memuPicture,
					success: function(image) {
						console.log(image);
						uni.saveImageToPhotosAlbum({
							filePath: image.path,
							success(res) {
								uni.showToast({
									title: '已保存到相册',
									icon: 'success',
									duration: 2000
								})
								setTimeout(() => {
									that.saveShow = false
								}, 2000)
							}
						})
					}
				})
			},
			saveImgShow() {
				this.saveShow = true
			},
			cancleSave() {
				this.saveShow = false
			},
			/* 切换商品分类 */
			changeGoodsClass(item) {
				console.log(item)
				this.productClass = item.value
				this.pageIndex = 1
				this.goodsList = []
				this.completed = false
				this.getMenuList()
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
			},
			/* 弹出商品详情 */
			goToGoodsDetail(id) {
				console.log('点击商品详情', id)
				this.productsId = id
				setTimeout(() => {
					this.$refs.detail.getProductsByID()
					this.detailShow = true
				}, 10)
			},
			closeDetailShow() {
				this.detailShow = false
			},
			/* 登录获取token */
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
							console.log('登录返回', data)
							if (res.statusCode == 200 && data.access_token) {
								that.loginState = true
								// 保存 token 到全局
								uni.setStorageSync('token', data.access_token)
								that.getLoginUser()
							} else {
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
						that.userInfo = data
						// that.registerStore()
					} else {
						that.loginState = false
					}
				})
			},
			/* 注册门店 */
			// registerStore() {
			// 	let that = this
			// 	that.request({
			// 		url: `${that.config.storecustomers}/${that.userInfo.openId}:visit/${that.storeId}`,
			// 		header: {
			// 			'Content-Type': 'application/json',
			// 			'Transaction-No': new Date().getTime()
			// 		},
			// 		method: 'POST',
			// 	}).then((res) => {
			// 		console.log(res)
			// 		if (res.data.code !== '200000') {
			// 			uni.showToast({
			// 				title: res.data.detail,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// },
			/* 获取明日菜单宣传图 */
			getStorePublicity() {
				let that = this
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`
				}).then(res => {
					console.log('获取明日菜单宣传图', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.tomorrowMenu = data.tomorrowMenu == null ? '' : data.tomorrowMenu
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 关注店铺 */
			// attentionStore() {
			// 	let that = this
			// 	that.request({
			// 		url: `${that.config.attentionStore}/${that.storeId}/collection`,
			// 		method: 'PUT',
			// 		header: {
			// 			'Content-Type': 'application/json',
			// 			'Transaction-No': new Date().getTime()
			// 		}
			// 	}).then(res => {
			// 		console.log('关注', res)
			// 		if (res.data.code == '200000') {
			// 			uni.showToast({
			// 				title: '关注成功',
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style scoped>
	.time-nav {
		display: flex;
		justify-content: space-between;
	}

	.menu-img {
		margin-top: 14rpx;
	}

	.menu-img image {
		width: 100%;
		height: auto;
	}

	.menu-empty {
		text-align: center;
		color: #333;
		font-size: 28rpx;
		padding-top: 260rpx;
	}

	.menu-empty image {
		width: 96rpx;
		height: auto;
		margin-bottom: 10rpx;
	}

	.subscribe-box {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		width: 186rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		margin: 20rpx 14rpx 6rpx;
	}

	.subscribeed {
		background-color: #999;
	}

	.subscribe-box image {
		width: 20rpx;
		height: 20rpx;
		margin-right: 6rpx;
	}

	.save-img-box {
		background-color: #ededed;
		color: #999;
		font-size: 28rpx;
		text-align: center;
	}

	.save-img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 40rpx auto 20rpx;
	}

	.save-img image {
		width: 48rpx;
		height: auto;
	}

	.cancle-save {
		background-color: #fff;
		text-align: center;
		color: #333;
		padding: 20rpx 0;
		margin-top: 60rpx;
	}

	.daily-menu>>>.u-icon__icon {
		z-index: 9999;
	}
	
	.menu-img-box{
		margin: 0 22rpx;
	}

	.menu-img-box image {
		width: 100%;
		height: auto;
		border-radius: 10rpx;
	}

	.daily-menu>>>.waterfalls-flow-column {
		width: 49% !important;
	}

	.daily-menu>>>.waterfalls-flow-column:nth-child(2) {
		margin-left: 2% !important;
	}

	.daily-menu>>>.u-popup__content {
		overflow: hidden;
	}
	
	.daily-menu>>>.column-value{
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
	}
</style>
