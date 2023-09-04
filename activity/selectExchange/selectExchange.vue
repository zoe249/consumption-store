<template>
	<view>
		<view class="exchange-price-box">
			<block v-if="amountList.length != 0">
				<view class="award-type">指定金额</view>
				<view class="exchange-goods-box">
					<view v-for="(item, index) in amountList" :key="index" class="exchange-box">
						<view :class="item.flag ? '' : 'disabled-exchange'"></view>
						<view class="exchange-price">
							<view class="price">
								{{item.amount}}
								<view class="unit">元</view>
							</view>
							<view class="exchange-goods">
								<view>以下商品</view>
								<view class="exchange-btn" @click="saveExchange(item)">兑换</view>
							</view>
						</view>
						<view class="card-info">{{item.awardTypeName}}</view>
					</view>
				</view>
			</block>
			<block v-if="goodsList.length != 0">
				<view class="award-type">指定商品</view>
				<view v-for="(item, index) in goodsList" :key="index" class="exchange-goods-cont">
					<view :class="item.flag ? '' : 'disabled-exchange'"></view>
					<view class="goods-card-info">{{item.awardTypeName}}</view>
					<view v-for="(goods, idx) in item.productList" :key="idx" class="goods-box"
						@click="selectGoods(idx)">
						<view class="img-name">
							<view class="goods-img">
								<image :src="goods.picture" mode=""></image>
							</view>
							<view class="goods-info">
								<view>{{goods.name}}</view>
								<view class="goods-price">￥{{goods.marketPrice}}</view>
							</view>
						</view>
						<block v-if="item.productList.length > 1">
							<view class="select-goods" :class="goodsIdx == idx ? 'isSelect-goods' : ''">
								<block v-if="goodsIdx == idx">
									<image src="../../static/store/check.png" mode=""></image>
								</block>
							</view>
						</block>
						<block v-else>
							<view class="goods-exchange-btn" @click="saveExchange(item, goods)">兑换</view>
						</block>
					</view>
					<view v-if="item.productList.length > 1" class="exchange-goods-btn">
						<view class="exchange-button" @click="saveExchange(item)">兑换</view>
					</view>
				</view>
			</block>
		</view>

		<!-- 兑换二维码 -->
		<view v-if="qrcodeShow" class="qrcode-box" @touchmove.stop.prevent="stopRoll">
			<view class="custom-qrcode">
				<view>请向商家出示二维码进行核销</view>
				<view class="qrcode-img">
					<yp-qrcode :text="qrcodeCont" :size="size" :quality="quality"></yp-qrcode>
				</view>
				<view class="qrcode-tip">
					<image :src="imgUrl + 'rule.png'"></image>
					<view>核销后卡片将从账户中扣除</view>
				</view>
				<view class="close-qrcode" @click="closeQrcode">关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				ruleList: [],
				amountList: [],
				goodsList: [],
				goodsIdx: 0,
				activityId: '', // 活动id
				qrcodeShow: false,
				qrcodeCont: '', // 要生成的二维码值
				size: 250,
				quality: 'L',
				userInfo: {}
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.activityId = options.id
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {
			this.getExchangeGoodsRule()
		},
		methods: {
			/* 活动兑换详情 */
			getExchangeGoodsRule() {
				let that = this
				that.amountList = []
				that.goodsList = []
				that.request({
					url: `${that.config.activityList}/${that.activityId}/activityConsume`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					data.forEach(item => {
						if (item.awardType == '1') {
							that.amountList.push(item)
						} else if (item.awardType == '2') {
							that.goodsList.push(item)
						}
					})
					// that.ruleList = data
				})
			},
			/* 选择商品 */
			selectGoods(idx) {
				this.goodsIdx = idx
			},
			/* 兑换商品 */
			goExchangeGoods(item, goods) {
				console.log('兑换', item)
				let goodsInfo
				if (item.productList.length !== 0) {
					goodsInfo = item.productList[this.goodsIdx]
				} else {
					goodsInfo = item
				}
				uni.navigateTo({
					url: '../exchange/exchange?goodsInfo=' + JSON.stringify(goodsInfo) + '&id=' + this.activityId +
						'&ruleId=' + item.id + '&awardTypeName=' + item.awardTypeName
				})
			},
			/* 兑换 */
			saveExchange(item, goods) {
				let that = this
				let goodsInfo
				if (item.productList.length !== 0) {
					goodsInfo = item.productList[this.goodsIdx]
				} else {
					goodsInfo = item
				}
				that.request({
					url: that.config.cardExchanges,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						openId: that.userInfo.openId,
						ruleId: item.id,
						productId: goodsInfo.id
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.qrcodeShow = true
						let userInfo = {
							openId: that.userInfo.openId,
							ruleId: item.id,
							productId: goodsInfo.id
						}
						that.qrcodeCont = JSON.stringify(userInfo)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			closeQrcode() {
				this.qrcodeShow = false
			}
		}
	}
</script>

<style scoped>
	.exchange-price-box {
		padding: 0 24rpx;
	}

	.award-type {
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #333;
	}

	.exchange-goods-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.exchange-box {
		background-color: #fff;
		width: 344rpx;
		margin-bottom: 14rpx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.disabled-exchange {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, .6);
		z-index: 999;
	}

	.exchange-price {
		padding: 40rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.price {
		font-size: 80rpx;
		color: #333;
		font-weight: 600;
		position: relative;
		text-align: center;
	}

	.unit {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		font-size: 20rpx;
		position: absolute;
		right: -16rpx;
		top: 8rpx;
	}

	.exchange-goods {
		/* padding-left: 44rpx; */
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}

	.exchange-btn {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		width: 122rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 50rpx;
		margin-top: 10rpx;
	}

	.card-info {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		height: 94rpx;
		text-align: center;
		padding: 0 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.exchange-goods-cont {
		background-color: #fff;
		margin-bottom: 20rpx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.goods-card-info {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		padding-left: 20rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.goods-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22rpx 20rpx 16rpx;
		font-size: 28rpx;
		color: #333;
	}

	.img-name {
		display: flex;
		align-items: center;
	}

	.goods-img {
		margin-right: 20rpx;
	}

	.goods-img image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
	}

	.goods-exchange-btn {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		width: 122rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 50rpx;
	}

	.exchange-goods-btn {
		display: flex;
		justify-content: flex-end;
		padding: 20rpx 0;
		margin: 0 20rpx;
		border-top: 1rpx solid #F4F4F4;
	}

	.exchange-button {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		width: 122rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 50rpx;
	}

	.goods-price {
		color: #F2AB99;
		font-size: 28rpx;
		margin-top: 34rpx;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		text-align: center;
	}

	.select-goods image {
		width: 18rpx;
		height: 12rpx;
	}

	.isSelect-goods {
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 二维码 */
	.qrcode-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 9999;
	}

	.custom-qrcode {
		text-align: center;
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
		margin: 150rpx 0 0;
	}

	.qrcode-img {
		margin: 60rpx auto 40rpx;
		width: 600rpx;
		height: 600rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #ccc;
	}

	.custom-qrcode>>>.canvas-qrcode {
		float: unset !important;
	}

	.qrcode-tip {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
		font-size: 28rpx;
	}

	.qrcode-tip image {
		width: 24rpx;
		height: 24rpx;
		padding-right: 14rpx;
	}

	.close-qrcode {
		position: fixed;
		left: 24rpx;
		right: 24rpx;
		bottom: 40rpx;
		border-radius: 50rpx;
		border: 1rpx solid #FDB193;
		color: #FDB193;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
