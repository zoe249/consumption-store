<template>
	<view>
		<block v-if="packetList.length != 0">
			<view v-for="(item, index) in packetList" :key="index" class="packet-box">
				<view>
					<view class="packet-state">
						<!-- 拼手气 -->
						<block v-if="item.category == 1">
							<view class="pin">拼</view>
							<view>拼手气红包</view>
						</block>
						<!-- 新客 -->
						<block v-if="item.category == 2">
							<view class="new">新客</view>
							<view>新客红包</view>
						</block>
						<!-- 已使用 -->
						<block v-if="item.category == 9">
							<view class="pin di">抵</view>
							<view>红包抵扣</view>
						</block>
						<!-- 已过期 -->
						<block v-if="item.category == 0">
							<view class="pin guo">过</view>
							<view>红包过期</view>
						</block>
					</view>
					<view class="packet-time">{{item.time}}</view>
				</view>
				<view class="packet-amount"
					:class="[item.category == 0 ? 'past-due' : '', item.category == 9 ? 'out-amount' : '']">
					<block v-if="item.category == 9">-</block>
					<block v-if="item.category == 1 || item.category == 2">+</block>
					{{item.balance}}
				</view>
			</view>
		</block>
		<block v-if="packetList.length == 0">
			<view class="empty-box">
				<image :src="imgUrl + 'detailEmpty.png'" mode="widthFix"></image>
				<view>暂无红包记录</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				packetList: [],
				userInfo: {},
				pageIndex: 1,
				pageSize: 10,
				packerUserInfo: {},
				storeId: '',
				completed: false
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
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
				uni.showLoading({
					title: '加载中',
					mark: true
				})
				that.request({
					url: `${that.config.bountyAccounts}/${that.packerUserInfo.id}/accountDetail`,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					uni.hideLoading()
					console.log('获取账户红包列表', res)
					const data = res.data.data.data
					if (data.length != 0) {
						data.forEach(item => {
							if (item.time != null) {
								item.time = item.time.replace(/(\d{4})-(\d{2})-(\d{2})/g,
									'$1年$2月$3日')
								// item.time = item.time.slice(0, 17)
							}
						})
						that.packetList.push(...data)
					} else {
						that.completed = true
					}
				})
			}
		}
	}
</script>

<style scoped>
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

	.pin.di {
		background-color: #FFC263;
	}

	.pin.guo {
		background-color: #ccc;
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

	.packet-amount.out-amount {
		color: #7CD1F8;
	}

	.packet-amount.past-due {
		color: #333;
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
