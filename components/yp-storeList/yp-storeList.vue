<template>
	<view>
		<block v-for="(item,index) in storeList" :key="index">
			<view class="store-box" :class="item.select ? 'active-store' : ''" @click="storeCustomePacket(item.id)">
				<view class="store-info-box">
					<view class="store-img">
						<image :src="item.logo ? item.logo : defaultHead"></image>
					</view>
					<view class="store-info">
						<view class="store-type-box">
							<view class="store-name">{{item.name}}</view>
							<!-- 1-展示版 2-旗舰版 3-预定版 4-交易版 -->
							<view v-if="item.storeType == 1" class="store-type">S</view>
							<view v-if="item.storeType == 2" class="store-type qijian-type">V</view>
							<view v-if="item.storeType == 3" class="store-type yuding-type">R</view>
							<view v-if="item.storeType == 4" class="store-type jiaoyi-type">D</view>
						</view>
						<view v-if="redPacket" class="red-packet">
							<view>消费红包：<text class="store-price">￥{{item.presentBalance}}</text></view>
						</view>
						<block v-if="!redPacket">
							<view v-if="item.state !== null">
								{{item.state}}{{item.city}}{{item.district}}{{item.address}}
							</view>
						</block>
					</view>
				</view>
				<view class="choose-btn" @click.stop="manageStore(item.id)" :class="redPacket ? 'red-packet-btn' : ''">
					{{storeState}}</view>
			</view>
		</block>
		<view style="height: 140rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
			}
		},
		props: {
			storeList: Array,
			storeState: String,
			customeStore: {
				type: Boolean,
				default: false
			},
			redPacket: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			/* 选择店铺管理, 注册门店 */
			manageStore(id) {
				this.$emit('manageStore', id)
			},
			/* 查看账户红包详情 */
			storeCustomePacket(id) {
				if (this.redPacket) {
					this.$emit('storePacket', id)
				}
			}
		}
	}
</script>

<style scoped>
	.store-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		color: #333;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1rpx solid #fff;
	}

	.store-box.active-store {
		border: 1rpx solid #F2AB99;
	}

	.store-info-box {
		display: flex;
		align-items: center;
		max-width: 75%;
	}

	.store-img {
		margin-right: 20rpx;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	
	.store-type-box{
		display: flex;
		align-items: center;
	}
	
	.store-type{
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		line-height: 30rpx;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		background-color: #62B279;
		margin-left: 10rpx;
	}
	
	.store-type.qijian-type{
		background-color: #FFC263;
	}
	
	.store-type.yuding-type{
		background-color: #7CD1F8;
	}
	
	.store-type.jiaoyi-type{
		background-color: #B463FF;
	}

	.store-name {
		font-size: 28rpx;
	}

	.red-packet {
		color: #333;
		padding-top: 10rpx;
		font-size: 32rpx;
	}

	.store-price {
		color: #dd5b33;
	}

	.choose-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F2AB99;
		color: #fff;
		font-size: 20rpx;
		height: 48rpx;
		line-height: 48rpx;
		width: 140rpx;
		border-radius: 50rpx;
	}

	.red-packet-btn {
		background-color: #fff;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	.store-state-box {
		display: flex;
		align-items: center;
		margin-bottom: 18rpx;
	}

	.store-state {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		color: #7CD1F8;
		border: 1rpx solid #7CD1F8;
		border-radius: 50rpx;
		text-align: center;
		background-color: #E5F6FE;
		font-size: 20rpx;
		margin-left: 14rpx;
	}

	.store-state.open-state {
		background-color: #FFF3E0;
		color: #FFC263;
		border-color: #FFC263;
	}

	.store-state.close-state {
		background-color: #F5F5F5;
		color: #ccc;
		border-color: #ccc;
	}
</style>
