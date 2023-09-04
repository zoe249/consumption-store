<template>
	<view>
		<view class="verificaiton-box">
			<view class="verificaiton">
				<view class="verificaiton-left">客户名称</view>
				<view class="user-info">
					<view>{{nickName}}</view>
					<image :src="avatar" mode="" class="avatar-img"></image>
				</view>
			</view>
			<view class="verificaiton">
				<view class="verificaiton-left">订单编号</view>
				<view class="input-box">
					<input type="text" placeholder="请输入订单编号" v-model="orderNumber" :placeholder-style="style">
					<image :src="imgUrl + 'scan.png'" @click="chooseImage"></image>
				</view>
			</view>
			<view class="verificaiton" @click="selectTime">
				<view class="verificaiton-left">交易时间</view>
				<picker mode="date" :value="orderCreate" @change="confirmCreateTime" @cancel="closeCreateTime">
					<input type="text" placeholder="请选择交易时间" :disabled="true" :placeholder-style="style"
						v-model="orderCreateTime">
				</picker>
			</view>
			<view class="verificaiton">
				<view class="verificaiton-left">交易金额</view>
				<view class="input-box">
					<input type="digit" :placeholder-style="style" v-model="orderPrice" @blur="qualificationQuery">
					<view>元</view>
				</view>
			</view>
			<view class="verificaiton">
				<view class="verificaiton-left">抽卡门槛</view>
				<view>{{thresholdValue}}元</view>
			</view>
			<view class="verificaiton">
				<view class="verificaiton-left">发卡数量</view>
				<view>{{cardNum}}张</view>
			</view>
		</view>

		<view class="verificaiton-btn">
			<view @tap="$u.throttle(qualificationIssue, 500)">卡片发放</view>
			<view class="reset-btn" @click="resetOrderInfo">重置订单信息</view>
		</view>
		
	</view>
</template>

