<template>
	<view>
		<view class="packet-info-cont">
			<view class="packet-info-box">
				<view class="name-state">
					<view class="packet-name">{{redInfo.totalAmount}}元
						<block v-if="redInfo.type == 1">拼手气</block>
						<block v-if="redInfo.type == 2">新客</block>消费红包
					</view>
					<view class="packet-state on-going" v-if="redInfo.state != 3">{{redInfo.stateName}}</view>
				</view>
				<block v-if="redInfo.state == 3">
					<view class="packet-state">{{redInfo.stateName}}</view>
					<view class="finish-time">结束时间：{{redInfo.endTime}}</view>
				</block>
				<view v-if="redInfo.state != 3">
					<button open-type="share" class="packet-share">
						<u-icon name="weixin-fill" color="#fff" size="28"></u-icon>
						<view>分享</view>
					</button>
				</view>
			</view>
		</view>
		<view class="draw-num">
			已领取<text class="price">{{redInfo.receivedNumber}}/{{redInfo.ticketNumber}}</text>，共<text
				class="price">{{redInfo.receivedAmount}}/{{redInfo.totalAmount}}</text>元
		</view>
		<view v-for="(item, index) in redInfo.consumptionVoucherSubs" :key="index" class="packet-box">
			<view class="packet-info">
				<view class="user-img">
					<image :src="item.avatar ? item.avatar : defaultHead"></image>
				</view>
				<view class="packet-left">
					<view class="user-info-box">
						<view>{{item.nickname}}</view>
						<view class="new-custome" v-if="item.newCustomer">新客</view>
					</view>
					<view class="create-time">{{item.createTime}}</view>
				</view>
			</view>
			<view class="packet-right">￥{{item.amount}}</view>
		</view>
		<view style="height: 100rpx;"></view>
		<view class="stop-btn" v-if="redInfo.state != 3" @click="stopIssuePacket">停止发放</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeInfo: {},
				redInfo: {},
				imgUrl: this.config.imgUrl,
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				packetId: '' // 红包id
			}
		},
		onShareAppMessage(res) {
			let title
			let img
			let desc
			console.log(this.redInfo)
			if (this.redInfo.type == '1') {
				// 拼手气红包
				title = '拼手速'
				img = this.config.imgUrl + 'pinShareImg.png'
				desc = ''
			} else if (this.redInfo.type == '2') {
				// 新客红包
				title = '新人速领'
				img = this.config.imgUrl + 'newShareImg.png'
				desc = '新客'
			}
			return {
				title: `${title}！${this.storeInfo.name}邀请你抢${this.redInfo.totalAmount}元${desc}消费红包`,
				imageUrl: img,
				path: '/custom/home/index/index?packetId=' + this.redInfo.id + '&storeId=' + this.storeId
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.packetId = options.id
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.getRedPacketInfo()
		},
		methods: {
			/* 获取红包详情 */
			getRedPacketInfo() {
				let that = this
				that.request({
					url: `${that.config.redPacketInfo}/${that.packetId}`
				}).then(res => {
					console.log('红包详情', res)
					const data = res.data.data
					data.endTime = data.endTime.replace(/(\d{4})-(\d{2})-(\d{2})/g,
						'$1年$2月$3日')
					data.endTime = data.endTime.slice(5, 17)
					that.redInfo = res.data.data
				})
			},
			/* 停止发放红包 */
			stopIssuePacket() {
				let that = this
				uni.showModal({
					content: '请确认提前停止发放红包',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							that.request({
								url: `${that.config.redPacketInfo}/${that.redInfo.id}/end`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
							}).then(res => {
								console.log('停止发放', res)
								uni.hideLoading()
								that.getRedPacketInfo()
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
	.packet-info-cont {
		background-color: #fff;
		padding: 26rpx 24rpx 50rpx;
	}

	.packet-info-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #FF5B4B;
		color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 0;
	}

	.name-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 40rpx;
	}

	.packet-name {
		font-size: 40rpx;
	}

	.on-going {
		margin-left: 12rpx;
	}

	.packet-state {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
		font-size: 20rpx;
		border-radius: 50rpx;
		background-color: rgba(255, 255, 255, .2);
		border: 2rpx solid #fff;
	}

	.finish-time {
		font-size: 28rpx;
		padding-top: 20rpx;
	}

	.packet-share {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 74rpx;
		line-height: 74rpx;
		color: #fff;
		border: 2rpx solid #fff;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
		background-color: transparent;
		padding: 0;
	}

	.draw-num {
		margin: 20rpx 24rpx;
		color: #999;
		font-size: 28rpx;
	}

	.packet-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 20rpx 24rpx;
		padding: 30rpx 20rpx;
		border-radius: 10rpx;
	}

	.packet-info {
		display: flex;
		align-items: center;
	}

	.user-img {
		margin-right: 20rpx;
	}

	.user-img image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		display: block;
	}

	.user-info-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	.new-custome {
		width: 80rpx;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		font-size: 28rpx;
		border-radius: 50rpx;
		background-color: #FF5B4B;
		color: #fff;
		margin-left: 20rpx;
	}

	.create-time {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999;
	}

	.packet-right {
		color: #F3B4A5;
		font-size: 40rpx;
	}

	.stop-btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
		color: #333;
		border: 2rpx solid #333;
		font-size: 28rpx;
		text-align: center;
		height: 74rpx;
		line-height: 74rpx;
	}
</style>
