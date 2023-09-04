<template>
	<view>
		<u-loading-page :loading="loading" bg-color="#fff"></u-loading-page>
		
		<block v-if="!loading">
			<view class="store-box" :style="{ 'padding-top': statusBarHeight + 9 + 'px'}">
				<view class="store-nav">店铺主页</view>
				<view class="manage-btn">
					<!-- <view @click="goToStoreHomePage" class="change-custome">顾客端</view> -->
					<view class="change-custome" @click="goManage" v-if="userInfo.roleId == '1'">管理端</view>
				</view>
				<view class="store-info-box">
					<view class="store-info">
						<view class="store-img">
							<image :src="storeInfo.logo == null ? defaultHead : storeInfo.logo"></image>
							<view v-if="storeInfo.storeType == 1" class="store-type">S</view>
							<view v-if="storeInfo.storeType == 2" class="store-type qijian-type">V</view>
							<view v-if="storeInfo.storeType == 3" class="store-type yuding-type">R</view>
							<view v-if="storeInfo.storeType == 4" class="store-type jiaoyi-type">D</view>
						</view>
						<view class="store-name-box" @click="goToStoreHomePage">
							<view>{{storeInfo.name}}</view>
							<image class="store-arrow" src="../../static/store/rightArrow.png"></image>
						</view>
					</view>
					<view class="store-manage" @click="changeStore">切换店铺</view>
				</view>
			</view>
			<!-- 老板或初始老板 倒计时提醒 -->
			<!-- 交易型 || 旗舰版店铺 -->
			<block v-if="storeInfo.storeType == 2 || storeInfo.storeType == 4">
				<view class="count-down-tip"
					v-if="(activityInfo.tipsStatus == '1' || activityInfo.tipsStatus == '2') && (userInfo.roleId == '2' || userInfo.roleId == '3') && activityInfo.endDay > 14"
					@click="goActivityDetail">
					<view class="down-tip">温馨提示</view>
					<view>距离集卡活动还有 {{activityInfo.endDay}} 天，请及时处理</view>
				</view>
				<view class="store-business-data">
					<view class="data-title-box" @click="goBusinessData">
						<view class="business-data-time">
							<view>今日数据</view>
							<view class="data-time">{{currentTime}}</view>
						</view>
						<view>
							<u-icon name="arrow-right" color="#999" size="18"></u-icon>
						</view>
					</view>
					<view class="data-box">
						<view class="order-data">
							<view>实收金额 (元)</view>
							<view class="order-data-num">{{(parseFloat(storeData.orderPayCount)).toFixed(2)}}</view>
						</view>
						<view class="order-data">
							<view>支付订单数</view>
							<view class="order-data-num">{{storeData.orderCount}}</view>
						</view>
						<view class="order-data">
							<view>访客数</view>
							<view class="order-data-num">{{storeData.storeCustomerCount}}</view>
						</view>
					</view>
				</view>
			</block>
			<view class="manage-cont buginess-cont">
				<view class="manage-tip">轻松经营</view>
				<view class="buginess-box">
					<view class="business-image" v-for="(item, index) in businessList" :key="index">
						<image :src="item.img" mode="widthFix" class="business" @click="goBusiness(item)"></image>
						<block v-if="index == 2">
							<u-badge bgColor="#F2AB99" :value="activityNum" :absolute="true" :offset="[-7, -9]"></u-badge>
						</block>
					</view>
				</view>
			</view>
			<view class="manage-cont">
				<view class="manage-tip">日常管理</view>
				<view class="manage-box">
					<view v-for="(item, index) in manageList" :key="index" class="manage" @click="goBusiness(item)">
						<view>
							<image :src="item.img"></image>
						</view>
						<view>{{item.name}}</view>
						<block v-if="index == 0">
							<u-badge bgColor="#F2AB99" :value="orderNum" :absolute="true" :offset="[-7, -4]"></u-badge>
						</block>
						<block v-if="index == 1">
							<u-badge bgColor="#F2AB99" :value="deliveryNum" :absolute="true" :offset="[-7, -4]"></u-badge>
						</block>
					</view>
				</view>
			</view>
			<view class="iconfont store-slogan">
				<view>轻松经营，多点回头客~</view>
				<view class="version">v0.9.0</view>
			</view>
		</block>

		<u-popup :show="countDownShow" @close="closeCountDown" mode="center" :closeOnClickOverlay="false">
			<view>
				<view class="count-down-code">
					<view class="finish-activity">
						<view>集卡游戏即将结束</view>
						<view class="finish-activity-tip">集卡游戏即将结束，请到集卡页面管理活动</view>
					</view>
					<view class="count-down-time">
						<view>倒计时</view>
						<view><text class="count-down-day">{{activityInfo.endDay}}</text>天</view>
					</view>
				</view>
				<view class="finish-btn" @click="goActivityDetail">现在就去</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				statusBarHeight: 0,
				storeInfo: {}, // 店铺信息
				userInfo: {}, // 用户信息
				businessList: [{
					img: '../../static/store/dailyMenu.png',
					name: '每日菜单',
					url: '../dailyMenu/dailyMenu'
				}, {
					img: '../../static/store/freshBake.png',
					name: '新鲜出炉',
					url: '../bakeFresh/bakeFresh'
				}, {
					img: '../../static/store/activityManage.png',
					name: '集卡游戏',
					url: '../../activity/manage/list?storeId='
				}, {
					img: this.config.imgUrl + 'redPacket.png',
					name: '消费红包',
					url: '../../redEnvelope/consume/redPacket?storeId='
				}],
				manageList: [{
					img: '../../static/store/order.png',
					name: '订单',
					url: '../order/list'
				}, {
					img: this.config.imgUrl + 'deliveryMenu.png',
					name: '送货',
					url: '/delivery/manage/list'
				}, {
					img: this.config.imgUrl + 'goods.png',
					name: '商品',
					url: '../goods/goods'
				}, {
					img: '../../static/store/scanIcon.png',
					name: '扫一扫',
					url: ''
				}, {
					img: this.config.imgUrl + 'client.png',
					name: '客户',
					url: '../client/client'
				}, {
					img: this.config.imgUrl + 'chef.png',
					name: '员工',
					url: '../staff/staff'
				}, {
					img: this.config.imgUrl + 'jizhang.png',
					name: '记账',
					url: '../charge/account'
				}, {
					img: this.config.imgUrl + 'cookbook.png',
					name: '食谱',
					url: '../cookbook/list'
				}, {
					img: this.config.imgUrl + 'peifang.png',
					name: '配方',
					url: '../recipe/list'
				}, {
					img: this.config.imgUrl + 'element.png',
					name: '原料',
					url: '../element/list'
				}, {
					img: this.config.imgUrl + 'stock.png',
					name: '存货',
					url: '../stock/list'
				}, {
					img: this.config.imgUrl + 'supplier.png',
					name: '供货商',
					url: '../supplier/list'
				}, {
					img: '../../static/store/set.png',
					name: '设置',
					url: '../setup/setup'
				}],
				storeId: '',
				countDownShow: false,
				orderNum: 0,
				pageIndex: 1,
				pageSize: 10,
				activityInfo: {},
				activityNum: 0,
				deliveryNum: 0,
				dateTime: '', // 今日日期
				storeData: {},
				currentTime: '', // 当前时间
				loading: true
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
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = options.storeId == undefined ? this.storeInfo.id : options.storeId
			this.getStoreInfo()
			if (this.userInfo.roleId == 4) {
				// 员工,1是超级管理员,3是老板,4是员工
				this.manageList = [{
					img: this.config.imgUrl + 'staff.png',
					name: '客户',
					url: '../client/client'
				}, {
					img: this.config.imgUrl + 'goods.png',
					name: '商品',
					url: '../goods/goods'
				}]
			}
		},
		onShow() {
			this.countDownShow = false
			this.getStoreInfo()
			this.getActivityList()
			this.getActivityInfo()
			var date = new Date()
			let year = date.getFullYear()
			let month = date.getMonth() + 1
			let day = date.getDate()
			let hour = date.getHours()
			let minute = date.getMinutes()
			if (month < 10) {
				month = '0' + month
			}
			if (day < 10) {
				day = '0' + day
			}
			if (hour < 10) {
				hour = '0' + hour
			}
			if (minute < 10) {
				minute = '0' + minute
			}
			this.dateTime = year + '-' + month + '-' + day
			this.getStoreOrderData()
			this.currentTime = `${month}-${day} ${hour}:${minute}`
		},
		methods: {
			/* 跳转店铺端主页 */
			goToStoreHomePage() {
				uni.reLaunch({
					url: '/custom/home/index/index?storeId=' + this.storeId
				})
			},
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					console.log('门店信息', res)
					if (res.data.code == '200000') {
						let data = res.data.data
						that.storeInfo = data
						uni.setStorageSync('storeInfo', data)
						if (data.storeType == 1) {
							// 展示型店铺
							that.businessList = [{
								img: '../../static/store/dailyMenu.png',
								name: '每日菜单',
								url: '../dailyMenu/dailyMenu'
							}, {
								img: '../../static/store/freshBake.png',
								name: '新鲜出炉',
								url: '../bakeFresh/bakeFresh'
							}]
							that.manageList = [{
								img: that.config.imgUrl + 'goods.png',
								name: '商品',
								url: '../goods/goods'
							}, {
								img: that.config.imgUrl + 'client.png',
								name: '客户',
								url: '../client/client'
							}, {
								img: that.config.imgUrl + 'chef.png',
								name: '员工',
								url: '../staff/staff'
							}, {
								img: '../../static/store/set.png',
								name: '设置',
								url: '../setup/setup'
							}]
						} else if (data.storeType == 3) {
							// 预定版
							that.businessList = [{
								img: '../../static/store/dailyMenu.png',
								name: '每日菜单',
								url: '../dailyMenu/dailyMenu'
							}, {
								img: '../../static/store/freshBake.png',
								name: '新鲜出炉',
								url: '../bakeFresh/bakeFresh'
							}, {
								img: this.config.imgUrl + 'redPacket.png',
								name: '消费红包',
								url: '../../redEnvelope/consume/redPacket?storeId='
							}]
							that.manageList = [{
								img: '../../static/store/order.png',
								name: '订单',
								url: '../order/list'
							}, {
								img: this.config.imgUrl + 'deliveryMenu.png',
								name: '送货',
								url: '/delivery/manage/list'
							}, {
								img: this.config.imgUrl + 'goods.png',
								name: '明日预定',
								url: '/store/reserve/reserve'
							}, {
								img: '../../static/store/scanIcon.png',
								name: '扫一扫',
								url: ''
							}, {
								img: this.config.imgUrl + 'goods.png',
								name: '商品',
								url: '../goods/goods'
							}, {
								img: this.config.imgUrl + 'client.png',
								name: '客户',
								url: '../client/client'
							}, {
								img: this.config.imgUrl + 'chef.png',
								name: '员工',
								url: '../staff/staff'
							}, {
								img: '../../static/store/set.png',
								name: '设置',
								url: '../setup/setup'
							}]
						} else if (data.storeType == 4) {
							// 交易版
							that.manageList = [{
								img: '../../static/store/order.png',
								name: '订单',
								url: '../order/list'
							}, {
								img: this.config.imgUrl + 'deliveryMenu.png',
								name: '送货',
								url: '/delivery/manage/list'
							}, {
								img: this.config.imgUrl + 'goods.png',
								name: '商品',
								url: '../goods/goods'
							}, {
								img: '../../static/store/scanIcon.png',
								name: '扫一扫',
								url: ''
							}, {
								img: this.config.imgUrl + 'client.png',
								name: '客户',
								url: '../client/client'
							}, {
								img: this.config.imgUrl + 'chef.png',
								name: '员工',
								url: '../staff/staff'
							}, {
								img: '../../static/store/set.png',
								name: '设置',
								url: '../setup/setup'
							}]
						}
						if (data.storeType != 3) {
							// 非预定版显示待处理订单角标
							that.getOrderNum()
						}
						that.getDeliveryOrderList()
						that.loading = false
					} else {
						uni.showModal({
							content: res.data.detail,
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定')
									uni.reLaunch({
										url: '/custom/trend/trend'
									})
								}
							}
						})
					}
				})
			},
			// 跳转店铺详情
			// goToStoreDetail() {
			// 	uni.navigateTo({
			// 		url: '../../custom/storehome/index/index?storeId=' + this.storeId
			// 	})
			// },
			goBusiness(item) {
				let that = this
				if (item.url == '') {
					// 允许从相机和相册扫码
					uni.scanCode({
						success: function(res) {
							console.log('条码类型：' + res.scanType);
							console.log(res);
							let result = JSON.parse(res.result)
							if (result.ruleId) {
								uni.navigateTo({
									url: '../../activity/verification/verification?userInfo=' + res
										.result
								})
							} else if (result.orderId) {
								// 预定订单详情
								uni.navigateTo({
									url: '/store/order/confirm?id=' + result.orderId
								})
							} else {
								// 扫描会员二维码
								uni.navigateTo({
									url: '../../activity/qualificationCheck/qualificationCheck?openId=' +
										result.openId + '&activityId=' + that.storeInfo
										.cardActivityRuleId + '&storeId=' + that.storeId
								})
							}
						}
					});
				} else {
					if (item.name == '集卡游戏') {
						uni.navigateTo({
							url: item.url + this.storeId
						})
					} else {
						uni.navigateTo({
							url: item.url
						})
					}
				}
			},
			/* 切换店铺 */
			changeStore() {
				uni.navigateTo({
					url: '../storeList/storeList'
				})
			},
			/* 跳转管理端 */
			goManage() {
				uni.navigateTo({
					url: '../manage/manage'
				})
			},
			closeCountDown() {
				this.countDownShow = false
			},
			/* 获取订单数 */
			getOrderNum() {
				let that = this
				that.request({
					url: that.config.orderList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId,
						orderStatus: 'pending'
					}
				}).then(res => {
					console.log('订单列表', res)
					if (res.statusCode == '200') {
						that.orderNum = res.data.data.total
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取倒计时活动数量 */
			getActivityList() {
				let that = this
				that.request({
					url: that.config.activityList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						state: 4,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					that.activityNum = res.data.total
				})
			},
			/* 获取进行中活动详情 */
			getActivityInfo() {
				let that = this
				that.request({
					url: `${that.config.activityList}/${that.storeId}/detailOfOngoingActivity`
				}).then(res => {
					console.log('倒计时活动', res)
					const data = res.data.data
					that.activityInfo = data
					let activityId = uni.getStorageSync('activityId')
					if (data.tipsStatus == '2' && data.id !== activityId && (that.userInfo.roleId == '2' || that
							.userInfo.roleId == '3')) {
						// 弹窗提醒  没有操作过延期结束或按计划结束  只向老板或初始老板提醒
						that.countDownShow = true
					}
				})
			},
			/* 跳转活动详情 */
			goActivityDetail() {
				uni.navigateTo({
					url: '/activity/manage/detail?id=' + this.activityInfo.id
				})
			},
			/* 获取配送单列表 */
			getDeliveryOrderList() {
				let that = this
				that.request({
					url: that.config.deliveries,
					data: {
						storeId: that.storeId,
						phone: '',
						state: 1
					}
				}).then(res => {
					console.log('配送单列表', res)
					const data = res.data.data
					if (data.length !== 0) {
						that.deliveryNum = data[0].deliveryOrderList.length
					}
				})
			},
			/* 店铺今日数据 */
			getStoreOrderData() {
				let that = this
				that.request({
					url: `${that.config.dataCount}?beginTime=${that.dateTime}&endTime=${that.dateTime}&storeId=${that.storeId}`
				}).then(res => {
					console.log('店铺今日数据', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.storeData = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 经营数据 */
			goBusinessData() {
				uni.navigateTo({
					url: '../business/data'
				})
			}
		}
	}
</script>

<!-- <style>
	page {
		background-color: #fff;
	}
</style> -->

<style scoped>
	.store-box {
		background-color: #F2AB99;
		color: #fff;
		padding: 0 0 40rpx;
	}

	.store-nav {
		text-align: center;
		padding: 0 0 38rpx;
		font-size: 32rpx;
	}

	.manage-btn {
		display: flex;
		align-items: center;
		margin: 0 24rpx 40rpx;
	}

	.change-custome {
		background-color: #fff;
		color: #F2AB99;
		font-size: 28rpx;
		border-radius: 50rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 160rpx;
		text-align: center;
		margin-right: 40rpx;
	}

	.store-info-box {
		margin: 0 24rpx;
		padding: 14rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 2rpx dashed #fff;
		border-radius: 10rpx;
	}

	.store-info {
		display: flex;
		align-items: center;
	}

	.store-img {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		position: relative;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-name-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.store-arrow {
		width: 8rpx;
		height: 16rpx;
		padding-left: 12rpx;
	}

	.store-manage {
		background-color: #fff;
		color: #F2AB99;
		font-size: 28rpx;
		border-radius: 50rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 160rpx;
		text-align: center;
	}

	.buginess-cont {
		border-bottom: 14rpx solid #F4F4F4;
	}

	.buginess-box {
		font-size: 24rpx;
		color: #666;
		position: relative;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.business-image {
		position: relative;
		width: 214rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 14rpx 0 0;
	}

	.business-image:nth-child(3n) {
		padding-right: 0;
	}

	/* .business-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	} */

	.manage-tip {
		font-weight: 600;
		font-size: 28rpx;
		padding-bottom: 10rpx;
	}

	.manage-cont {
		background-color: #fff;
		padding: 30rpx 14rpx 40rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
	}

	.manage-box {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		text-align: center;
		font-size: 24rpx;
		color: #333;
	}

	.manage {
		width: 214rpx;
		height: 160rpx;
		margin-top: 20rpx;
		background-color: #F4F4F4;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		margin-right: 14rpx;
		position: relative;
		z-index: 999;
	}

	.manage:nth-child(3n) {
		margin-right: 0;
	}

	.manage image {
		width: 48rpx;
		height: 48rpx;
		padding-bottom: 18rpx;
	}

	.manage-box>>>.u-badge {
		z-index: 9999;
	}

	.store-slogan {
		/* width: 400rpx; */
		color: #F2AB99;
		font-size: 28rpx;
		/* position: fixed;
		bottom: 20rpx;
		left: 50%;
		margin-left: -200rpx; */
		text-align: center;
		padding: 20rpx 0;
	}

	.store-slogan .version {
		font-size: 24rpx;
	}

	.count-down-tip {
		background-color: #fff;
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		padding: 20rpx 24rpx;
		border-bottom: 14rpx solid #F4F4F4;
	}

	.down-tip {
		width: 140rpx;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		color: #fff;
		font-weight: 600;
		font-size: 28rpx;
		background: linear-gradient(to right, #FF9C82, #FF5C37);
		border-radius: 50rpx;
		margin-right: 20rpx;
	}

	.count-down-code {
		display: flex;
		justify-content: space-between;
		background-image: url(https://qiaokun.yuepong.com/hongbei%2FcountDownBg.png);
		background-repeat: no-repeat;
		background-position: 119% -27rpx;
		background-size: 236rpx;
	}

	.finish-activity {
		font-size: 32rpx;
		color: #333;
		width: 60%;
		padding: 40rpx 0 20rpx 40rpx;
	}

	.finish-activity-tip {
		color: #999;
		font-size: 24rpx;
		line-height: 40rpx;
		padding-top: 24rpx;
	}

	.count-down-time {
		color: #fff;
		font-size: 28rpx;
		padding: 50rpx 20rpx 0 0;
	}

	.count-down-day {
		font-size: 40rpx;
	}

	.finish-btn {
		margin: 20rpx 20rpx 40rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.store-business-data {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.data-title-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 24rpx;
	}

	.business-data-time {
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
	}

	.data-time {
		color: #999;
		font-weight: normal;
		padding-left: 10rpx;
	}

	.data-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 14rpx 30rpx;
	}

	.order-data {
		text-align: left;
		font-size: 24rpx;
		color: #999;
		width: 33%;
	}

	.order-data-num {
		font-weight: 600;
		color: #333;
		font-size: 32rpx;
		padding-top: 12rpx;
	}

	.store-type {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		line-height: 30rpx;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		background-color: #62B279;
		margin-left: 10rpx;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.store-type.qijian-type {
		background-color: #FFC263;
	}

	.store-type.yuding-type {
		background-color: #7CD1F8;
	}

	.store-type.jiaoyi-type {
		background-color: #B463FF;
	}
</style>