<script>
	import date from '@/common/js/date.js' // 引入时间戳转换日期格式组件
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				style: 'color: #ccc;',
				openId: '',
				avatar: '',
				nickName: '',
				orderCreateTime: '', // 交易时间
				orderNumber: '', // 订单编号
				orderPrice: '', // 交易总金额
				storeId: '',
				createTimeShow: false,
				thresholdValue: '', // 抽卡门槛
				availableCount: '', // 抽卡次数
				userInfo: {},
				activityId: '',
				orderInfo: {},
				resetState: false,
				cardNum: 0
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			console.log(options)
			this.openId = options.openId
			this.activityId = options.activityId
			this.storeId = options.storeId
			this.getActivityInfo()
			this.getCustomerInfo()
		},
		onShow() {
			console.log('返回的订单信息', this.orderInfo)
			if (this.orderInfo.createTime != undefined) {
				this.orderCreateTime = this.orderInfo.createTime
				this.orderNumber = this.orderInfo.orderNum
				this.orderPrice = this.orderInfo.price
				this.qualificationQuery()
			}
		},
		methods: {
			/* 获取活动详情 */
			getActivityInfo() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				that.request({
					url: `${that.config.activityList}/${that.activityId}`
				}).then(res => {
					uni.hideLoading()
					console.log(res)
					that.thresholdValue = res.data.data.thresholdValue
				})
			},
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
			// 					that.getUserStore()
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
			// 			if (data.length == 1) {
			// 				that.storeId = data[0].id
			// 			}
			// 			that.getActivityInfo()
			// 			that.getCustomerInfo()
			// 			that.getLoginUser()
			// 		} else {
			// 			// 跳转店铺选择页面
			// 			uni.reLaunch({
			// 				url: '/store/storeList/storeList'
			// 			})
			// 		}
			// 	})
			// },
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
						that.userInfo = data
						uni.setStorageSync('userInfo', data)
						// 未注册
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取用户信息 */
			getCustomerInfo() {
				let that = this
				that.request({
					url: that.config.customers + that.openId
				}).then(res => {
					console.log('获取用户信息', res)
					const data = res.data.data
					that.nickName = data.nickname
					that.avatar = data.avatar
				})
			},
			/* 资格发放 */
			qualificationIssue() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				that.request({
					url: that.config.sendCardCustomer,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						orderNumber: that.orderNumber,
						orderCreateTime: that.orderCreateTime,
						amount: that.orderPrice,
						storeId: that.storeId,
						openId: that.openId
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '发放成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 选择交易时间 */
			selectTime() {
				this.createTimeShow = true
			},
			confirmCreateTime(e) {
				console.log(e)
				this.orderCreateTime = e.detail.value
			},
			closeCreateTime() {
				this.createTimeShow = false
			},
			/* 抽卡资格查询 */
			qualificationQuery() {
				let that = this
				if (that.orderNumber === '') {
					uni.showToast({
						title: '请输入订单编号',
						icon: 'none'
					})
				} else if (that.orderPrice === '') {
					uni.showToast({
						title: '请输入交易金额',
						icon: 'none'
					})
				} else {
					uni.showLoading({
						title: '加载中'
					})
					that.request({
						url: that.config.estimateCardCount,
						data: {
							storeId: that.storeId,
							amount: that.orderPrice
						}
					}).then(res => {
						console.log('查询抽卡资格', res)
						uni.hideLoading()
						if (res.data.code == '200000') {
							const data = res.data.data
							// that.thresholdValue = data.thresholdValue
							// that.availableCount = data.availableCount
							that.cardNum = data.cardCount
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			/* 选择图片 */
			chooseImage() {
				let that = this
				uni.chooseImage({
					success: (chooseImageRes) => {
						uni.showLoading({
							title: '识别中'
						})
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: `${that.config.protocol}${that.config.host}store-service/api/v1.0/OCRs`,
							header: {
								'Content-Type': 'multipart/form-data',
								'Authorization': 'Bearer ' + uni.getStorageSync('token'),
								'Transaction-No': new Date().getTime()
							},
							method: 'POST',
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								file: tempFilePaths[0],
								storeId: that.storeId
							},
							success: (uploadFileRes) => {
								uni.hideLoading()
								console.log(JSON.parse(uploadFileRes.data))
								const data = JSON.parse(uploadFileRes.data)
								if (data.code == '200000') {
									if (data.data.orderNum == null || that.resetState) {
										// 无订单模板 或者 重置订单模板
										let text = data.data.text
										console.log('小票信息', text);
										uni.navigateTo({
											url: './order?orderInfo=' + text
										})
									} else {
										// 订单编号
										let orderNumber = data.data.orderNum
										let orderNumberIdx = orderNumber.indexOf(':')
										that.orderNumber = orderNumber.substr(orderNumberIdx + 1, orderNumber.length)
										console.log('订单编号', parseFloat(that.orderNumber))
										if (parseFloat(that.orderNumber) > 0) {
											
										} else {
											uni.showToast({
												title: '订单扫描错误，请重新拍照扫描',
												icon: 'none'
											})
											that.orderPrice = ''
											that.orderCreateTime = ''
											that.orderNumber = ''
										}
										// 下单时间
										let createTime = data.data.createTime
										let createTimeIdx = createTime.indexOf(':')
										let orderCreateTime = createTime.substr(createTimeIdx + 1, createTime.length)
										that.orderCreateTime = orderCreateTime.slice(0, 10)
										// 金额
										let price = data.data.price
										let priceIdx = price.indexOf(':')
										that.orderPrice = price.substr(priceIdx + 1, price.length)
										console.log('价格', parseFloat(that.orderPrice))
										if (parseFloat(that.orderPrice) > 0) {
											
										} else {
											uni.showToast({
												title: '订单扫描错误，请重新拍照扫描',
												icon: 'none'
											})
											that.orderPrice = ''
											that.orderCreateTime = ''
											that.orderNumber = ''
										}
										if (that.orderNumber !== '' && that.orderPrice != '') {
											that.qualificationQuery()
										}
									}
								} else {
									uni.showToast({
										title: data.detail,
										icon: 'none'
									})
								}
							},
							fail(err) {
								console.log('上传失败', err)
							}
						})
					}
				})
			},
			/* 重置订单信息 */
			resetOrderInfo() {
				this.orderPrice = ''
				this.orderCreateTime = ''
				this.orderNumber = ''
				this.resetState = true
				this.chooseImage()
			}
		}
	}
</script>

<style scoped>
	.verificaiton-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.verificaiton {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
		font-size: 28rpx;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.verificaiton input {
		text-align: right;
	}

	.verificaiton image {
		width: 44rpx;
		height: 44rpx;
	}

	.input-box {
		display: flex;
		align-items: center;
		text-align: right;
	}

	.order-create-time {
		color: #ccc;
	}

	.verificaiton-left {
		min-width: 110rpx;
	}
	
	.user-info{
		display: flex;
		align-items: center;
	}
	
	.verificaiton image.avatar-img{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-left: 20rpx;
	}

	.verificaiton-btn {
		margin: 40rpx 24rpx;
		text-align: center;
		font-size: 28rpx;
	}
	
	.verificaiton-btn view{
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		color: #fff;
	}
	
	.verificaiton-btn view.reset-btn{
		color: #F2AB99;
		background-color: transparent;
		margin-top: 20rpx;
	}
</style>
