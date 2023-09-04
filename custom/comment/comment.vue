<template>
	<view class="goods-box">
		<!-- <waterfallsFlow ref="waterfallsFlowRef" :list="commentList" imageSrcKey="picture" @image-click="goToGoodsDetail"> -->
		<custom-waterfalls-flow ref="waterfallsFlowRef" :value="commentList" :column="2" :columnSpace="1.5" :seat="2"
			imageKey="picture" @imageClick="goToGoodsDetail">
			<view class="comment-box" v-for="(item,index) in commentList" :key="index" slot="slot{{index}}">
				<view class="comment-goods-name">{{item.name}}</view>
				<view class="weight-cal">
					<view v-if="item.weight !== null && item.weight != 0">重量：{{item.weight}}g</view>
					<view v-if="item.calorie !== null && item.calorie != 0">热量：{{item.calorie}}cal</view>
				</view>
				<view class="comment-func-box">
					<view class="triangle-box" v-if="item.commentShow">
						<view class="comment-func-btn">
							<view class="comment-btn zan-box" @click="collectGoods(item)">
								<image :src="imgUrl + 'zan.png'" mode="widthFix"></image>
								<view>赞</view>
							</view>
							<view class="comment-btn" @click="openCommentShow(item)">
								<image :src="imgUrl + 'comment.png'" mode="widthFix"></image>
								<view>评论</view>
							</view>
						</view>
						<view class="triangle"></view>
					</view>
					<view class="comment-func" @click="openCommentFuncShow(item)">
						<image :src="imgUrl + 'commentIcon.png'" mode=""></image>
					</view>
				</view>
				<view class="like-box" v-if="item.collectionList.length != 0">
					<image :src="imgUrl + 'like.png'" mode="widthFix"></image>
					<view v-for="(citem, cidx) in item.collectionList" :key="cidx" class="like-name">
						{{citem.nickname}}<text v-if="cidx != (item.collectionList.length - 1)">、</text>
					</view>
				</view>
				<view class="goods-comment-box" v-if="item.customerCommentList.length != 0">
					<view v-for="(coitem, cidx) in item.customerCommentList" :key="cidx" class="goods-comment">
						<text class="comment-name">{{coitem.nickname}}：</text>
						<text>{{coitem.comment}}</text>
					</view>
				</view>
			</view>
		<!-- </waterfallsFlow> -->
		</custom-waterfalls-flow>

		<!-- 评论 -->
		<u-popup :show="commentShow" @close="closeCommentShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<textarea placeholder="请输入您的评价" v-model="comment"
						placeholder-style="color: #ccc; line-height: 60rpx;"></textarea>
				</view>
				<view class="definition-btn-box">
					<view @click="closeCommentShow">取消</view>
					<view class="confirm-btn" @click="commentGoods">确认</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 商品详情 -->
		<u-popup :show="detailShow" @close="closeDetailShow" :round="10">
			<scroll-view class="detail-box" scroll-y="true" :style="'max-height:' + (screenHeight - 130 - statusBarHeight) + 'px'">
				<yp-detail ref="detail" :productsId="productsId" :tomorrowMenu="true" @closeDetailShow="closeDetailShow"></yp-detail>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import customWaterfallsFlow from "@/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue";
	import ypDetail from '@/components/yp-goodDetail/yp-detail.vue'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				pageIndex: 1,
				pageSize: 10,
				storeInfo: {},
				userInfo: {},
				commentList: [],
				comment: '',
				commentShow: false,
				goodComment: {},
				completed: false,
				detailShow: false,
				productsId: '', // 查看详情商品id
				screenHeight: 0,
				statusBarHeight: 0
			}
		},
		components: {
			ypDetail,
			customWaterfallsFlow
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.userInfo = uni.getStorageSync('userInfo')
			this.pageIndex = 1
			this.commentList = []
			this.getCommentList()
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
					that.screenHeight = res.screenHeight
					console.log('screenHeight', that.screenHeight)
				}
			})
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getCommentList()
			}
		},
		watch: {
			comment() {
				if (this.comment.length > 140) {
					uni.showToast({
						title: '商品评论不可超过140个字',
						icon: 'none'
					})
					setTimeout(() => {
						this.comment = this.comment.substring(0, 140)
					}, 10)
				}
			}
		},
		methods: {
			/* 获取评论商品 */
			getCommentList() {
				let that = this
				that.request({
					url: that.config.commentTop,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeInfo.id
					},
				}).then(res => {
					const data = res.data.data.data
					if (data.length !== 0) {
						data.forEach(item => {
							item.commentShow = false
						})
						that.commentList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			openCommentFuncShow(item) {
				item.commentShow = !item.commentShow
			},
			/* 点赞收藏/取消点赞 */
			collectGoods(item) {
				let that = this
				let title
				console.log(item.collection)
				// 顾客端才能点赞收藏
				that.request({
					url: `${that.config.collectGood}/${item.id}/collection`,
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
							item.collectionList.forEach((collect, i) => {
								if (that.userInfo.nickname == collect.nickname) {
									item.collectionList.splice(i, 1)
								}
							})
						} else {
							title = '已收藏'
							item.collectionCount++
							item.collectionList.push({
								nickname: that.userInfo.nickname,
							})
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
			},
			/* 评论商品 */
			commentGoods() {
				let that = this
				uni.showLoading({
					title: '请稍候',
					mask: true
				})
				that.request({
					url: that.config.commentGoods,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						comment: that.comment,
						productId: that.goodComment.id
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
						that.goodComment.commentShow = false
						that.commentShow = false
						that.goodComment.customerCommentList.push({
							nickname: that.userInfo.nickname,
							comment: that.comment
						})
						that.comment = ''
						that.goodComment = {}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			openCommentShow(item) {
				this.goodComment = item
				this.commentShow = true
			},
			closeCommentShow() {
				this.goodComment = {}
				this.commentShow = false
			},
			/* 弹出商品详情 */
			goToGoodsDetail(item) {
				console.log(item)
				this.productsId = item.id
				setTimeout(() => {
					this.$refs.detail.getProductsByID()
					this.detailShow = true
				}, 10)
			},
			closeDetailShow() {
				this.detailShow = false
			},
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style scoped>
	.goods-box {
		margin: 14rpx 24rpx;
	}

	.goods-box>>>.column-value {
		width: 344rpx !important;
	}

	.comment-box {
		/* position: relative;
		bottom: 54rpx;
		left: 0;
		right: 0; */
		margin-top: -54rpx;
		position: relative;
		z-index: 9999;
	}

	.comment-img {
		border-radius: 10rpx;
		overflow: hidden;
		position: relative;
	}

	.comment-img image {
		width: 344rpx;
		height: auto;
		display: block;
	}

	.comment-goods-name {
		background-color: rgba(0, 0, 0, .5);
		color: #fff;
		font-size: 30rpx;
		text-align: center;
		height: 54rpx;
		line-height: 54rpx;
	}

	.weight-cal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 20rpx;
		color: #999;
		margin: 16rpx 0 0;
	}

	.comment-func-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		min-height: 62rpx;
	}

	.comment-func image {
		width: 54rpx;
		height: 32rpx;
		display: block;
	}

	.triangle-box {
		margin-right: 6rpx;
		display: flex;
		align-items: center;
	}

	.comment-func-btn {
		display: flex;
		align-items: center;
		background-color: #333;
		color: #fff;
		border-radius: 10rpx;
		width: 240rpx;
		padding: 12rpx 0;
	}

	.comment-btn {
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.comment-btn image {
		width: 26rpx;
		height: auto;
		padding-right: 10rpx;
	}

	.zan-box {
		border-right: 1rpx solid #fff;
	}

	.triangle {
		border-style: solid;
		border-color: transparent;
		border-width: 10rpx 0 10rpx 10rpx;
		border-left-color: #333;
	}

	.like-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 28rpx;
		color: #333;
		margin: 0 0 20rpx;
	}

	.like-box image {
		width: 24rpx;
		height: auto;
		margin-right: 10rpx;
	}

	.like-name {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.goods-comment-box {
		background-color: #eee;
		border-radius: 10rpx;
		padding: 26rpx 20rpx;
	}

	.goods-comment {
		font-size: 28rpx;
		color: #666;
	}

	.comment-name {
		color: #333;
	}

	.definition-box {
		margin: 60rpx 24rpx;
	}

	.definition-input input {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.definition-btn-box {
		display: flex;
		align-items: center;
	}

	.definition-btn-box view {
		width: 50%;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #F2AB99;
		font-size: 28rpx;
		border: 2rpx solid #F2AB99;
	}

	.definition-btn-box view.confirm-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
</style>
