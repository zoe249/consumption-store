<template>
	<view class="goods-cont">
		<view v-for="(item, index) in newProductList" :key="index" class="goods-box" @click="goodsDetail(item)">
			<view class="goods-info">
				<view class="goods-img">
					<image :src="item.cardPicture" mode=""></image>
				</view>
				<!-- <block v-if="item.label == 1">
					<view class="goods-tag">
						<image src="../../static/goods/newGood.png" mode="widthFix"></image>
					</view>
				</block>
				<block v-if="item.label == 2">
					<view class="goods-tag">
						<image src="../../static/goods/hotGood.png" mode="widthFix"></image>
					</view>
				</block>
				<view class="goods-name">{{item.name}}</view>
				<view class="goods-enname">{{item.ename}}</view>
				<view class="goods-img">
					<image :src="item.picture" mode="widthFix"></image>
				</view>
				<view class="goods-price">￥{{item.marketPrice}}</view>
				<view class="goods-element">{{item.element}}</view> -->
				<!-- <view class="time-box"> -->
					<view class="bake-time"
						:class="[item.bakedEndName == '下午' ? 'afternoon' : '', item.bakedEndName == '全天' ? 'allday' : '']" v-if="item.bakedEndName !== ''">
						{{item.bakedEndName}}出炉
					</view>
					<view class="time-box">
						<view class="goods-time">
							<block v-if="item.bakeType !== ''">
								<image src="../../static/goods/timeIcon.png" mode="widthFix"></image>
								<block v-if="item.bakeType == '1'">
									<view v-if="item.bakeTime < 1">{{Math.round(item.bakeTime * 60)}}分钟</view>
									<view v-else>{{item.bakeTime}}小时</view>
								</block>
								<block v-if="item.bakeType == '2'">
									<view>{{item.bakeTimeEnd}}出炉</view>
								</block>
							</block>
						</view>
						<view class="goods-time" @click.stop="collectGoods(item)" v-if="custome">
							<block v-if="item.collection">
								<image src="../../static/goods/collectIcon.png" mode="widthFix"></image>
							</block>
							<block v-else>
								<image src="../../static/goods/noCollectIcon.png" mode="widthFix"></image>
							</block>
							<view>{{item.collectionCount}}</view>
						</view>
						<view class="goods-time" v-if="!custome">
							<image src="../../static/goods/collectIcon.png" mode="widthFix"></image>
							<view>{{item.collectionCount}}</view>
						</view>
					</view>
					
				<!-- </view> -->
			</view>
			<view class="operate-btn" v-if="!custome">
				<view class="goods-edit" @click="editItem(item.id)">
					<image src="../../static/goods/editIcon.png" mode="widthFix"></image>
				</view>
				<view class="goods-edit" @click="deleteItem(item.id)">
					<image src="../../static/goods/deleteIcon.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newProductList: []
			}
		},
		props: {
			productList: Array,
			custome: Boolean,
			productClass: String
		},
		mounted() {
			this.newProductList = this.productList
		},
		watch: {
			productList() {
				this.newProductList = this.productList
			}
		},
		methods: {
			editItem(id) {
				console.log('编辑 商品分类', this.productClass)
				uni.navigateTo({
					url: '/store/editProduct/editProduct?id=' + id + '&productClass=' + this.productClass
				})
			},
			deleteItem(id) {
				this.$emit('deleteGoods', id)
			},
			goodsDetail(item) {
				if (this.custome) {
					this.$emit('goToGoodsDetail', item.id)
				}
			},
			/* 点赞收藏/取消点赞 */
			collectGoods(item) {
				this.$emit('collectGoods', item)
				// let that = this
				// let title
				// console.log(item.collection)
				
				// if (this.custome) {
				// 	// 顾客端才能点赞收藏
				// 	that.request({
				// 		url: that.config.collectGood + `/${item.id}/collection`,
				// 		method: 'POST',
				// 		header: {
				// 			'Content-Type': 'application/json',
				// 			'Transaction-No': new Date().getTime()
				// 		}
				// 	}).then(res => {
				// 		console.log(res)
				// 		if (res.data.code == '200000') {
				// 			if (item.collection) {
				// 				title = '已取消'
				// 				item.collectionCount--
				// 			} else {
				// 				title = '已收藏'
				// 				item.collectionCount++
				// 			}
				// 			uni.showToast({
				// 				title: title,
				// 				icon: 'none'
				// 			})
				// 			item.collection = !item.collection
				// 		} else {
				// 			uni.showToast({
				// 				title: res.data.detail,
				// 				icon: 'none'
				// 			})
				// 		}
				// 	})
				// }
			}
		}
	}
</script>

<style scoped>
	.goods-cont {
		margin: 14rpx 24rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.goods-box {
		background-color: #fff;
		width: 346rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.goods-img image{
		width: 100%;
	}

	/* .goods-img {
		padding: 30rpx 0 26rpx;
	}

	.goods-img image {
		width: 294rpx;
		height: auto;
	} */

	.bake-time {
		color: #fff;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 20rpx;
		background-color: #F2AB99;
		width: 100rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.bake-time.afternoon {
		background-color: #7CD1F8;
	}

	.bake-time.allday {
		background-image: linear-gradient(to right, #7CD1F8, #C892FF, #F2AB99);
	}

	.goods-info {
		padding: 30rpx 24rpx 18rpx;
		text-align: center;
		position: relative;
	}

	.goods-tag {
		position: absolute;
		top: 18rpx;
		right: 18rpx;
	}

	.goods-tag image {
		width: 68rpx;
		height: auto;
	}

	.goods-name {
		font-size: 28rpx;
		color: #333;
		padding-bottom: 14rpx;
	}

	.goods-enname {
		font-size: 24rpx;
		color: #999;
	}

	.goods-info-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.goods-price {
		color: #F2AB99;
		font-size: 28rpx;
	}

	.goods-element {
		color: #999;
		font-size: 24rpx;
		line-height: 36rpx;
		padding: 16rpx 0 20rpx;
	}

	.time-box {
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

	.operate-btn {
		display: flex;
		align-items: center;
		border-top: 1rpx solid #F4F4F4;
	}

	.goods-edit {
		width: 50%;
		text-align: center;
		border-right: 1rpx solid #F4F4F4;
		padding: 28rpx 0;
	}

	.goods-edit:last-child {
		border-right: 0;
	}

	.goods-edit image {
		width: 24rpx;
		height: auto;
	}
</style>
