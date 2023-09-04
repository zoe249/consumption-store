<template>
	<view>
		<view class="verificaiton-box">
			<view class="verificaiton">
				<view>客户名称</view>
				<view>{{nickName}}</view>
			</view>
			<view class="verificaiton">
				<view>兑换商品</view>
				<view>{{name}} *{{count}}</view>
			</view>
			<view class="card-cont">
				<view class="card-tip">卡片</view>
				<view class="card-list">
					<view v-for="(item, index) in cardList" :key="index" class="card-box">
						<image :src="item.cardPicture"></image>
						<view class="card-count">{{item.count}}</view>
						<view class="">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="verificaiton-btn" @tap="$u.throttle(saveVerificaiton, 500)">兑换核销</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardList: [], // 卡片集合
				nickName: '', // 用户昵称
				name: '', // 商品名称
				count: 0, // 商品数量
				userInfo: {}
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			console.log('用户信息', JSON.parse(options.userInfo))
			this.userInfo = JSON.parse(options.userInfo)
			this.getVerificationInfo()
		},
		methods: {
			/* 兑换核销奖励查询 */
			getVerificationInfo() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				that.request({
					url: that.config.verificationInfo,
					data: {
						openId: that.userInfo.openId,
						ruleId: that.userInfo.ruleId
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						const data = res.data.data
						that.nickName = data.nickname
						that.name = data.name
						that.count = data.count
						that.cardList = data.cardList
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 兑换核销 */
			saveVerificaiton() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				that.request({
					url: that.config.verificationInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						openId: that.userInfo.openId,
						ruleId: that.userInfo.ruleId
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '核销成功',
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

	.card-cont {
		display: flex;
		color: #333;
		font-size: 28rpx;
		padding: 40rpx 0 0;
	}

	.card-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.card-tip {
		min-width: 109rpx;
		margin-right: 30rpx;
	}

	.card-box {
		position: relative;
		margin-right: 14rpx;
		margin-bottom: 38rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.card-box:nth-child(3n) {
		margin-right: 0;
	}

	.card-count {
		position: absolute;
		right: -6rpx;
		top: -12rpx;
		background-color: #F2AB99;
		color: #fff;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		font-size: 24rpx;
		text-align: center;
	}

	.card-box image {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		margin-bottom: 8rpx;
	}

	.verificaiton-btn {
		margin: 40rpx 24rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
