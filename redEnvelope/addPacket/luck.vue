<template>
	<view>
		<view class="add-custome-tip">拼手气红包</view>
		<view class="packet-input">
			<view class="pin-icon-box">
				<image :src="imgUrl + 'pin.png'" mode="" class="pin-icon"></image>
				<view class="packet-tip">总金额</view>
			</view>
			<view class="num-box">
				<input type="digit" placeholder="0.00" v-model="totalAmount" :placeholder-style="style" @blur="computedPrice">
				<text>元</text>
			</view>
		</view>
		<view class="packet-input">
			<view class="packet-tip">红包个数</view>
			<view class="num-box">
				<input type="digit" placeholder="填写个数" v-model="ticketNumber" :placeholder-style="style">
				<text>个</text>
			</view>
		</view>
		<view class="packet-remark">
			<input type="text" placeholder="承蒙厚爱，红包送来" v-model="description" :placeholder-style="style">
		</view>
		<view class="packet-input">
			<view class="packet-time">领取后有效期</view>
			<view class="num-box">
				<input type="digit" placeholder="7" v-model="validityPeriod">
				<text>天</text>
			</view>
		</view>
		<view class="total-price">￥
			<block v-if="totalAmount === ''">0.00</block>
			<block v-else>{{totalAmount}}</block>
		</view>
		<!-- <view class="give-packet" @click="addRedPacket">发红包</view> -->
		<button open-type="share" class="give-packet">塞钱进红包</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				type: 1,
				amount: '',
				totalAmount: '',
				ticketNumber: '',
				description: '',
				validityPeriod: '',
				storeId: '',
				style: 'color: #999;',
				packetId: '',
				shareShow: false,
				storeInfo: {}
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.shareShow = false
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onHide() {
			console.log('分享')
			this.shareShow = true
		},
		onShow() {
			console.log('取消分享')
			if (this.shareShow) {
				uni.redirectTo({
					url: '../detail/detail?id=' + this.packetId
				})
			}
		},
		async onShareAppMessage(res) {
			let packetId = await this.addRedPacket()
			console.log('红包id', packetId)
			return {
				title: `拼手速！${this.storeInfo.name}邀请你抢${parseFloat(this.totalAmount)}元消费红包`,
				imageUrl: this.config.imgUrl + 'pinShareImg.png',
				path: '/custom/home/index/index?packetId=' + packetId + '&storeId=' + this.storeId
			}
		},
		watch: {
			description() {
				if (this.description.length > 16) {
					uni.showToast({
						title: '红包备注不可超过16个字',
						icon: 'none'
					})
					setTimeout(() => {
						this.description = this.description.substring(0, 16)
					}, 10)
				}
			}
		},
		methods: {
			/* 创建红包 */
			async addRedPacket() {
				let that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				return new Promise((resolve, reject) => {
					if (that.description == '') {
						that.description = '承蒙厚爱，红包送来'
					}
					if (that.validityPeriod == '') {
						that.validityPeriod = '7'
					}
					that.request({
						url: that.config.redPacketInfo,
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'Transaction-No': new Date().getTime()
						},
						data: {
							type: that.type,
							totalAmount: that.totalAmount,
							ticketNumber: that.ticketNumber,
							description: that.description,
							validityPeriod: that.validityPeriod,
							storeId: that.storeId
						}
					}).then(res => {
						console.log('创建红包', res)
						uni.hideLoading()
						if (res.data.code == '200000') {
							that.packetId = res.data.data
							resolve(that.packetId)
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				})
				return that.packetId
			},
			computedPrice() {
				this.totalAmount = parseFloat(this.totalAmount).toFixed(2)
			}
		}
	}
</script>

<style scoped>
	.add-custome-tip {
		color: #999;
		font-size: 28rpx;
		margin: 24rpx;
	}

	.packet-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 24rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}
	
	.packet-tip{
		min-width: 120rpx;
	}
	
	.packet-time{
		min-width: 180rpx;
	}

	.pin-icon-box {
		display: flex;
		align-items: center;
	}

	.pin-icon {
		width: 40rpx;
		height: 40rpx;
		display: block;
		margin-right: 14rpx;
	}

	.num-box {
		display: flex;
		align-items: center;
		text-align: right;
		line-height: 44rpx;
	}
	
	.num-box input {
		padding-right: 10rpx;
		line-height: 44rpx;
		height: 44rpx;
	}

	.packet-remark {
		margin: 24rpx;
		padding: 30rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.total-price {
		font-size: 60rpx;
		text-align: center;
		color: #333;
		margin-top: 90rpx;
	}

	.give-packet {
		background-color: #FF5B4B;
		border-radius: 10rpx;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		margin: 24rpx;
	}
</style>
