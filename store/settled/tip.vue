<template>
	<view>
		<view class="apply-step">
			<view class="apply-tip">四步轻松入驻店铺</view>
			<view class="step-box">
				<view v-for="(item, index) in stepList" :key="index" class="step-cont">
					<view class="step-img">
						<image :src="item.activeImg" mode="widthFix"></image>
					</view>
					<view>{{item.name}}</view>
				</view>
			</view>
		</view>
		<view class="apply-intro">
			<view>展示型店铺</view>
			<view class="apply-desc">展示型店铺为商家提供商品个性化展示功能，包括商品信息、今日售卖菜单、 明日菜单等功能，便于商家向粉丝群中宣传商品。</view>
		</view>
		<view class="apply-intro">
			<view>交易型店铺</view>
			<view class="apply-desc">
				交易型店铺除了为商家提供展示型店铺的个性化功能外，还提供商品交易功能，包括预定自提、送货到家、集卡游戏、消费红包、营业数据统计、记账、配方、食谱等功能，为商家的经营提供全方位支持。</view>
		</view>
		<view class="save-btn">
			<view v-for="(item, index) in btnList" :key="index" :class="index == 1 ? 'order-store' : ''"
				@click="applyStore(item)">入驻{{item.name}}店铺</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				stepList: [{
					activeImg: this.config.imgUrl + 'signFill.png',
					img: '',
					name: '添加店铺'
				}, {
					activeImg: this.config.imgUrl + 'baseinfoFill.png',
					img: this.config.imgUrl + 'baseinfo.png',
					name: '资质认证'
				}, {
					activeImg: this.config.imgUrl + 'success.png',
					img: this.config.imgUrl + 'sign.png',
					name: '审核通过'
				}, {
					activeImg: this.config.imgUrl + 'signFill.png',
					img: this.config.imgUrl + 'qrcode.png',
					name: '管理店铺'
				}],
				btnList: [{
					name: '展示型',
					value: 1
				}, {
					name: '交易型',
					value: 2
				}]
			}
		},
		methods: {
			/* 入驻店铺 */
			applyStore(item) {
				uni.navigateTo({
					url: './verifyPhone?storeType=' + item.value
				})
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
	.apply-step{
		background-color: #F4F4F4;
		padding: 40rpx 0;
	}
	
	.apply-tip {
		font-weight: 600;
		font-size: 40rpx;
		color: #333;
		text-align: center;
		padding-bottom: 60rpx;
	}

	.step-box {
		padding: 0 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #CCCCCC;
	}

	.step-cont {
		text-align: center;
		position: relative;
		width: 112rpx;
		color: #F2AB99;
	}

	.step-cont .step-img {
		background-color: #F2AB99;
	}

	.step-img {
		background-color: #eee;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 30rpx;
	}

	.step-img image {
		width: 30rpx;
		height: auto;
	}

	.step-cont:nth-child(n+2):after {
		content: '';
		height: 2rpx;
		width: 68rpx;
		background: #F2AB99;
		position: absolute;
		left: -54%;
		top: 30rpx;
	}

	.apply-intro {
		padding: 36rpx 24rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
	}
	
	.apply-desc{
		font-size: 28rpx;
		font-weight: normal;
		padding: 10rpx 0;
		line-height: 45rpx;
	}

	.save-btn {
		/* margin: 40rpx 24rpx; */
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
	}

	.save-btn view {
		border: 2rpx solid #F2AB99;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.save-btn view.order-store {
		background-color: transparent;
		color: #F2AB99;
		margin-top: 20rpx;
	}
</style>
