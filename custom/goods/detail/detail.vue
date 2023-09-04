<template>
	<view>
		<view class="goods-img">
			<image :src="products.picture" mode="widthFix"></image>
		</view>
		<view class="goods-info">
			<view class="goods-name">{{products.name}}</view>
			<view class="goods-price">￥{{products.marketPrice}}</view>
			<view class="goods-element">{{products.element}}</view>
			<view class="goods-time-box">
				<view class="back-time">{{products.bakedEndName}}出炉</view>
				<view class="goods-time">
					<image src="../../../static/goods/timeIcon.png" mode="widthFix"></image>
					<block v-if="products.bakeType == '1'">
						<view>{{products.bakeTime}}小时</view>
					</block>
					<block v-if="products.bakeType == '2'">
						<view>{{products.bakeTimeEnd}}出炉</view>
					</block>
				</view>
			</view>
		</view>
		<view class="goods-detail">
			<view class="detail-tip">商品详情</view>
			<view class="goods-desc" v-if="products.featureDescribe !== ''">{{products.featureDescribe}}</view>
			<view v-for="(item, index) in fullDescList" :key="index">
				<view>{{item.description}}</view>
				<block v-for="(img, idx) in item.pictureList" :key="idx">
					<image :src="img.img" mode="widthFix"></image>
				</block>
			</view>
			<!-- <u-parse :content="content"></u-parse> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productsId: '', //商品id
				products: '', // 商品信息
				content: '',
				fullDescList: [{
					description: '',
					pictureList: []
				}],
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			console.log('options', options)
			this.productsId = options.id
			console.log('商品id', this.productsId)
		},
		onShow() {
			this.getProductsByID()
		},
		methods: {
			getProductsByID() {
				let that = this
				that.request({
					url: that.config.products + '/' + that.productsId,
				}).then(res => {
					console.log('商品详情', res)
					if (res.data.data) {
						that.products = res.data.data
						// that.content = res.data.data.fullDescription
						let fullDesc = that.products.fullDescription.split(',')
						fullDesc.splice(fullDesc.length -1, 1)
						let flag = -1
						let leng = fullDesc.filter(data => (data.indexOf('https://') < 0)).length
						for (let i = 0; i < leng; i++) {
							this.fullDescList.push({
								description: '',
								pictureList: []
							})
						}
						fullDesc.forEach(item => {
							console.log(item)
							if (item.indexOf('https') > -1) {
								this.fullDescList[flag].pictureList.push({
									img: item
								})
							} else {
								flag++
								this.fullDescList[flag].description = item
							}
						})
					} else {
						return
					}
				})
			}
		}
	}
</script>

<style scoped>
	.goods-img image {
		width: 100%;
		height: auto;
	}

	.goods-info {
		padding: 20rpx 24rpx;
		color: #333;
		font-size: 28rpx;
		background-color: #fff;
	}

	.goods-name {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		padding-bottom: 26rpx;
	}

	.goods-price {
		color: #F2AB99;
		font-size: 28rpx;
		padding-bottom: 16rpx;
	}

	.goods-element {
		color: #999;
		font-size: 24rpx;
	}

	.back-time {
		width: 100rpx;
		height: 32rpx;
		line-height: 32rpx;
		color: #fff;
		background-color: #F2AB99;
		border-radius: 50rpx;
		font-size: 20rpx;
		text-align: center;
	}

	.goods-time-box {
		padding-top: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.goods-time {
		display: flex;
		align-items: center;
		font-size: 24rpx;
	}

	.goods-time image {
		width: 36rpx;
		height: auto;
		margin-right: 4rpx;
	}
	
	.goods-detail{
		background-color: #fff;
		padding: 40rpx 44rpx;
		margin-top: 20rpx;
	}
	
	.detail-tip{
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
	}
	
	.goods-desc{
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0;
	}
</style>
