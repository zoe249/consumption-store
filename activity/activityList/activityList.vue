<template>
	<view>
		<view class="wrap">
			<u-search placeholder="请输入活动名称" v-model="name" :showAction="false" @search="searchGoods" :clearable="true"
				bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333" searchIconColor="#ccc"
				shape="square" @clear="searchGoods"></u-search>
		</view>
		<view class="activity-box" v-for="(item, index) in activityList" :key="index" @click="goActivityDetail(item.id)"
			:class="item.state == '4' ? 'count-activity' : ''">
			<view class="activity-info">
				<view class="state-name">
					<view>{{item.storeName}}</view>
					<view class="status" :class="[item.state == 0 ? 'nostart' : '', item.state == 2 ? 'finish' : '']">
						{{item.stateName}}
					</view>
				</view>
				<view class="activity-time">{{item.beginDate}}-{{item.endDate}}</view>
				<view class="activity-time" v-if="item.state == 2">提前结束时间：{{item.endEarlyTime}}</view>
			</view>
			<view class="rule-count-down">
				<view class="relu-set" @click.stop="goRuleSet(item)">
					<view>兑换规则</view>
					<image :src="imgUrl + 'arrow.png'" mode=""></image>
				</view>
				<view class="count-down-time" v-if="item.state == '4'">
					<view>倒计时</view>
					<view><text class="count-down-day">{{item.endDay}}</text>天</view>
				</view>
			</view>
		</view>

		<view v-if="activityList.length == 0" class="empty-box">
			<image :src="imgUrl + 'empty.png'" mode="widthFix"></image>
			<view>暂无活动</view>
		</view>

		<view style="height: 160rpx;"></view>
		<view class="save-btn" @click="addActivity">新建活动</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				activityList: [],
				completed: false,
				pageIndex: 1,
				pageSize: 20,
				name: '',
				userInfo: {},
				storeId: ''
			}
		},
		onShow() {
			uni.hideShareMenu()
			this.pageIndex = 1
			console.log('门店id', this.storeId)
			// if (this.storeId === '') {
			// 	// 没有选择门店
			// 	this.onLogin()
			// } else {
			this.getActivityList() // 活动列表
			// this.getLoginUser()
			// }
		},
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex++
				that.request({
					url: that.config.activityList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						name: that.name
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						that.activityList.push(...data)
					}
				})
			}
		},
		methods: {
			/* 自动登录 */
			// onLogin() {
			// 	let that = this
			// 	uni.login({
			// 		success: res => {
			// 			uni.removeStorageSync('token')
			// 			that.request({
			// 				url: that.config.getLogin +
			// 					'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
			// 					res.code + '&user_type=02',
			// 				method: 'POST',
			// 				header: {
			// 					'Content-Type': 'application/json; charset=utf-8'
			// 				}
			// 			}).then(res => {
			// 				// 用户存在
			// 				let data = res.data
			// 				if (res.statusCode == 200 && data.access_token) {
			// 					// 保存 token 到全局
			// 					uni.setStorageSync('token', data.access_token)
			// 					// that.getUserStore()
			// 					that.getActivityList() // 活动列表
			// 					that.getLoginUser()
			// 				} else {
			// 					// 登录失败
			// 					uni.showToast({
			// 						title: res.data.detail,
			// 						icon: 'none'
			// 					})
			// 					uni.reLaunch({
			// 						url: '../../pages/startUp/login/login?storeId=' + that
			// 							.storeId + '&addStoreState=true'
			// 					})
			// 				}
			// 			})
			// 		}
			// 	})
			// },
			// /* 获取登录用户管理的所有门店列表 */
			// getUserStore() {
			// 	let that = this
			// 	that.request({
			// 		url: that.config.staffStore
			// 	}).then(res => {
			// 		console.log('用户下门店列表', res)
			// 		const data = res.data.data
			// 		if (data.length < 2) {
			// 			// 只有一个店铺或无店铺权限
			// 			if (data.length == 1) {
			// 				that.storeId = data[0].id
			// 			}
			// 			that.getActivityList() // 活动列表
			// 			that.getLoginUser()
			// 		} else {
			// 			// 跳转店铺选择页面
			// 			uni.navigateTo({
			// 				url: '/store/storeList/storeList?loginState=false'
			// 			})
			// 		}
			// 	})
			// },
			// // 获取登录用户信息
			// getLoginUser() {
			// 	let that = this
			// 	that.request({
			// 		url: that.config.loginUser,
			// 		data: {
			// 			storeId: that.storeId
			// 		}
			// 	}).then(res => {
			// 		if (res.data.code == 200000) {
			// 			let data = res.data.data
			// 			that.userInfo = data
			// 			uni.setStorageSync('userInfo', data)
			// 			// 未注册
			// 		} else {
			// 			uni.showToast({
			// 				title: data.detail,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// },
			getActivityList() {
				let that = this
				that.request({
					url: that.config.activityList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						name: that.name
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					data.forEach(item => {
						item.beginDate = item.beginDate.slice(0, 11)
						item.endDate = item.endDate.slice(0, 11)
					})
					that.activityList = data
				})
			},
			/* 搜索活动 */
			searchGoods() {
				this.completed = false
				this.getActivityList()
			},
			/* 规则设置 */
			goRuleSet(item) {
				uni.navigateTo({
					url: '../rule/rule?id=' + item.id + '&storeId=' + item.storeId + '&state=' + item.state
				})
			},
			/* 新建活动 */
			addActivity() {
				uni.navigateTo({
					url: '../addActivity/addActivity'
				})
			},
			/* 跳转活动详情 */
			goActivityDetail(id) {
				uni.navigateTo({
					url: '../manage/detail?id=' + id
				})
			}
		}
	}
</script>

<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.activity-box {
		background-color: #fff;
		margin: 14rpx 0;
		padding: 40rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	}

	.activity-box.count-activity {
		background-image: url(https://qiaokun.yuepong.com/hongbei%2FactivityCountDownBg.png);
		background-repeat: no-repeat;
		background-position: 100% 0;
		background-size: 192rpx;
	}

	.state-name {
		display: flex;
		align-items: center;
	}

	.status {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #7CD1F8;
		border: 1rpx solid #7CD1F8;
		background-color: #E5F6FE;
		font-size: 20rpx;
		margin-left: 20rpx;
	}

	.status.nostart {
		color: #FFC263;
		border: 1rpx solid #FFC263;
		background-color: #FFF3E0;
	}

	.status.finish {
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
		background-color: #FCEEEB;
	}

	.activity-time {
		color: #999;
		margin-top: 20rpx;
	}

	.rule-count-down {
		display: flex;
		align-items: center;
	}

	.relu-set {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

	.relu-set image {
		width: 16rpx;
		height: 16rpx;
		margin-left: 6rpx;
	}

	.count-down-time {
		color: #fff;
		font-size: 30rpx;
		padding-left: 90rpx;
		text-align: right;
	}

	.count-down-day {
		font-size: 40rpx;
	}

	.save-btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.empty-box {
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-top: 260rpx;
	}

	.empty-box image {
		width: 96rpx;
		height: auto;
		margin-bottom: 30rpx;
	}
</style>
