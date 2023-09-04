<template>
	<view>
		<view class="logout-img">
			<view>
				<image :src="imgUrl + 'logout.png'" mode="widthFix"></image>
			</view>
			<view>申请注销悦小店账号</view>
		</view>
		<view class="logout-cont">
			<view>
				<view class="logout-tip">您提交的注销申请生效前，请确认以下情况，以保证您的帐号、财产安全：</view>
				<view class="confirm-info">
					<view class="tip-num">①</view>
					<view>
						<view class="order-tip">订单处于已完成状态</view>
						<view class="logout-tip">您的帐号当前无进行中订单或待退款订单。</view>
					</view>
				</view>
				<view class="confirm-info">
					<view class="tip-num">②</view>
					<view>
						<view class="order-tip">帐号财产清算</view>
						<view class="logout-tip">您的帐号中所有的消费红包、活动卡券等财产将被清零、注销后将无法恢复。</view>
					</view>
				</view>
				<view class="confirm-info">
					<view class="tip-num">③</view>
					<view>
						<view class="order-tip">帐号数据处理</view>
						<view class="logout-tip">您的帐号中所有订单、个人信息等数据将从系统中删除、注销后将无法恢复。</view>
					</view>
				</view>
			</view>
			<view class="select-agreement">
				<view class="select-goods" @click="selectAgreement">
					<block v-if="confimState">
						<view class="isSelect-goods"></view>
					</block>
				</view>
				<view>我已确认以上信息</view>
			</view>
			<view class="save-btn" @click="cancelAccount">注销账号</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				confimState: false
			}
		},
		methods: {
			/* 勾选协议 */
			selectAgreement() {
				this.confimState = !this.confimState
			},
			/* 注销账号 */
			cancelAccount() {
				uni.navigateBack()
				// let that = this
				// that.request({
				// 	url: ''
				// }).then(res => {
				// 	if (res.data.code == '200000') {
				// 		uni.showToast({
				// 			title: '注销成功',
				// 			icon: 'none'
				// 		})
				// 		setTimeout(() => {
				// 			uni.reLaunch({
				// 				url: '/custom/trend/trend'
				// 			})
				// 		}, 2000)
				// 	} else {
				// 		uni.showToast({
				// 			title: res.data.detail,
				// 			icon: 'none'
				// 		})
				// 	}
				// })
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
	.logout-img {
		padding: 52rpx 0 80rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		text-align: center;
		background-color: #F4F4F4;
	}

	.logout-img image {
		width: 134rpx;
		height: auto;
		display: block;
		margin: 0 auto 34rpx;
	}

	.logout-cont {
		background-color: #fff;
		padding: 36rpx 24rpx;
	}

	.logout-tip {
		font-size: 24rpx;
		color: #999;
	}

	.tip-num {
		margin-right: 14rpx;
	}

	.order-tip {
		color: #333;
		font-size: 28rpx;
	}

	.confirm-info {
		display: flex;
		padding-top: 30rpx;
	}

	.select-agreement {
		display: flex;
		margin: 14rpx 24rpx;
		color: #F2AB99;
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

	.save-btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		border: 2rpx solid #F2AB99;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
