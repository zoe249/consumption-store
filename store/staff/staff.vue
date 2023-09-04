<template>
	<view>
		<view class="staff-cont">
			<view v-for="(item, index) in staffList" :key="index" class="staff-box"
				@click="openAddStaff(item.roleId, item)">
				<view class="staff-info">
					<view class="staff-img">
						<image :src="item.avatar ? item.avatar : defaultHead"></image>
					</view>
					<view class="staff-left">
						<view class="staff-name-box">
							<view>{{item.name}}</view>
							<view class="role-name" :class="item.roleId == '4' ? 'satff-role' : ''">{{item.roleName}}
							</view>
						</view>
						<view class="staff-phone">{{item.phone}}</view>
					</view>
				</view>
				<view class="staff-right">
					<image src="../../static/store/setArrow.png"></image>
				</view>
			</view>
		</view>

		<view class="add-box">
			<view @click="openAddStaff('3')">添加老板</view>
			<view class="add-staff" @click="openAddStaff('4')">添加员工</view>
		</view>

		<u-popup :show="addShow" mode="bottom" :closeable="true" @close="closeAddStaff">
			<view>
				<block v-if="editStaffInfo">
					<view class="add-title">员工信息</view>
				</block>
				<block v-else>
					<view class="add-title" v-if="staffType == 3">请输入老板信息</view>
					<view class="add-title" v-if="staffType == 4">请输入员工信息</view>
				</block>
				<view class="add-staff-info">
					<block v-if="!editStaffInfo">
						<view class="name-input" v-if="staffType == 3">老板：具有全部功能</view>
						<view class="name-input" v-if="staffType == 4">员工：没有员工管理和设置功能，其他功能正常。</view>
					</block>
					<view class="name-input">
						<view>姓名</view>
						<input placeholder="请输入姓名" v-model="name" />
					</view>
					<view class="name-input">
						<view>手机</view>
						<input placeholder="请输入手机号" v-model="phone" :maxlength ="11" :disabled="editStaffInfo" />
					</view>
					<view class="name-input" v-if="editStaffInfo">
						<view>角色</view>
						<view v-if="roleId == 1">系统管理员</view>
						<view v-if="roleId == 3">老板</view>
						<view v-if="roleId == 4">员工</view>
					</view>
				</view>
				<view class="save-btn" v-if="editStaffInfo">
					<view class="replace-btn" @click="save">保存</view>
					<view @click="del">删除</view>
				</view>
				<view class="add-staff-btn" v-if="!editStaffInfo" @click="submit">确定添加</view>
			</view>
		</u-popup>
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
				staffList: [],
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
			this.getStaffs()
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
					url: that.config.staffs + '/' + that.storeId,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
					},
				}).then(res => {
					let data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						data.forEach(function(item) {
							if (item.roleId === '1' || item.roleId === '3') {
								// 老板
								that.staffList.push(item)
							}
						})
						data.forEach(function(item) {
							if (item.roleId === '4') {
								// 员工
								that.staffList.push(item)
							}
						})
					}
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.staffList = []
			this.getStaffs()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShareAppMessage(res) {
			console.log('分享的门店id', this.storeId)
			this.shareShow = false
			let role
			let manger
			if (this.roleId == 3) {
				role = '老板'
				manger = true
			} else if (this.roleId == 4) {
				role = '员工'
				manger = false
			}
			console.log('manger', manger)
			return {
				title: `"${this.userInfo.nickname}"邀请您成为"${this.storeInfo.name}"的"${role}"`,
				imageUrl: this.storeInfo.sign,
				path: '/pages/startUp/index/index?storeId=' + this.storeId + '&manger=' + manger
			}
		},
		methods: {
			/* 打开添加员工/老板 */
			openAddStaff(type, item) {
				if (item !== undefined) {
					// 修改
					this.name = item.name
					this.phone = item.phone
					this.id = item.id
					this.roleId = item.roleId
					this.editStaffInfo = true
				} else {
					// 新增
					this.name = ''
					this.phone = ''
					this.id = ''
					this.editStaffInfo = false
					this.staffType = type
					this.roleId = type
				}
				this.addShow = true
			},
			/* 关闭添加员工/老板 */
			closeAddStaff() {
				this.addShow = false
			},
			getStaffs() {
				let that = this
				that.pageIndex = 1
				that.staffList = []
				that.request({
					url: that.config.staffs + '/' + that.storeId,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
					},
				}).then(res => {
					let data = res.data.data
					data.forEach(function(item) {
						if (item.roleId === '1' || item.roleId === '3') {
							// 系统管理员 || 老板
							that.staffList.push(item)
						}
					})
					data.forEach(function(item) {
						if (item.roleId === '4') {
							// 员工
							that.staffList.push(item)
						}
					})
				})
			},
			// 新增
			submit() {
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
						url: that.config.staffs,
						method: 'POST',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							storeId: that.storeId,
							unionId: that.userInfo.uid,
							roleId: that.roleId,
							name: that.name,
							phone: that.phone
						}
					}).then(res => {
						console.log('添加店铺成员返回', res);
						let data = res.data
						if (data.code == 200000) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							})
							that.addShow = false
							that.getStaffs()
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
			// 修改
			save() {
				let that = this
				if (that.name === '') {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none',
						duration: 2000
					})
				} else {
					that.request({
						url: that.config.staffs + '/' + that.id,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							name: that.name,
						}
					}).then(res => {
						let data = res.data
						if (data.code == 200000) {
							uni.showToast({
								title: '修改成功',
								icon: 'success'
							})
							that.addShow = false
							that.getStaffs()
						} else {
							uni.showToast({
								title: data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			//删除
			del() {
				let that = this
				uni.showModal({
					content: '确定要删除吗？',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: that.config.staffs + '/' + that.id,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json; charset=utf-8',
									'Transaction-No': new Date().getTime()
								},
								data: {
									unionId: that.userInfo.id,
								}
							}).then(res => {
								let data = res.data
								if (data.code == 200000) {
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									})
									that.addShow = false
									that.getStaffs()
								} else {
									uni.showToast({
										title: data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
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
		/* height: 30rpx;
		line-height: 30rpx; */
	}

	.role-name.satff-role {
		color: #7CD1F8;
		background-color: #E5F6FE;
		border: 1rpx solid #7CD1F8;
	}

	.staff-phone {
		color: #999;
		font-size: 24rpx;
		padding-top: 20rpx;
	}

	.staff-right image {
		width: 8rpx;
		height: 16rpx;
	}

	.add-box {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 20rpx;
		left: 24rpx;
		right: 24rpx;
	}

	.add-box view {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 50rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		font-size: 28rpx;
	}

	.add-box view.add-staff {
		background-color: #7CD1F8;
		margin-left: 14rpx;
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

	.save-btn view {
		margin: 20rpx 24rpx;
		border-radius: 50rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #fff;
		color: #F2AB99;
		font-size: 28rpx;
		border: 1rpx solid #F2AB99;
	}

	.save-btn view.replace-btn {
		background-color: #F2AB99;
		color: #fff;
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
</style>
