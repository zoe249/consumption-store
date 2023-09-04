<template>
	<view class="goods">
		<u-sticky>
			<view class="wrap">
				<u-search placeholder="请输入商品名称" v-model="productName" :showAction="false" @search="searchGoods"
					:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
					searchIconColor="#F2AB99" shape="square" @clear="searchGoods"></u-search>
			</view>
			<view class="add-goods-box">
				<view class="add-goods" @click="newProduct(item)" v-for="(item, index) in goodsClassList" :key="index">
					<view class="add-img">
						<image src="../../static/goods/addIcon.png" mode=""></image>
					</view>
					<view>{{item.className}}</view>
				</view>
			</view>
			<view class="sort-goods">
				<u-tabs :list="goodsClassList" keyName="className" lineColor="#F2AB99" activeStyle="color: #F2AB99;" :current="navIdx" @click="changeGoodsClass">
				</u-tabs>
				<view @click="goGoodsSort">商品排序</view>
			</view>
			
		</u-sticky>

		<block v-if="storeGoodsList.length != 0">
			<!-- 标准版 -->
			<block v-if="storeInfo.storeAttribute == '1'">
				<yp-waterfall :productList="storeGoodsList" :custome="false" :menu="false" @deleteGoods="deleteItem"
					:productClass="productClass" @topGoods="topGoods" v-if="sonRefresh"></yp-waterfall>
			</block>
			<!-- 个性版 -->
			<block v-if="storeInfo.storeAttribute == '2'">
				<yp-goodsList :productList="storeGoodsList" @deleteGoods="deleteItem" :productClass="productClass">
				</yp-goodsList>
			</block>
		</block>


		<!-- 空列表 -->
		<view v-else class="no-order">
			<image :src="imgUrl + 'allGoods.png'" mode="widthFix"></image>
			<view>未创建商品</view>
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
				storeInfo: {}, // 店铺信息
				pageIndex: 1,
				pageSize: 20,
				storeGoodsList: [], // 门店商品列表信息
				completed: false,
				productName: '', // 搜索关键词
				goodsClassList: [{
					name: '面包',
					value: '0101'
				}, {
					name: '饮品',
					value: '0102'
				}, {
					name: '其他',
					value: '0199'
				}],
				productClass: '',
				sonRefresh: false,
				navIdx: 0
			}
		},
		components: {
			ypGoodsList,
			ypWaterfall
		},
		onLoad(option) {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
		},
		onShow() {
			this.completed = false
			this.pageIndex = 1
			this.storeGoodsList = []
			this.getStores()
			this.getClassifyList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageIndex = 1
			this.storeGoodsList = []
			this.getClassifyList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 触底加载下一页数据
		onReachBottom() {
			let that = this
			if (!that.completed) {
				uni.showLoading({
					title: '加载中'
				})
				that.pageIndex++
				that.request({
					url: that.config.storecatalog,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeInfo.id,
						productName: that.productName,
						productClass: that.productClass
					},
				}).then(res => {
					uni.hideLoading()
					if (res.data.data.length == 0) {
						that.completed = true
					} else {
						that.storeGoodsList.push(...res.data.data)
					}
				})
			}
		},
		methods: {
			getStores() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeInfo.id}`,
				}).then(res => {
					let data = res.data.data
					that.store = data
				})
			},
			// 获取店铺商品信息
			getGoodsList() {
				let that = this
				that.pageIndex = 1
				that.storeGoodsList = []
				that.request({
					url: that.config.storecatalog,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeInfo.id,
						productName: that.productName,
						productClass: that.productClass
					},
				}).then(res => {
					if (res.data.data.length !== 0) {
						that.storeGoodsList = res.data.data
					}
					that.sonRefresh = false
					that.$nextTick(() => {
						that.sonRefresh = true
					})
				})
			},
			/* 新建分类商品 */
			newProduct(item) {
				uni.navigateTo({
					url: '../newProduct/newProduct?productClass=' + item.classCode
				})
			},
			editItem(id) {
				uni.navigateTo({
					url: '../editProduct/editProduct?id=' + id
				})
			},
			deleteItem(id) {
				let that = this
				uni.showModal({
					content: '确定要删除吗？',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.storecatalog}/${id}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
									'Transaction-No': new Date().getTime()
								},
							}).then(res => {
								if (res.data.code == '200000') {
									uni.showToast({
										title: '删除成功',
										icon: 'success',
									})
									that.pageIndex = 1
									that.storeGoodsList = []
									setTimeout(() => {
										that.getGoodsList()
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			/* 搜索商品 */
			searchGoods() {
				this.completed = false
				this.getGoodsList()
			},
			/* 切换商品分类 */
			changeGoodsClass(item) {
				console.log(item)
				this.navIdx = item.index
				this.completed = false
				this.productClass = item.classCode
				this.getGoodsList()
			},
			/* 商品置顶 */
			topGoods(item) {
				let that = this
				that.request({
					url: `${that.config.topProduct}/${item.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '操作成功',
							icon: 'none',
						})
						that.pageIndex = 1
						that.storeGoodsList = []
						setTimeout(() => {
							that.getGoodsList()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 跳转商品排序 */
			goGoodsSort() {
				uni.setStorageSync('selectGoodsList', [])
				uni.navigateTo({
					url: '../goods/sort'
				})
			},
			/* 获取商品分类顺序 */
			getClassifyList() {
				let that = this
				that.request({
					url: that.config.productClass,
					data: {
						storeId: that.storeInfo.id
					}
				}).then(res => {
					console.log(res)
					const data = res.data
					if (data.length != 0) {
						that.goodsClassList = data
						that.productClass = data[that.navIdx].classCode
						that.getGoodsList()
					}
				})
			}
		}
	}
</script>
<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.add-goods-box {
		margin: 20rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.add-goods {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		background-color: #fff;
		padding: 40rpx 0;
		border: 2rpx dashed #F2AB99;
		border-radius: 16rpx;
		line-height: 40rpx;
		width: 224rpx;
	}

	.add-img {
		width: 40rpx;
		height: 40rpx;
		padding-right: 14rpx;
	}

	.add-img image {
		width: 40rpx;
		height: 40rpx;
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
	
	.goods>>>.u-sticky__content{
		background-color: #f4f4f4;
	}
	
	.sort-goods{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #999;
		padding: 0 22rpx 20rpx 0;
	}
	
	/deep/.u-tabs .u-tabs__wrapper__nav{
		min-width: 312rpx !important;
	}
	
	
	.goods>>>.column-value{
		position: relative;
	}
</style>
