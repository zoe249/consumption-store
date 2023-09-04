<template>
	<view>
		<view class="user-info-box">
			<view class="user-info">
				<view class="custome-info">
					<view>{{packerUserInfo.nickname}}</view>
					<view class="custome-phone">{{packerUserInfo.phone}}</view>
				</view>
				<view class="red-packet-amount">
					<view>
						<view>消费红包（元）</view>
						<view class="amount">{{packerUserInfo.presentBalance}}</view>
					</view>
					<view class="packet-detail" @click="goPacketDetail">明细</view>
				</view>
			</view>
		</view>
		<u-sticky>
			<view class="state-box">
				<u-tabs :list="stateList" :scrollable="false" lineColor="#F2AB99" :activeStyle="{ color: '#F2AB99' }"
					@click="changePacketList"></u-tabs>
			</view>
		</u-sticky>
		<block v-if="packetList.length == 0">
			<view class="empty-box">
				<image :src="imgUrl + 'detailEmpty.png'" mode="widthFix"></image>
				<view v-if="state == 1">参与商家红包活动领取红包</view>
				<view v-if="state == 2">暂无已使用红包</view>
				<view v-if="state == 3">暂无已过期红包</view>
			</view>
		</block>
		<block v-else>
			<view v-for="(item, index) in packetList" :key="index" class="packet-box">
				<view>
					<view class="packet-state">
						<view v-if="item.type == 1" class="pin">拼</view>
						<view v-if="item.type == 2" class="new">新客</view>
						<view>
							<block v-if="item.type == 1">拼手气</block>
							<block v-if="item.type == 2">新客</block>
							红包
						</view>
					</view>
					<view class="packet-time">
						<block v-if="item.expirationDate == null">永久有效</block>
						<block v-else>{{item.expirationDate}} 到期</block>
					</view>
				</view>
				<view class="state-amount">
					<view class="packet-state-img">
						<image :src="imgUrl + 'used.png'" mode="widthFix" v-if="item.state == 2"></image>
						<image :src="imgUrl + 'outDate.png'" mode="widthFix" v-if="item.state == 3"></image>
					</view>
					<view class="packet-amount">
						<block v-if="item.state == 1">+</block>
						<block v-if="item.state == 2 || item.state == 3">-</block>
						{{item.amount}}</view>
				</view>
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
					name: '未使用',
					state: 1
				}, {
					name: '已使用',
					state: 2
				}, {
					name: '已过期',
					state: 3
				}],
				packetList: [],
				userInfo: {},
				pageIndex: 1,
				pageSize: 10,
				state: '',
				packerUserInfo: {},
				storeId: '',
				completed: false
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.state = this.stateList[0].state
			this.userInfo = uni.getStorageSync('userInfo')
			if (options.storeId == undefined) {
				this.storeId = uni.getStorageSync('storeInfo').id
			} else {
				this.storeId = options.storeId
			}
			this.getPacketUserInfo()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getPacketList()
			}
		},
		methods: {
			/* 获取用户店铺下的红包账户 */
			getPacketUserInfo() {
				let that = this
				that.request({
					url: `${that.config.bountyAccounts}?storeId=${that.storeId}&openId=${that.userInfo.openId}`
				}).then(res => {
					console.log('获取用户店铺下的红包账户', res)
					that.packerUserInfo = res.data.data
					that.getPacketList()
				})
			},
			/* 获取账户红包列表 */
			getPacketList() {
				let that = this
				that.request({
					url: `${that.config.bountyAccounts}/${that.packerUserInfo.id}/accountSub`,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						state: that.state
					}
				}).then(res => {
					console.log('获取账户红包列表', res)
					const data = res.data.data.data
					if (data.length != 0) {
						data.forEach(item => {
							if (item.expirationDate != null) {
								item.expirationDate = item.expirationDate.replace(
									/(\d{4})-(\d{2})-(\d{2})/g,
									'$1年$2月$3日')
								item.expirationDate = item.expirationDate.slice(0, 11)
							}
						})
						that.packetList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* 切换红包列表状态 */
			changePacketList(e) {
				console.log('切换红包列表状态', e)
				this.state = e.state
				this.pageIndex = 1
				this.packetList = []
				this.getPacketList()
			},
			/* 跳转红包明细 */
			goPacketDetail() {
				uni.navigateTo({
					url: './detail'
				})
			}
		}
	}
</script>

<style scoped>
	.user-info-box {
		background-color: #fff;
		padding: 24rpx;
	}

	.user-info {
		background-color: #FEF3E2;
		padding: 10rpx 20rpx 20rpx;
		border-radius: 10rpx;
	}

	.custome-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #94592B;
		padding: 20rpx 0;
	}

	.custome-phone {
		font-size: 20rpx;
	}

	.red-packet-amount {
		background-image: url(https://qiaokun.yuepong.com/hongbei/packetBg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		color: #fff;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx;
	}

	.amount {
		font-size: 40rpx;
		font-weight: 600;
		padding-top: 12rpx;
	}

	.packet-detail {
		color: #C73922;
		font-size: 24rpx;
		padding-right: 24rpx;
	}

	.state-box {
		background-color: #fff;
	}

	.packet-box {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 52rpx 30rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.packet-state {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
	}

	.new {
		width: 80rpx;
		height: 44rpx;
		line-height: 44rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-right: 20rpx;
		background-color: #FF5B4B;
	}

	.pin {
		width: 44rpx;
		height: 44rpx;
		line-height: 44rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50%;
		text-align: center;
		margin-right: 20rpx;
		background-color: #F2AB99;
	}

	.packet-time {
		font-size: 28rpx;
		color: #999;
		padding-top: 20rpx;
	}

	.packet-amount {
		font-size: 40rpx;
		color: #F2AB99;
	}

	.state-amount {
		display: flex;
		align-items: center;
	}

	.packet-state-img {
		margin-right: 40rpx;
	}

	.packet-state-img image {
		width: 122rpx;
		height: auto;
		display: block;
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
