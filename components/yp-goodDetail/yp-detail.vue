<template>
	<view>
		<view class="goods-img-box">
			<image :src="imgUrl + 'closeIcon.png'" mode="" class="close-icon" @click="closeDetail"></image>
			<image :src="products.picture" mode="widthFix" class="goods-img"></image>
			<view class="goods-name-info">
				<view>
					<view class="goods-name">{{products.name}}</view>
					<view class="goods-ename" v-if="products.ename !== ''">{{products.ename}}</view>
				</view>
				<view class="goods-price">￥{{products.marketPrice}}</view>
			</view>
			<block v-if="bakeState != 0 && bakeState != 3">
				<!-- 非售罄和未开始商品 -->
				<view class="add-shop" @click="closeDetail" v-if="storeInfo.storeType == 2 && (!tomorrowMenu)">
					<image src="../../static/custome/shopCart2.png" mode="widthFix"></image>
					<view>加入购物车</view>
				</view>
			</block>
		</view>
		<view class="goods-element">
			<view class="weight-cal">
				<view class="weight-box"  v-if="products.weight !== null && products.weight != 0">
					<view>重量：</view>
					<view>{{products.weight}}g</view>
				</view>
				<view class="weight-box"  v-if="products.calorie !== null && products.calorie != 0">
					<view>热量：</view>
					<view>{{products.calorie}}cal</view>
				</view>
			</view>
			<block v-if="products.element !== ''">{{products.element}}</block>
			<block v-if="products.featureDescribe !== ''">{{products.featureDescribe}}</block>
		</view>
		<view class="goods-detail">
			<view class="detail-tip">商品详情</view>
			<!-- <view v-for="(item, index) in fullDescList" :key="index">
				<view>{{item.description}}</view>
				<block v-for="(img, idx) in item.pictureList" :key="idx">
					<image :src="img.img" mode="widthFix"></image>
				</block>
			</view> -->
			<view v-for="(item, index) in fullDescList" :key="index" class="add-box">
				<view v-if="item.description != undefined">{{item.description}}</view>
				<view v-if="item.img != undefined">
					<image :src="item.img" mode="widthFix"></image>
				</view>
				<view v-if="item.tempFilePath != undefined">
					<video :src="item.tempFilePath"></video>
				</view>
			</view>
			<!-- <u-parse :content="content"></u-parse> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				products: '', // 商品信息
				content: '',
				// fullDescList: [{
				// 	description: '',
				// 	pictureList: []
				// }],
				storeInfo: {},
				list: [],
				fullDescList: []
			}
		},
		props: {
			productsId: String,
			tomorrowMenu: {
				type: Boolean,
				default: false
			},
			bakeState: String
		},
		mounted() {
			this.storeInfo = uni.getStorageSync('storeInfo')
		},
		methods: {
			closeDetail() {
				// if (this.products.bakeState == 0) {
				// 	// 未开始的商品
				// 	uni.showToast({
				// 		title: '商品未开始烘烤,不可加入购物车',
				// 		icon: 'none'
				// 	})
				// } else {
					this.$emit('addGoodsNum', this.products)
					this.$emit('closeDetailShow', false)
				// }
			},
			getProductsByID() {
				let that = this
				that.fullDescList = []
				that.request({
					url: `${that.config.products}/${that.productsId}`
				}).then(res => {
					if (res.data.code == '200000') {
						const data = res.data.data
						that.selectGoodsList = uni.getStorageSync('selectGoodsList')
						data.num = 0
						if (that.selectGoodsList.length != 0) {
							that.selectGoodsList.forEach(value => {
								if (data.id == value.productId || data.id == value.id) {
									data.num = value.num
								}
							})
						}
						that.products = data
						// that.content = res.data.data.fullDescription
						// let fullDesc = that.products.fullDescription.split(',')
						// fullDesc.splice(fullDesc.length - 1, 1)
						// let flag = -1
						// let leng = fullDesc.filter(data => (data.indexOf('https://') < 0)).length
						// for (let i = 0; i < leng; i++) {
						// 	this.fullDescList.push({
						// 		description: '',
						// 		pictureList: []
						// 	})
						// }
						// fullDesc.forEach(item => {
						// 	console.log(item)
						// 	if (item.indexOf('https') > -1) {
						// 		this.fullDescList[flag].pictureList.push({
						// 			img: item
						// 		})
						// 	} else {
						// 		flag++
						// 		this.fullDescList[flag].description = item
						// 	}
						// })
						
						if (that.products.fullDescription != undefined && that.products.fullDescription !== '') {
							let fullDesc = that.products.fullDescription.split(',')
							console.log('fullDesc', fullDesc)
							fullDesc.forEach(item => {
								console.log(item.indexOf('https://'))
								console.log(item.indexOf('http://'))
								if (item.indexOf('https://') > -1) {
									// 照片
									this.fullDescList.push({
										img: item
									})
								} else if (item.indexOf('http://') > -1) {
									// 视频
									this.fullDescList.push({
										tempFilePath: item
									})
								} else {
									// 文字
									this.fullDescList.push({
										description: item
									})
								}
							})
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	.detail-title {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 30rpx 0;
		background-color: #fff;
	}

	.goods-img-box {
		position: relative;
	}

	.close-icon {
		width: 44rpx;
		height: 44rpx;
		position: absolute;
		right: 24rpx;
		top: 24rpx;
	}

	.goods-img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 10rpx 10rpx 0 0;
	}
	
	.goods-name-info{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 150rpx;
		background: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .7));
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
		color: #fff;
		font-size: 40rpx;
	}
	
	.goods-ename{
		font-size: 24rpx;
		margin-top: 16rpx;
	}
	
	.goods-price {
		color: #fff;
		font-size: 40rpx;
	}
	
	.goods-element {
		color: #999;
		font-size: 28rpx;
		padding: 40rpx 24rpx;
		background-color: #fff;
	}
	
	.weight-cal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
	
	.weight-box {
		display: flex;
		align-items: center;
	}

	.goods-info {
		padding: 20rpx 24rpx;
		color: #333;
		font-size: 28rpx;
		background-color: #fff;
	}

	.goods-detail {
		background-color: #fff;
		padding: 40rpx 44rpx;
		border-top: 14rpx solid #F4F4F4;
	}
	
	.goods-detail image{
		width: 100%;
		height: auto;
	}

	.detail-tip {
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
	}

	.goods-desc {
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0;
	}
	
	.add-shop{
		position: absolute;
		right: 24rpx;
		bottom: -40rpx;
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #F2AB99;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		border-radius: 50rpx;
		z-index: 999;
	}
	
	.add-shop image{
		width: 40rpx;
		height: auto;
		margin-right: 10rpx;
	}
</style>
