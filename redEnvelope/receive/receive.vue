<template>
	<view>
		<view class="store-info-box">
			<view class="store-info">
				<view class="store-logo">
					<image :src="packetInfo.storeLogo" mode=""></image>
				</view>
				<view>{{packetInfo.storeName}}发出的消费红包</view>
				<view class="store-remark">{{packetInfo.description}}</view>
			</view>
			<view class="packet-info">
				<view class="packet-amount">
					<text class="amount-dollars">￥</text>{{packetInfo.received}}
				</view>
				<view class="view-detail" @click="viewPacketDetail">查看红包明细</view>
				<!-- <view>
					<image :src="imgUrl + 'redDetail.png'" mode=""></image>
				</view> -->
			</view>
		</view>
		<view class="user-packet-list">
			<view class="packet-receive-info">{{packetInfo.stateName}}，已领取<text class="price"> {{packetInfo.receivedNumber}} / {{packetInfo.ticketNumber}}</text>，共<text
					class="price"> {{packetInfo.receivedAmount}} / {{packetInfo.totalAmount}} </text>元</view>
			<view>
				<view class="user-info-box" v-for="(item, index) in packetInfo.bountyAccountSubs" :key="index">
					<view class="user-left">
						<view class="user-img">
							<image :src="item.avatar ? item.avatar : defaultHead" mode=""></image>
						</view>
						<view class="packet-time-box">
							<view class="user-name-box">
								<view>{{item.nickname}}</view>
								<view class="new-custome" v-if="item.newCustomer">新客</view>
							</view>
							<view class="packet-time">{{item.createTime}}</view>
						</view>
					</view>
					<view class="user-amount">+{{item.amount}}</view>
					<view v-if="item.luckyState" class="best-luck">
						<image :src="imgUrl + 'bestLuck.png'" mode="widthFix"></image>
						<view>手气最佳</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				packetId: '',
				packetInfo: {}
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.packetId = options.packetId
			this.getPacketInfo()
		},
		methods: {
			/* 获取用户领取的红包详情 */
			getPacketInfo() {
				let that = this
				that.request({
					url: `${that.config.redPacketDetail}/${that.packetId}`
				}).then(res => {
					console.log('红包详情', res)
					let data = res.data.data
					data.bountyAccountSubs.forEach(item => {
						item.createTime = item.createTime.replace(/(\d{4})-(\d{2})-(\d{2})/g,
							'$1年$2月$3日')
						item.createTime = item.createTime.slice(0, 17)
					})
					that.packetInfo = data
				})
			},
			/* 查看红包明细 */
			viewPacketDetail() {
				uni.navigateTo({
					url: '../list/packet'
				})
			}
		}
	}
</script>

<style scoped>
	.store-info-box {
		background-color: #fff;
		padding-bottom: 36rpx;
	}

	.store-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 40rpx;
		color: #333;
		font-weight: 600;
	}

	.store-logo {
		padding-bottom: 20rpx;
	}

	.store-logo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: block;
	}

	.store-remark {
		font-size: 28rpx;
		font-weight: normal;
		padding-top: 20rpx;
	}

	.packet-info {
		background-image: url(https://qiaokun.yuepong.com/hongbei/receiveRed.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20rpx 30rpx;
	}

	.packet-amount {
		color: #FF5E3E;
		font-size: 140rpx;
		font-weight: 600;
		margin-top: 116rpx;
	}

	.amount-dollars {
		font-size: 40rpx;
	}

	.view-detail {
		width: 400rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background: linear-gradient(#F0C930, #F6E089);
		color: #C42104;
		font-size: 40rpx;
		border-radius: 50rpx;
		margin: 110rpx 0 40rpx;
		box-shadow: 0 0 50rpx 0 rgba(0, 0, 0, 0.2), -30rpx -20rpx 50rpx 0 rgba(0, 0, 0, 0.19);
	}
	
	.user-packet-list{
		background-color: #fff;
		margin-top: 14rpx;
		padding: 0 24rpx;
	}
	
	.packet-receive-info{
		padding: 20rpx 0;
	}

	.user-info-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 30rpx 22rpx;
		border-bottom: 1rpx solid #ccc;
		position: relative;
	}
	
	.user-info-box:last-child{
		border-bottom: 0;
	}

	.user-left {
		display: flex;
		align-items: center;
	}
	
	.user-img{
		margin-right: 20rpx;
	}

	.user-img image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		display: block;
	}

	.packet-time-box {
		font-size: 28rpx;
		color: #333;
	}
	
	.user-name-box {
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

	.packet-time {
		font-size: 24rpx;
		color: #999;
		padding-top: 20rpx;
	}

	.user-amount {
		color: #F2AB99;
		font-size: 40rpx;
	}
	
	.best-luck{
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #FAC92F;
		position: absolute;
		bottom: 20rpx;
		right: 0;
	}
	
	.best-luck image{
		width: 30rpx;
		height: auto;
		display: block;
		margin-right: 6rpx;
	}
</style>
