<template>
	<view>
		<u-sticky>
			<!-- <view class="search-box">
				<view class="wrap">
					<u-search placeholder="请输入商品名称" v-model="productName" :showAction="false" @search="searchGoods"
						:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
						searchIconColor="#F2AB99" shape="square" @clear="searchGoods"></u-search>
				</view>
				<view class="collect-box">
					<block v-if="collectValue == 'love'">
						<image src="../../../static/goods/collectIcon.png" mode="widthFix" @click="changeCollectGoods">
						</image>
					</block>
					<block v-else>
						<image src="../../../static/goods/noCollectIcon.png" mode="widthFix"
							@click="changeCollectGoods">
						</image>
					</block>
					<view>我的收藏</view>
				</view>
			</view> -->
			<view class="hot-img-box">
				<view @click="goBack" class="back-icon" :style="{ 'top': statusBarHeight + 13 + 'px'}">
					<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
				</view>
				<image :src="imgUrl + 'hotBg.png'" class="hot-img"></image>
				<view @click="changeCollectGoods" class="collect-img">
					<block v-if="collectValue == 'love'">
						<image :src="imgUrl + 'hotCollect.png'">
						</image>
					</block>
					<block v-else>
						<image :src="imgUrl + 'hotCollected.png'">
						</image>
					</block>
				</view>
			</view>
		</u-sticky>

		<block v-if="storeGoodsList.length != 0">
			<!-- 标准版 -->
			<block v-if="storeInfo.storeAttribute == '1'">
				<view v-for="(item, index) in storeGoodsList" :key="index" class="goods-box">
					<view class="goods-img-box">
						<image :src="item.picture" class="goods-img" mode="widthFix"></image>
						<block v-if="index == 0">
							<image :src="imgUrl + 'NO.1.png'" mode="widthFix" class="goods-top"></image>
						</block>
						<block v-if="index == 1">
							<image :src="imgUrl + 'NO.2.png'" mode="widthFix" class="goods-top"></image>
						</block>
						<block v-if="index == 2">
							<image :src="imgUrl + 'NO.3.png'" mode="widthFix" class="goods-top"></image>
						</block>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{item.name}}</view>
						<view class="goods-ename">{{item.ename}}</view>
						<view class="price goods-price"><text>￥</text>{{item.marketPrice}}</view>
						<view class="goods-element" v-if="item.element !== ''">{{item.element}}</view>
						<view class="goods-element" v-if="item.featureDescribe !== ''">{{item.featureDescribe}}</view>
						<view class="bake-time"
							:class="[item.bakedEndName == '下午' ? 'afternoon' : '', item.bakedEndName == '全天' ? 'allday' : '']"
							v-if="item.bakedEndName !== '' && item.bakedEndName !== null">
							{{item.bakedEndName}}出炉
						</view>
						<view class="bake-time-box">
							<view class="goods-time">
								<block v-if="item.bakeType !== ''">
									<image src="../../../static/goods/timeIcon.png" mode="widthFix"></image>
									<block v-if="item.bakeType == '1'">
										<view v-if="item.bakeTime < 1">{{Math.round(item.bakeTime * 60)}}分钟</view>
										<view v-else>{{item.bakeTime}}小时</view>
									</block>
									<block v-if="item.bakeType == '2'">
										<view>{{item.bakeTimeEnd}}出炉</view>
									</block>
								</block>
							</view>
							<view class="goods-time" @click.stop="collectGoods(item)">
								<block v-if="item.collection">
									<image src="../../../static/goods/collectIcon.png" mode="widthFix"></image>
								</block>
								<block v-else>
									<image src="../../../static/goods/noCollectIcon.png" mode="widthFix"></image>
								</block>
								<view>{{item.collectionCount}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="more-goods">
					<u-loadmore :status="status" />
				</view>
			</block>
			<!-- 个性版 -->
			<block v-if="storeInfo.storeAttribute == '2'">
				<yp-goodsList :productList="storeGoodsList" :custome="true" @goToGoodsDetail="goToGoodsDetail"
					@collectGoods="collectGoods">
				</yp-goodsList>
			</block>
		</block>

		<!-- 空列表 -->
		<view v-else class="no-order">
			<image :src="imgUrl + 'allGoods.png'" mode="widthFix"></image>
			<view>商家未上架商品</view>
		</view>
	</view>
</template>

<script>
	import ypGoodsList from '@/components/yp-goodsList/yp-goodsList.vue'
	import ypWaterfall from '@/components/yp-waterfall/yp-waterfall.vue'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				pageIndex: 1,
				pageSize: 20,
				storeId: '', // 门店id
				storeGoodsList: [], // 门店商品列表信息
				collectValue: 'loveTop',
				completed: false, // 是否加载完成
				productName: '', // 搜索关键词
				goodsClassList: [{
					name: '面包',
					value: 1
				}, {
					name: '其他',
					value: 0
				}],
				productClass: '',
				storeInfo: {},
				completed: false,
				sonRefresh: false,
				status: 'loadmore',
				loginState: false,
				backState: false,
				statusBarHeight: 0
			}
		},
		components: {
			ypGoodsList,
			ypWaterfall
		},
		onLoad(options) {
			uni.hideShareMenu()
			console.log(options)
			this.storeId = options.storeId
			this.productClass = this.goodsClassList[0].value
			this.storeInfo = uni.getStorageSync('storeInfo')
			let token = uni.getStorageSync('token')
			console.log('token', token)
			if (token == '') {
				// 未登录
				this.loginState = false
			} else {
				this.loginState = true
			}
			this.backState = options.backState
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
				}
			})
		},
		onShow() {
			this.pageIndex = 1
			this.completed = false
			this.storeGoodsList = []
			this.getStoreInfo()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageIndex = 1
			this.storeGoodsList = []
			this.getStoreInfo()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		/* 上拉加载 */
		onReachBottom() {
			let that = this
			that.pageIndex++
			if (!that.completed) {
				that.status = 'loading'
				that.request({
					url: that.config.storecatalog,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId,
						collection: that.collectValue,
						productName: that.productName,
						productClass: ''
					}
				}).then(res => {
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
						that.status = 'nomore'
					} else {
						that.storeGoodsList.push(...data)
					}
				})
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			// 获取店铺商品信息
			getStoreInfo() {
				let that = this
				that.pageIndex = 1
				that.completed = false
				that.storeGoodsList = []
				that.request({
					url: that.config.storecatalog,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId,
						collection: that.collectValue,
						productName: that.productName,
						productClass: ''
					}
				}).then(res => {
					console.log('人气榜', res)
					const data = res.data.data
					that.storeGoodsList = data
					this.sonRefresh = false
					this.$nextTick(() => {
						this.sonRefresh = true
					})
				})
			},
			// 跳转商品详情
			goToGoodsDetail(id) {
				uni.navigateTo({
					url: '../detail/detail?id=' + id
				})
			},
			/* 打开关闭我的喜爱 */
			changeCollectGoods() {
				if (this.loginState) {
					if (this.collectValue == 'loveTop') {
						// 人气榜
						this.collectValue = 'love'
					} else {
						this.collectValue = 'loveTop'
					}
					this.getStoreInfo()
				} else {
					uni.navigateTo({
						url: '/pages/startUp/login/login?backState=' + this.backState
					})
				}
			},
			/* 搜索商品 */
			searchGoods() {
				this.completed = false
				this.getStoreInfo()
			},
			/* 切换商品分类 */
			changeGoodsClass(item) {
				console.log(item)
				this.productClass = item.value
				this.getStoreInfo()
			},
			/* 点赞收藏/取消点赞 */
			collectGoods(item) {
				if (this.loginState) {
					let that = this
					let title
					console.log(item.collection)
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
				} else {
					uni.navigateTo({
						url: '/pages/startUp/login/login?backState=' + this.backState
					})
				}
			}
		}
	}
