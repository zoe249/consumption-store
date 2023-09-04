<template>
	<view>
		<view class="add-custome-tip">仅新客注册后可领，无有效期限制</view>
		<view class="packet-input">
			<view class="packet-tip">单个金额</view>
			<view class="num-box">
				<input type="digit" placeholder="0.00" v-model="amount" :placeholder-style="style">
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
			<input type="text" placeholder="新客专属,欢迎惠顾" v-model="description" :placeholder-style="style">
		</view>
		<view class="total-price"><text class="dollars">￥</text>{{totalAmount}}</view>
		<button open-type="share" class="give-packet">塞钱进红包</button>
		<!-- <view class="give-packet" @click="addRedPacket"></view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 2,
				amount: '',
				totalAmount: '0.00',
				ticketNumber: '',
				description: '',
				storeId: '',
				style: 'color: #999;',
				packetId: '',
				shareShow: false,
				storeInfo: {}
			}
		},
		watch: {
			amount() {
				let amount
				let ticketNumber
				if (this.amount == '') {
					amount = 0
				} else {
					amount = this.amount
				}
				if (this.ticketNumber == '') {
					ticketNumber = 0
				} else {
					ticketNumber = this.ticketNumber
				}
				this.totalAmount = (parseFloat(amount) * parseInt(ticketNumber)).toFixed(2)
			},
			ticketNumber() {
				let amount
				let ticketNumber
				if (this.amount == '') {
					amount = 0
				} else {
					amount = this.amount
				}
				if (this.ticketNumber == '') {
					ticketNumber = 0
				} else {
					ticketNumber = this.ticketNumber
				}
				this.totalAmount = (parseFloat(amount) * parseInt(ticketNumber)).toFixed(2)
			},
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
		async onShareAppMessage(res) {
			let packetId = await this.addRedPacket()
			console.log('红包id', packetId)
			return {
				title: `新人速领！${this.storeInfo.name}邀请你抢${parseFloat(this.totalAmount)}元新人消费红包`,
				imageUrl: this.config.imgUrl + 'newShareImg.png',
				path: '/custom/home/index/index?packetId=' + packetId + '&storeId=' + this.storeId
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
		methods: {
			/* 创建红包 */
			async addRedPacket() {
				let that = this
				return new Promise((resolve, reject) => {
					if (that.description == '') {
						that.description = '新客专属,欢迎惠顾'
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
							ticketNumber: parseInt(that.ticketNumber),
							description: that.description,
							storeId: that.storeId
						}
					}).then(res => {
						console.log('创建红包', res)
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
		padding: 36rpx 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}
	
	.packet-tip{
		min-width: 120rpx;
	}

	.num-box {
		display: flex;
		align-items: center;
		text-align: right;
		line-height: 44rpx;
	}

	.num-box input {
		padding-right: 10rpx;
	}

	.packet-remark {
		margin: 24rpx;
		padding: 36rpx 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.total-price {
		font-size: 80rpx;
		text-align: center;
		color: #333;
		margin-top: 220rpx;
	}
	
	.dollars{
		font-size: 60rpx;
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

	.share-box {
		font-size: 28rpx;
	}

	.share-tip {
		text-align: center;
		background-color: #ededed;
		color: #999;
	}

	.share-img-box {
		background-color: #ededed;
		color: #999;
		display: flex;
		align-items: center;
		padding: 30rpx 0;
	}

	.share-img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20rpx;
	}

	.share-img image {
		width: 48rpx;
		height: auto;
	}

	.cancle-share {
		background-color: #fff;
		text-align: center;
		color: #333;
		padding: 20rpx 0;
	}
</style>
