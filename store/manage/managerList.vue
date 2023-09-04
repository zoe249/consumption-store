<template>
	<view>
		<view class="staff-cont">
			<view v-for="(item, index) in managerList" :key="index" class="staff-box">
				<view class="staff-info">
					<view class="staff-img">
						<image :src="item.avatar ? item.avatar : defaultHead"></image>
					</view>
					<view class="staff-left">
						<view class="staff-name-box">
							<view>{{item.nickname}}</view>
							<view class="role-name">系统管理员</view>
						</view>
						<view class="staff-phone">{{item.phone}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="save-btn" @click="openAddManager">新增管理员</view>

		<u-popup :show="addShow" mode="bottom" :closeable="true" @close="closeAddStaff">
			<view>
				<view class="add-title">请输入管理员信息</view>
				<view class="add-staff-info">
					<view class="name-input">
						<view>姓名</view>
						<input placeholder="请输入姓名" v-model="name" />
					</view>
					<view class="name-input">
						<view>手机</view>
						<input placeholder="请输入手机号" v-model="phone" :maxlength="11" />
					</view>
				</view>
				<view class="add-staff-btn" @click="addAdministrators">确定添加</view>
			</view>
		</u-popup>

		<!-- 分享 -->
		<u-popup :show="shareShow" :round="10" mode="bottom" @close="shareShow = false">
			<button class="share-box" open-type="share">
				<image :src="imgUrl + 'wx.png'"></image>
				<view class="share-tip">分享给好友</view>
			</button>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				store: {}, // 店铺信息
				userInfo: {}, // 用户信息
				managerList: [],
				addShow: false,
				staffType: '', // 员工类型， 1老板，2员工
				editStaffInfo: false, // 修改信息
				shareShow: false,
				name: '',
				phone: '',
				roleId: '',
				id: '',
				pageIndex: 1,
				pageSize: 20,
				completed: false,
				storeInfo: {},
				storeId: ''
			}
		},
		onShow() {
			this.getManagerList()
		},
		onLoad() {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = this.storeInfo.id
		},
		// 触底加载下一页数据
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex += 1
				that.request({
					url: that.config.adminsList
				}).then(res => {
					let data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						that.managerList.push(...data)
					}
				})
			}
		},
		// // 下拉刷新
		// onPullDownRefresh() {
		// 	this.managerList = []
		// 	this.getManagerList()
		// 	setTimeout(function() {
		// 		uni.stopPullDownRefresh();
		// 	}, 1000);
		// },
		onShareAppMessage(res) {
			this.shareShow = false
			let role
			return {
				title: '邀请您成为系统管理员',
				imageUrl: this.config.imgUrl + 'fresh.png',
				path: '/pages/startUp/index/index?manger=true'
			}
		},
		methods: {
			/* 关闭添加系统管理员 */
			closeAddStaff() {
				this.addShow = false
			},
			getManagerList() {
				let that = this
				that.managerList = []
				that.request({
					url: that.config.adminsList
				}).then(res => {
					let data = res.data.data
					that.managerList = data
				})
			},
			/* 新增管理员 */
			addAdministrators() {
				let that = this
				if (that.phone === '') {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none',
						duration: 2000
					})
				} else if (!(/^1[3456789]\d{9}$/.test(that.phone))) {
					uni.showToast({
						title: '联系电话格式不正确',
						icon: 'none',
						duration: 2000
					})
				} else if (that.name === '') {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none',
						duration: 2000
					})
				} else {
					that.request({
						url: that.config.administrators,
						method: 'POST',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							storeId: that.storeId,
							name: that.name,
							phone: that.phone
						}
					}).then(res => {
						console.log('添加管理员', res);
						let data = res.data
						if (data.code == 200000) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							})
							that.addShow = false
							that.getManagerList()
							that.shareShow = true
						} else {
							uni.showToast({
								title: data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			openAddManager() {
				this.addShow = true
			}
		}
	}
</script>

<style scoped>
	.staff-cont {
		margin-bottom: 120rpx;
	}

	.staff-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.staff-info {
		display: flex;
		align-items: center;
	}

	.staff-img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}

	.staff-img image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
	}

	.staff-name-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	.role-name {
		color: #F2AB99;
		font-size: 20rpx;
		background-color: #FCEEEB;
		border: 2rpx solid #F2AB99;
		border-radius: 50rpx;
		padding: 0 10rpx;
		margin-left: 14rpx;
	}

	.staff-phone {
		color: #999;
		font-size: 24rpx;
		padding-top: 20rpx;
	}

	.add-title {
		background-color: #F4F4F4;
		color: #333;
		font-weight: 600;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.add-staff-info {
		margin: 0 22rpx;
		color: #999;
		font-size: 28rpx;
	}

	.name-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.name-input input {
		text-align: right;
	}

	.name-input:last-child {
		border-bottom: 0;
	}

	.add-staff-btn {
		margin: 60rpx 24rpx 20rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
	}

	.share-box {
		background-color: #fff;
		text-align: center;
		margin: 80rpx 0;
		line-height: unset;
	}

	.share-box::after {
		border: none;
	}

	.share-box image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.share-tip {
		font-size: 28rpx;
		color: #999;
		text-align: center;
		padding-top: 10rpx;
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
</style>