</script>

<style scoped>
	/* .search-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.wrap>>>.u-search__content {
		width: 500rpx;
	}

	.collect-box {
		color: #333;
		font-size: 28rpx;
		width: 120rpx;
		text-align: center;
	}

	.collect-box image {
		width: 60rpx;
		height: auto;
	}

	.nav-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;
	} */

	/* .collect-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin: 20rpx 24rpx;
	}
	
	.collect-tip{
		font-size: 28rpx;
		color: #333;
		margin-right: 20rpx;
	}

	.collect-box>>>.u-switch {
		background-color: #fff !important;
		border: 4rpx solid #ccc !important;
		width: 72rpx !important;
		height: 46rpx !important;
	}

	.collect-box>>>.u-switch__bg {
		background-color: #fff !important;
	}

	.collect-box>>>.u-switch__node {
		background-color: #ccc;
		width: 30rpx !important;
		height: 30rpx !important;
		transform: translateX(-30rpx) !important;
		box-shadow: unset !important;
	}

	.collect-box>>>.u-switch__node.u-switch__node--on {
		background-color: #F2AB99;
		transform: translateX(-8rpx) !important;
	} */

	.hot-img-box {
		margin-bottom: 50rpx;
		position: relative;
	}

	.back-icon {
		position: absolute;
		left: 24rpx;
	}

	.hot-img {
		width: 100%;
		height: 354rpx;
		display: block;
	}

	.collect-img {
		position: absolute;
		right: 24rpx;
		bottom: -36rpx;
		background-color: #fff;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.collect-img image {
		width: 54rpx;
		height: 48rpx;
	}

	.no-order {
		color: #333;
		font-size: 28rpx;
		margin: 260rpx auto;
		text-align: center;
	}

	.no-order image {
		width: 94rpx;
		height: auto;
		margin-bottom: 20rpx;
	}

	.goods-box {
		background-color: #fff;
		margin: 20rpx 0;
		display: flex;
		align-items: center;
	}

	.goods-img-box {
		width: 50%;
		position: relative;
	}

	.goods-img {
		width: 100%;
		height: auto;
		display: block;
	}

	.goods-top {
		width: 70rpx;
		height: auto;
		position: absolute;
		top: 8rpx;
		left: 8rpx;
	}

	.goods-info {
		text-align: center;
		color: #999;
		font-size: 24rpx;
		width: 49%;
		padding: 20rpx;
	}

	.goods-name {
		font-size: 30rpx;
		color: #333;
		padding-bottom: 18rpx;
		font-weight: 600;
	}

	.goods-ename {
		padding-bottom: 20rpx;
	}

	.goods-price {
		font-size: 30rpx;
		padding-bottom: 26rpx;
	}

	.goods-price text {
		font-size: 22rpx;
	}

	.goods-element {
		padding-bottom: 26rpx;
		font-size: 20rpx;
	}

	.bake-time-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bake-time {
		color: #fff;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 20rpx;
		background-color: #F2AB99;
		width: 100rpx;
		border-radius: 50rpx;
		text-align: center;
		margin: 0 auto 20rpx;
		display: block;
	}

	.bake-time.afternoon {
		background-color: #7CD1F8;
	}

	.bake-time.allday {
		background-image: linear-gradient(to right, #7CD1F8, #C892FF, #F2AB99);
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

	.more-goods {
		padding: 2rpx 0 20rpx;
	}
</style>
