<template>
	<view>
		<u-sticky>
			<view class="add-cont">
				<view class="add-packet-cont">
					<view class="add-packet" @click="goNewPacket">
						<view class="add-packet-box">
							<image :src="imgUrl + 'addPacket.png'" mode=""></image>
							<view>新客红包</view>
						</view>
						<view class="right-img">
							<view class="packet-tip">获取门店新客</view>
							<image :src="imgUrl + 'packetArrow.png'" mode="widthFix"></image>
						</view>
					</view>
					<view class="add-packet" @click="goLuckPacket">
						<view class="add-packet-box">
							<image :src="imgUrl + 'addPacket.png'" mode=""></image>
							<view>拼手气红包</view>
						</view>
						<view class="right-img">
							<view class="packet-tip">提升群活跃</view>
							<image :src="imgUrl + 'packetArrow.png'" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="packet-tab">
					<u-tabs :list="stateList" :current="stateIdx" :scrollable="false" lineColor="#F2AB99"
						:activeStyle="{ color: '#F2AB99' }" @click="changePacketState"></u-tabs>
				</view>
			</view>
		</u-sticky>
		<block v-if="packetList.length != 0">
			<view v-for="(item, index) in packetList" :key="index" class="packet-box" @click="goPacketDetail(item)">
				<view class="packet-info">
					<view>
						<view class="packet-type-box">
							<view class="packet-type" v-if="item.type == 2">新客</view>
							<block v-if="item.type == 1">
								<image :src="imgUrl + 'pin.png'" class="pin-icon"></image>
							</block>
							<view class="packet-name">{{item.totalAmount}}元
								<block v-if="item.type == 1">拼手气</block>
								<block v-if="item.type == 2">新客</block>消费红包
							</view>
						</view>
						<view class="packet-time">
							<view class="packet-state"
								:class="[item.state == 2 ? 'sell-out' : '', item.state == 3 ? 'finish' : '']">
								{{item.stateName}}
							</view>
							<view class="time-box">{{item.creationDate}}发布</view>
						</view>
					</view>
					<view v-if="item.state != 3" @click.stop="openSharePacket(item)">
						<button open-type="share" class="packet-share" :id="index">
							<u-icon name="weixin-fill" color="#1D9C43" size="28"></u-icon>
							<view>分享</view>
						</button>
					</view>
				</view>
				<view class="packet-num">
					<view>
						<view class="num-box">￥{{item.totalAmount}}</view>
						<view>总金额</view>
					</view>
					<view>
						<view class="num-box">{{item.receivedNumber}}</view>
						<view>领取数</view>
					</view>
					<view>
						<view class="num-box">{{item.ticketNumber}}</view>
						<view>红包数</view>
					</view>
					<view>
						<view class="num-box">{{item.newCustomerNum}}</view>
						<view>新客人数</view>
					</view>
				</view>
			</view>
		</block>
		<block v-if="packetList.length == 0">
			<view class="empty-box">
				<image :src="imgUrl + 'detailEmpty.png'" mode="widthFix"></image>
				<view v-if="state == 1">去创建红包吧</view>
				<view v-if="state == 3">暂无已结束红包</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				stateList: [{
					name: '发放中',
					value: 1
				}, {
					name: '已结束',
					value: 3
				}],
				packetList: [],
				state: 1,
				pageIndex: 1,
				pageSize: 10,
				storeId: '',
				completed: false,
				shareShow: false,
				packetInfo: {},
				stateIdx: 0,
				storeInfo: {}
			}
		},
		onShow() {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			this.state = this.stateList[0].value
			this.packetList = []
			this.pageIndex = 1
			this.completed = false
			this.stateIdx = 0
			this.getRedPacketList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getRedPacketList()
			}
		},
		onShareAppMessage(res) {
			let item = this.packetList[res.target.id]
			let title
			let img
			let desc
			console.log(item)
			if (item.type == '1') {
				// 拼手气红包
				title = '拼手速'
				img = this.config.imgUrl + 'pinShareImg.png'
				desc = ''
			} else if (item.type == '2') {
				// 新客红包
				title = '新人速领'
				img = this.config.imgUrl + 'newShareImg.png'
				desc = '新客'
			}
			return {
				title: `${title}！${this.storeInfo.name}邀请你抢${item.totalAmount}元${desc}消费红包`,
				imageUrl: img,
				path: '/custom/home/index/index?packetId=' + item.id + '&storeId=' + this.storeId
			}
		},
		methods: {
			/* 切换红包状态 */
			changePacketState(item) {
				console.log('切换红包列表状态', item)
				this.state = item.value
				this.stateIdx = item.index
				this.packetList = []
				this.pageIndex = 1
				this.completed = false
				this.getRedPacketList()
			},
			/* 获取店铺红包列表 */
			getRedPacketList() {
				let that = this
				that.request({
					url: that.config.redPacketInfo,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId,
						state: that.state
					}
				}).then(res => {
					console.log('红包列表', res)
					const data = res.data.data.data
					if (data.length != 0) {
						data.forEach(item => {
							item.creationDate = item.creationDate.replace(/(\d{4})-(\d{2})-(\d{2})/g,
								'$1年$2月$3日')
							item.creationDate = item.creationDate.slice(5, 17)
						})
						that.packetList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* 跳转红包详情 */
			goPacketDetail(item) {
				uni.navigateTo({
					url: '../detail/detail?id=' + item.id
				})
			},
			/* 新客红包 */
			goNewPacket() {
				uni.navigateTo({
					url: '../addPacket/custome'
				})
			},
			/* 拼手气红包 */
			goLuckPacket() {
				uni.navigateTo({
					url: '../addPacket/luck'
				})
			},
			openSharePacket(item) {
				this.packetInfo = item
				this.shareShow = true
			}
		}
	}
</script>

<style scoped>
	.add-cont {
		background-color: #f8f8f8;
	}

	.add-packet-cont {
		background-color: #fff;
		padding: 24rpx;
	}

	.add-packet {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 10rpx;
		background-color: #FF5B4B;
		padding: 44rpx 20rpx;
		color: #fff;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}

	.add-packet-box {
		display: flex;
		align-items: center;
	}

	.add-packet-box image {
		width: 50rpx;
		height: 50rpx;
		display: block;
		margin-right: 20rpx;
	}

	.right-img {
		display: flex;
		align-items: center;
	}

	.packet-tip {
		font-size: 24rpx;
		color: rgba(255, 255, 255, .5);
		margin-right: 6rpx;
	}

	.right-img image {
		width: 14rpx;
		height: auto;
	}

	.packet-tab {
		margin: 14rpx 0;
		background-color: #fff;
	}

	.packet-box {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
	}

	.packet-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #ccc;
	}

	.packet-type-box {
		display: flex;
		align-items: center;
		padding-bottom: 16rpx;
	}

	.packet-type {
		padding: 0 14rpx;
		height: 44rpx;
		line-height: 44rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-right: 20rpx;
		background-color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	.pin-icon {
		width: 40rpx;
		height: 40rpx;
		display: block;
		margin-right: 14rpx;
	}

	.packet-name {
		color: #333;
		font-size: 28rpx;
	}

	.packet-time {
		display: flex;
		align-items: center;
	}

	.packet-state {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		color: #7CD1F8;
		border: 2rpx solid #7CD1F8;
		font-size: 20rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-right: 20rpx;
		background-color: #E5F6FE;
	}

	.packet-state.sell-out {
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
		background-color: #FCEEEB;
	}

	.packet-state.finish {
		color: #333;
		border: 2rpx solid #333;
		background-color: #D6D6D6;
	}

	.time-box {
		font-size: 28rpx;
		color: #999;
	}

	.packet-share {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 74rpx;
		line-height: 74rpx;
		color: #1D9C43;
		border: 2rpx solid #1D9C43;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
		background-color: #fff;
		padding: 0;
	}

	.packet-num {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #999;
		text-align: center;
		padding: 40rpx 0;
	}

	.num-box {
		font-size: 40rpx;
		color: #333;
		margin-bottom: 8rpx;
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
	
	.empty-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 130rpx 0 0;
	}
	
	.empty-box image{
		width: 180rpx;
		height: auto;
		display: block;
		margin-bottom: 40rpx;
	}
</style>
