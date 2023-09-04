<template>
	<view class="daily-menu-box">
		<view v-for="(item, index) in goodsList" :key="index">
			<view class="goods-classify">
				<view>{{item.className}}</view>
				<view v-if="goodsState" @click="topClassify(item, index)">
					<u-icon name="arrow-upward" color="#999" size="22"></u-icon>
				</view>
			</view>
			<yp-sort-goods v-model="item.list" :index="index" keyName="src" :disabled="disabled" @changeSort="changeSort"
				@sortGoodsItem="sortGoodsItem" :goodsState="goodsState" v-if="sonRefresh"></yp-sort-goods>
		</view>

		<view style="height: 130rpx;"></view>
		<view class="share-btn" @click="openClassifyShow" v-if="!goodsState">合成&分享</view>
		<view class="share-btn" @click="saveGoodschange" v-else>保存</view>

		<!-- 海报分享 -->
		<qrcode-poster ref="poster" :goodsList="brandGoodsList" :otherGoodList="otherGoodList" :drinkList="drinkList"
			:canvasMenu="true" :storeInfo="storeInfo" :date="memuDate" :menuWeather="weather" @canvasState="canvasState"
			@canvasGoodsPic="canvasGoodsPic" @closeLoad="closeLoad"></qrcode-poster>

		<u-overlay :show="loadingShow">
			<view class="loading-box">
				<yp-circle-load :size="60" :percent="100" :animation="true" :animationSpeed="100"
					@animationPercent="getPercent" defaultColor="#fff">
					<span slot="content" style="color: #32CDA5;">{{percent}}%</span>
				</yp-circle-load>
				<view class="loading-tip">正在生成</view>
			</view>
		</u-overlay>

		<!-- <u-popup :show="menuShow" @close="menuShow=false" mode="center">
			<scroll-view scroll-y="true" :style="{ 'max-height': screenHeight + 'px'}">
				<image :src="menuPosterImg" mode="widthFix" class="canvas-img" @click="openSaveImg"></image>
			</scroll-view>
		</u-popup> -->

		<!-- 标准版选择分享方式 -->
		<u-popup :show="shareWayShow" @close="closeShareWayShow" mode="bottom">
			<view>
				<button class="share-way wx-share" open-type="share">生成小程序链接</button>
				<view class="share-way" @click="shareMenuPoster">生成图片</view>
				<view class="share-way cancle-share" @click="closeShareWayShow">取消</view>
			</view>
		</u-popup>

		<!-- 选择种类生成菜单 -->
		<u-popup :show="selectClassifyShow" @close="closeClassifyShow" mode="center">
			<view class="select-classify-popup">
				<view>生成图片</view>
				<view class="select-classify-tip">请选择生成菜单的商品种类</view>
				<view class="selcet-classify">
					<view v-for="(item, index) in classify" :key="index" class="classify-box"
						@click="changeSelectState(item)">
						<view class="select-goods" :class="item.select ? 'isSelect-goods' : ''">
							<block v-if="item.select">
								<image src="../../static/store/check.png" mode=""></image>
							</block>
						</view>
						<view>{{item.name}}</view>
					</view>
				</view>
				<block v-if="storeInfo.storeAttribute == '1'">
					<view @click="openSelectShareWay" class="create-clssify-btn">生成</view>
				</block>
				<block v-if="storeInfo.storeAttribute == '2'">
					<view @click="shareMenuPoster" class="create-clssify-btn">生成</view>
				</block>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ypSortGoods from '@/uni_modules/shmily-drag-image/components/shmily-drag-image/shmily-drag-image.vue'
	import qrcodePoster from '@/components/qrcode-poster/qrcode-poster.vue' // 海报
	import ypCircleLoad from '@/components/yp-circle-load/yp-circle-load.vue'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				goodsList: [],
				pageIndex: 1,
				pageSize: 10,
				completed: false,
				memuDate: '',
				storeInfo: {},
				storeId: '',
				productName: '',
				weather: '',
				loadingShow: false,
				percent: 0,
				menuShow: false,
				screenHeight: 0,
				menuPosterImg: '',
				shareWayShow: false,
				regoodsList: [],
				selectGoodsList: [],
				brandGoodsList: [],
				otherGoodList: [],
				drinkList: [],
				selectClassifyShow: false,
				classify: [{
					name: '面包',
					select: true
				}, {
					name: '饮品',
					select: true
				}, {
					name: '其他',
					select: true
				}],
				goodsState: false,
				i: 0,
				changeSortList: [], // 改变顺序的商品
				topList: [],
				sonRefresh: false,
				disabled: true
			}
		},
		components: {
			ypSortGoods
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.memuDate = options.memuDate == undefined ? '' : options.memuDate
			this.weather = options.weather == undefined ? '' : options.weather
			if (this.memuDate === '') {
				this.goodsState = true
			} else {
				this.goodsState = false
			}
			this.getClassifyList()
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					that.screenHeight = res.screenHeight
				}
			})
			this.sonRefresh = false
			this.$nextTick(() => {
				this.sonRefresh = true
			})
		},
		onReachBottom() {
			if (!this.completed && this.goodsState) {
				this.pageIndex++
				this.selectGoodsList = []
				this.getMenuGoodsList()
			}
		},
		methods: {
			changeSort(e) {
				console.log('改变商品排序', e)
				this.selectGoodsList = []
				this.goodsList[e.index].list = e.result
				this.goodsList.forEach(item => {
					item.list.forEach(value => {
						this.selectGoodsList.push(value)
					})
				})
				console.log('改变后选中商品', this.selectGoodsList)
				uni.setStorageSync('selectGoodsList', this.selectGoodsList)
				if (e.index == 0) {
					this.brandGoodsList = e.result
				} else if (e.index == 1) {
					this.drinkList = e.result
				} else if (e.index == 2) {
					this.otherGoodList = e.result
				}
			},
			sortGoodsItem(item) {
				console.log(item)
				let index = item.absY * 3 + item.absX + 1
				console.log('改变后下标', index)
				let flag = false
				this.changeSortList.forEach((value, i) => {
					if (item.id == value.id) {
						flag = true
						this.changeSortList[i] = item
					}
				})
				if (!flag) {
					this.changeSortList.push(item)
				}
				console.log('changeSortList', this.changeSortList)
			},
			/* 获取商品分类顺序 */
			getClassifyList() {
				let that = this
				this.selectGoodsList = []
				that.request({
					url: that.config.productClass,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data
					if (data.length != 0) {
						data.forEach(item => {
							item.list = []
						})
						that.goodsList = data
						if (this.goodsState) {
							// 商品库
							console.log('goodsList2222222222222', that.goodsList)
							that.getMenuGoodsList()
						} else {
							this.selectGoodsList = uni.getStorageSync('selectGoodsList')
							that.goodsList.forEach((citem, i) => {
								that.selectGoodsList.forEach(item => {
									if (item.productClass == citem.classCode) {
										// 面包
										this.goodsList[i].list.push(item)
										if (item.productClass == '0101') {
											this.brandGoodsList.push(item)
										} else if (item.productClass == '0102') {
											// 饮品
											this.drinkList.push(item)
										} else if (item.productClass == '0199') {
											// 其他
											this.otherGoodList.push(item)
										}
									}
								})
							})
						}
					}
				})
			},
			/* 获取菜单商品列表 */
			getMenuGoodsList() {
				let that = this
				that.request({
					url: that.config.storecatalog,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						storeId: that.storeId,
						productName: '',
						productClass: ''
					},
				}).then(res => {
					const data = res.data.data
					if (data.length !== 0) {
						that.goodsList.forEach((citem, i) => {
							data.forEach(item => {
								if (item.productClass == citem.classCode) {
									// 面包
									this.goodsList[i].list.push(item)
									console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa')
									if (that.pageIndex == 1) {
										if (item.productClass == '0101') {
											this.brandGoodsList.push(item)
										} else if (item.productClass == '0102') {
											// 饮品
											this.drinkList.push(item)
										} else if (item.productClass == '0199') {
											// 其他
											this.otherGoodList.push(item)
										}
									}
								}
							})
						})

						that.selectGoodsList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			getPercent(animationPercent) {
				this.percent = animationPercent;
			},
			/* 打开保存图片 */
			openSaveImg() {
				this.menuShow = false
				this.$refs.poster.saveImgShow()
			},
			openSelectShareWay() {
				this.selectClassifyShow = false
				this.shareWayShow = true
			},
			closeShareWayShow() {
				this.shareWayShow = false
			},
			/* 分享海报 */
			async sharePoster() {
				if (this.storeInfo.logo == null || this.storeInfo.logo === '') {
					uni.showToast({
						title: '缺少【店铺头像】，请完善后再生成菜单',
						icon: 'none'
					})
				} else if (this.storeInfo.weChatQRCode == null || this.storeInfo.weChatQRCode === '') {
					uni.showToast({
						title: '缺少【微信二维码】，请完善后再生成菜单',
						icon: 'none'
					})
				} else if (this.storeInfo.openingTime == null || this.storeInfo.openingTime === '') {
					uni.showToast({
						title: '缺少【营业时间】，请完善后再生成菜单',
						icon: 'none'
					})
				} else if (this.storeInfo.district == null || this.storeInfo.district === '') {
					uni.showToast({
						title: '缺少【店铺地址】，请完善后再生成菜单',
						icon: 'none'
					})
				} else {
					this.loadingShow = true
					var promise = new Promise((resolve, reject) => {
						setTimeout(() => {
							let pic = this.$refs.poster.showCanvas()
							resolve(pic)
						}, 100)
					})
					return promise
				}
			},
			async shareMenuPoster(res) {
				this.selectClassifyShow = false
				if (!this.classify[0].select) {
					this.brandGoodsList = []
				}
				if (!this.classify[1].select) {
					this.drinkList = []
				}
				if (!this.classify[2].select) {
					this.otherGoodList = []
				}
				this.shareWayShow = false
				console.log('改变后的商品列表', this.goodsList)
				let pic = await this.sharePoster()
				// if (pic != undefined) {
				// 	this.menuShow = true
				// 	this.menuPosterImg = pic
				// }
			},
			/* 菜单绘画完成 */
			canvasGoodsPic(e) {
				let that = this
				that.memuPicture = e
				var list = []
				that.goodsList.forEach(item => {
					item.list.forEach((value, i) => {
						if (!value.status) {
							list.push({
								productId: value.productId,
								productPicture: value.cardPicture,
								detailFlag: 'added',
								menuOrder: i
							})
						} else {
							list.push({
								productId: value.productId,
								productPicture: value.cardPicture,
								detailFlag: 'modified',
								menuOrder: i
							})
						}
					})
				})
				// 菜单排序
				that.selectGoodsList.forEach((item, i) => {
					list.forEach(value => {
						if (item.productId == value.productId) {
							value.menuOrder = i + 1
						}
					})
				})
				console.log('list', list)
				this.editMenu(list)
				let title = '2123'
				return title
			},
			editMenu(list) {
				let that = this
				let title
				that.request({
					url: that.config.menuGoodsList,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						weather: that.weather,
						memuDate: that.memuDate,
						memuPicture: that.memuPicture,
						list: list
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 200000) {
						that.loadingShow = false
						uni.showToast({
							title: '生成成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.goodsList = []
							that.brandGoodsList = []
							that.otherGoodList = []
							that.drinkList = []
							that.pageIndex = 1
							that.completed = false
							that.getClassifyList()
						}, 2000)
						title = ' 生成成功后的'
						return title
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			openClassifyShow() {
				let brandGoodsList = []
				let drinkList = []
				let otherGoodList = []
				this.selectGoodsList.forEach(sitem => {
					if (sitem.select) {
						// 选中商品
						if (sitem.productClass == '0101') {
							// 面包分类商品
							brandGoodsList.push(sitem)
						} else if (sitem.productClass == '0102') {
							// 饮品商品
							drinkList.push(sitem)
						} else if (sitem.productClass == '0199') {
							// 其他分类商品
							otherGoodList.push(sitem)
						}
					}
				})
				if (brandGoodsList.length == 0) {
					this.classify[0].select = false
				} else {
					this.classify[0].select = true
				}
				if (drinkList.length == 0) {
					this.classify[1].select = false
				} else {
					this.classify[1].select = true
				}
				if (otherGoodList.length == 0) {
					this.classify[2].select = false
				} else {
					this.classify[2].select = true
				}
				this.selectClassifyShow = true
				for (var i = 0; i < this.changeSortList.length; i++) {
					let index = this.changeSortList[i].absY * 3 + this.changeSortList[i].absX + 1
					this.saveGoodsSort(this.changeSortList[i].id, index)
				}
			},
			closeClassifyShow() {
				this.selectClassifyShow = false
			},
			changeSelectState(item) {
				item.select = !item.select
			},
			async saveGoodschange() {
				// 修改商品顺序
				for (var i = 0; i < this.changeSortList.length; i++) {
					let index = this.changeSortList[i].absY * 3 + this.changeSortList[i].absX + 1
					var a = await this.saveGoodsSort(this.changeSortList[i].id, index)
				}
				if (this.topList.length != 0) {
					// 分类置顶
					for (var i = 0; i < this.topList.length; i++) {
						for (var j = 0; j < this.topList[i].length; j++) {
							var b = await this.editClassifyTop(this.topList[i][j])
						}
					}
					// 修改分类排序
					var c = await this.editClassify()
				}
				uni.showToast({
					title: '保存成功',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 2000)
			},
			/* 保存商品排序 */
			async saveGoodsSort(id, index) {
				let that = this
				that.request({
					url: `${that.config.productOrder}/${id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						productOrder: index
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 200000) {

					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			/* 置顶分类 */
			async topClassify(item, index) {
				console.log('置顶', item)
				this.goodsList.splice(index, 1)
				this.goodsList.unshift(item)
				console.log('goodsList', this.goodsList)
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
				let idArr = []
				item.list.forEach(value => {
					idArr.push((value.id).toString())
				})

				let flag = false
				for (let i = 0; i < idArr.length; i++) {
					if (this.topList.filter(e => e.toString() == idArr.toString()).length != 0) {
						flag = true
						this.topList[i] = idArr
					}
				}
				if (!flag) {
					this.topList.push(idArr)
				}
				console.log('topList', this.topList)
				console.log('idArr', idArr)
			},
			async editClassifyTop(id) {
				let that = this
				that.request({
					url: `${that.config.topProduct}/${id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log(res)
					if (res.data.code != 200000) {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			/* 修改商品分类顺序 */
			editClassify() {
				console.log('修改后的顺序', this.goodsList)
				let classifyArr = []
				this.goodsList.forEach((item, i) => {
					classifyArr.push({
						classCode: item.classCode,
						menuOrder: i + 1
					})
				})
				console.log('classifyArr', classifyArr)
				let that = this
				that.request({
					url: `${that.config.productClass}/${that.storeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: classifyArr
				}).then(res => {
					console.log(res)
					if (res.data.code != 200000) {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			closeLoad() {
				this.loadingShow = false
			}
		}
	}
</script>

<style scoped>
	.goods-classify {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx;
		background-color: #fff;
		margin: 20rpx 0;
	}

	.share-btn {
		position: fixed;
		bottom: 20rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		z-index: 9999;
	}

	.share-way {
		background-color: transparent;
		font-size: 28rpx;
		color: #333;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.wx-share {
		border-bottom: 1rpx solid #f4f4f4;
	}

	.share-way::after {
		border: unset;
	}

	.cancle-share {
		border-top: 10rpx solid #f4f4f4;
	}

	.selcet-classify {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.classify-box {
		display: flex;
		align-items: center;
		margin: 0 50rpx;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		text-align: center;
		margin-right: 14rpx;
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

	.daily-menu-box>>>.qrcode-poster {
		position: fixed;
		left: 100%;
	}

	.select-classify-popup {
		padding: 30rpx 0;
		text-align: center;
		font-size: 28rpx;
		color: #333;
	}

	.select-classify-tip {
		color: #999;
		padding: 20rpx 0;
	}

	.create-clssify-btn {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin: 40rpx 40rpx 0;
	}

	.loading-box {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		color: #fff;
		font-size: 28rpx;
	}

	.loading-tip {
		margin-top: 10rpx;
	}
</style>