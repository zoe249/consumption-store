<template>
	<view class="goods-cont">
		<!-- <waterfallsFlow :list="newProductList" imageSrcKey="picture" @image-click="goodsDetail"></waterfallsFlow> -->
		<custom-waterfalls-flow :value="newProductList" imageKey="picture" @imageClick="goodsDetail">
		</custom-waterfalls-flow>
	</view>
</template>

<script>
	import customWaterfallsFlow from "@/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue";
	export default {
		data() {
			return {
				newProductList: []
			}
		},
		props: {
			productList: Array,
			menu: {
				type: Boolean,
				default: true
			}, // 是否为菜单列表
			custome: {
				type: Boolean,
				default: false
			}, // 是否是顾客端
			productClass: String,
			bake: {
				type: Boolean,
				default: false
			} // 是否为预定列表
		},
		components: {
			customWaterfallsFlow
		},
		mounted() {
			console.log('商品分类', this.productClass)
			this.newProductList = this.productList
			console.log('商品列表', this.newProductList)
			// this.$refs.waterfallsFlowRef.refresh();
		},
		watch: {
			productList() {
				this.newProductList = this.productList
				// this.$refs.waterfallsFlowRef.refresh();
			}
		},
		methods: {
			/* 编辑商品 */
			editItem(id) {
				uni.navigateTo({
					url: '/store/editProduct/editProduct?id=' + id + '&productClass=' + this.productClass
				})
			},
			/* 商品详情 */
			goodsDetail(item) {
				console.log('点击图片返回', item)
				// 顾客端列表
				if (this.custome) {
					this.$emit('goToGoodsDetail', item.id)
				}
				// 菜单
				if (this.menu || this.bake) {
					this.$emit('goToGoodsDetail', item.productId)
				}
			},
			/* 删除商品 */
			deleteItem(id) {
				this.$emit('deleteGoods', id)
			},
			/* 点赞收藏/取消点赞 */
			collectGoods(item) {
				let that = this
				let title
				console.log(item.collection)

				if (this.custome) {
					// 顾客端才能点赞收藏
					that.request({
						url: that.config.collectGood + `/${item.id}/collection`,
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'Transaction-No': new Date().getTime()
						}
					}).then(res => {
						console.log(res)
						if (res.data.code == '200000') {
							if (item.collection) {
								title = '已取消'
								item.collectionCount--
							} else {
								title = '已收藏'
								item.collectionCount++
							}
							uni.showToast({
								title: title,
								icon: 'none'
							})
							item.collection = !item.collection
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			/* 增加商品数量 */
			addGoodsNum(item) {
				console.log('11111111111')
				this.$emit('addGoodsNum', item)
			},
			/* 减少商品数量 */
			reduceGoodsNum(item) {
				console.log('2222222222')
				this.$emit('reduceGoodsNum', item)
			},
			/* 改变商品数量 */
			changeAddGoodsNum(item) {
				console.log('33333333')
				this.$emit('changeAddGoodsNum', item)
			},
		}
	}
</script>

<style scoped>
	.goods-cont {
		margin: 0 24rpx;
	}

	.goods-box {
		background-color: #fff;
		width: 346rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.goods-img image {
		width: 100%;
		height: auto;
	}

	.goods-info {
		/* padding: 30rpx 24rpx 18rpx;
		text-align: center; */
		position: relative;
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
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
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

	.add-img {
		display: flex;
		justify-content: flex-end;
		padding: 20rpx;
	}

	.add-img image {
		width: 44rpx;
		height: 44rpx;
	}

	.goods-input {
		width: 100rpx;
		text-align: center;
	}

	.sell-out {
		font-size: 24rpx;
		border-radius: 50rpx;
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		colog: #333;
		background: #D6D6D6;
		border: 1rpx solid #333;
		text-align: center;
	}
	
	.sell-out.tag-nostart {
		color: #FFC263;
		background: #FFF3E0;
		border: 1rpx solid #FFC263;
	}
</style>
