<template>
	<view class="wrap">
		<!-- 客户详细 -->
		<view class="detail">
			<view class="left">
				<view class="avatar">
					<view class="u-demo-block__content">
						<u-avatar shape="square" size="50" :src="client.avatar?client.avatar:src"></u-avatar>
					</view>
				</view>
				<view class="text" @click="goClientInfo">
					<view class="name">{{client.nickname?client.nickname:''}}
						<image class="setArrow-img" src="../../static/store/setArrow.png"></image>
					</view>
					<view class="phone">
						<image class="phone-img" src="../../static/store/phone.png"></image>
						{{client.phone?client.phone:''}}
					</view>
				</view>
			</view>
			<image @click="emphasis" v-if="client.emphasis == '0'" class="stars" src="../../static/store/star.png">
			</image>
			<image @click="emphasis" v-else class="stars" src="../../static/store/stars.png"></image>
		</view>
		<view class="memo">
			<image class="memo-img" src="../../static/store/more.png"></image>
			<text class="memo-text">{{client.remarks?client.remarks:'暂无'}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				client: {}, // 客户信息
				storeId: ''
			}
		},
		onLoad: function(option) {
			uni.hideShareMenu()
			this.id = option.id
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.getClientDetails(this.id)
		},
		methods: {
			/* 店铺客户星标收藏/取消 */
			emphasis() {
				let that = this
				uni.showLoading({
					title: '加载中', 
					mask: true,
					icon: 'none'
				})
				that.request({
					url: `${that.config.emphasis}/${that.client.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
				}).then(res => {
					uni.hideLoading()
					let data = res.data
					if (data.code == 200000) {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						})
						that.getClientDetails(that.client.id)
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			goClientInfo() {
				uni.navigateTo({
					url: '/store/clientInfo/clientInfo?id=' + this.client.id
				})
			},
			getClientDetails(id) {
				let that = this
				that.request({
					url: `${that.config.storecustomers}/${id}`,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					that.client = res.data.data
				})
			}
		}
	}
</script>

<style>
	.wrap {
		background-color: #FFFFFF;
		padding: 20rpx 24rpx;
	}

	.detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 50rpx;
		border-bottom: 4rpx solid #ebebeb;
		border: 2rpx dashed #F2AB99;
		border-radius: 12rpx;
		padding: 20rpx;
	}

	.detail .left {
		display: flex;
	}

	.avatar,
	.text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.avatar {
		align-items: flex-end;
	}

	.text {
		margin-left: 40rpx;
	}

	.phone {
		font-size: 32rpx;
		color: #bfbfbf;
	}

	.memo {
		font-size: 28rpx;
		color: #9f9f9f;
		padding: 20rpx;
	}

	/* 红包 */
	.moeny {
		margin-top: 50rpx;
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #9f9f9f;
	}

	.balance {
		margin-top: 20rpx;
		color: #000000;
		font-size: 34rpx;
		font-weight: 600;
		width: 100%;
		justify-content: center;
		display: flex;
		align-items: center;
	}

	.balance .numb {
		margin-right: 20rpx;
	}

	.setArrow-img {
		width: 8rpx;
		height: 16rpx;
		padding-left: 12rpx;
	}

	.phone-img {
		width: 24rpx;
		height: 24rpx;
	}

	.memo {
		display: flex;
		justify-content: center;
	}

	.memo-img {
		width: 28rpx;
		height: 28rpx;
		margin: 5rpx 10rpx 10rpx 100rpx;
	}

	.memo-text {
		font-size: 28rpx;
		line-height: 42rpx;
		width: 80%;
	}

	.stars {
		width: 43rpx;
		height: 43rpx;
	}
</style>
