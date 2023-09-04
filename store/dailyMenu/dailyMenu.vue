<template>
	<view class="daily-menu-box">
		<u-sticky>
			<yp-nav title="每日菜单"></yp-nav>
			<view class="wrap">
				<u-search placeholder="请输入商品名称" v-model="productName" :showAction="false" @search="searchGoods"
					:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
					searchIconColor="#F2AB99" shape="square" @clear="searchGoods"></u-search>
			</view>
		</u-sticky>
		<view class="time-weather">
			<view class="time-nav">
				<view v-for="(item, index) in list" :key="index" class="time-select"
					:class="timeIdx == index ? index == 0 ? 'today-active' : index == 1 ? 'tommorrow-active' : '' : ''"
					@click="changeDate(index)">
					{{item}}
				</view>
			</view>
			<view class="weather-img">
				<block v-if="weather == '晴'">
					<image src="../../static/store/sunny.png" mode="widthFix"></image>
				</block>
				<block v-if="weather == '阴'">
					<image src="../../static/store/cloudy.png" mode="widthFix"></image>
				</block>
				<block v-if="weather == '雨'">
					<image src="../../static/store/rain.png" mode="widthFix"></image>
				</block>
				<block v-if="weather == '雪'">
					<image src="../../static/store/snow.png" mode="widthFix"></image>
				</block>
			</view>
			<yp-dropdown :filterData='weatherList' ref="dropdown" :defaultIndex='weatherIdx'
				@onSelected='selectWeather'>
			</yp-dropdown>
		</view>
		<view class="select-goods-cont">
			<block v-for="(item, index) in regoodsList" :key="index">
				<view v-if="item.status && timeIdx == 0" class="goods-box">
					<view class="goods-info">
						<view class="goods-img">
							<image :src="item.picture"></image>
						</view>
						<view class="goods-name-box">
							<view class="goods-name">{{item.name}}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="">
			<block v-for="(item, index) in goodsList" :key="index">
				<block v-if="item.list.length != 0">
					<view class="select-classify-box">
						<view>{{item.className}}</view>
						<view class="select-classify" @click="selectClassify(item, index)">
							<view class="select-classify-icon" :class="item.select ? 'isselect-classify-icon' : ''">
								<block v-if="item.select">
									<image src="../../static/store/check.png" mode=""></image>
								</block>
							</view>
							<view>全选</view>
						</view>
					</view>
					<view class="goods-cont">
						<block v-for="(goods, idx) in item.list" :key="idx">
							<view v-if="!goods.status || timeIdx == 1" class="goods-box"
								:class="goods.select ? 'selected-menu' : ''" @click="selectGoods(goods, item)">
								<view class="goods-info">
									<view class="goods-img">
										<image :src="goods.picture"></image>
									</view>
									<view class="goods-name-box">
										<view class="goods-name">{{goods.name}}</view>
									</view>
								</view>
								<view class="select-goods" :class="goods.select ? 'isSelect-goods' : ''">
									<block v-if="goods.select">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
							</view>
						</block>
					</view>
				</block>
			</block>
		</view>
		<view style="height: 130rpx;"></view>
		<!-- 标准版 -->
		<view class="btn-box">
			<view @click="goGoodsSort">商品排序</view>
			<view class="share-btn" @click="openClassifyShow">合成&分享</view>
		</view>

		<!-- 海报分享 -->
		<view @touchmove.stop.prevent="stopRoll">
			<qrcode-poster ref="poster" :goodsList="brandGoodsList" :otherGoodList="otherGoodList"
				:drinkList="drinkList" :canvasMenu="true" :storeInfo="storeInfo" :date="date" :menuWeather="weather"
				@canvasState="canvasState" @canvasGoodsPic="canvasGoodsPic" @closeLoad="closeLoad"></qrcode-poster>
		</view>

		<u-overlay :show="loadingShow">
			<view class="loading-box">
				<yp-circle-load :size="60" :percent="100" :animation="true" :animationSpeed="100"
					@animationPercent="getPercent" defaultColor="#fff" v-if="loadRefresh">
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
						<view class="classify-select-goods" :class="item.select ? 'classify-isSelect-goods' : ''">
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
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	import ypDropdown from '@/components/yp-dropdown/yp-dropdown.vue'
	import qrcodePoster from '@/components/qrcode-poster/qrcode-poster.vue' // 海报
	import ypCircleLoad from '@/components/yp-circle-load/yp-circle-load.vue'
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		components: {
			ypNav,
			ypDropdown,
			qrcodePoster,
			ypCircleLoad
		},
		data() {
			return {
				timeIdx: 0,
				list: ['今天', '明天'],
				current: 0,
				menuWeather: '', // 已选择的菜单天气
				weather: '晴',
				weatherList: [
					[{
						text: '晴',
						value: ''
					}, {
						text: '阴',
						value: 1
					}, {
						text: '雨',
						value: 2
					}, {
						text: '雪',
						value: 3
					}],
				],
				weatherIdx: [0],
				value: false,
				goodsList: [],
				regoodsList: [], // 备用菜单列表，用于比较
				pageIndex: 1,
				pageSize: 20,
				memuDate: '', // 日期
				date: '', // 年月日格式日期
				productName: '', // 搜索商品名称
				completed: false, // 已加载完毕
				selectGoodsList: [],
				isTodayMenu: true, // 是否是今天菜单
				memuPicture: '', // 菜单合成图
				storeInfo: {},
				percent: 0,
				loadingShow: false,
				menuPosterImg: '',
				screenHeight: 0,
				menuShow: false,
				shareBtn: false,
				shareWayShow: false,
				reserveGoods: false, // 是否从明日预定跳转
				selectClassifyShow: false,
				classify: [{
					name: '面包',
					class: '0101',
					select: true
				}, {
					name: '饮品',
					class: '0102',
					select: true
				}, {
					name: '其他',
					class: '0199',
					select: true
				}],
				brandGoodsList: [],
				drinkList: [],
				otherGoodList: [],
				qiniuToken: '',
				storeQrcode: '',
				storeId: '',
				storeQrcodePath: '',
				loadRefresh: false,
				oldGoodsList: []
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.reserveGoods = options.reserveGoods == undefined ? false : true
			if (this.reserveGoods) {
				// 明日预定
				this.timeIdx = 1
				var day = new Date()
				day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
				var tomorrow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
				var tomorrow1 = (day.getMonth() + 1) + '月' + day.getDate() + '日'
				this.memuDate = tomorrow
				this.date = tomorrow1
			} else {
				this.timeIdx = 0
				// 获取当前日期时间
				var myDate = new Date();
				this.memuDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
				this.date = (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日'
			}
			this.getStoreInfo() // 获取店铺信息
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					that.screenHeight = res.screenHeight
				}
			})
			this.loadRefresh = false
			this.$nextTick(() => {
				this.loadRefresh = true
			})
			// this.getQiniuToken()
		},
		onShow() {
			this.goodsList = []
			this.brandGoodsList = []
			this.drinkList = []
			this.otherGoodList = []
			this.getClassifyList() // 获取菜单分类顺序
		},
		watch: {
			brandGoodsList() {
				console.log('面包分类', this.brandGoodsList)
				if (this.brandGoodsList.length == 0 && this.otherGoodList.length == 0 && this.drinkList.length == 0) {
					this.shareBtn = false
				}
				this.verifyStoreAttr()
			},
			otherGoodList() {
				if (this.brandGoodsList.length == 0 && this.otherGoodList.length == 0 && this.drinkList.length == 0) {
					this.shareBtn = false
				}
				this.verifyStoreAttr()
			},
			drinkList() {
				if (this.brandGoodsList.length == 0 && this.otherGoodList.length == 0 && this.drinkList.length == 0) {
					this.shareBtn = false
				}
				this.verifyStoreAttr()
			}
		},
		onReachBottom() {
			let that = this
			that.pageIndex++
			if (!that.completed) {
				that.request({
					url: that.config.menuGoodsList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						memuDate: that.memuDate, // 日期
						storeId: that.storeId,
						productName: that.productName
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.pageDate.data.length == 0) {
						that.completed = true
					} else {
						that.goodsList.forEach((citem, i) => {
							data.pageDate.data.forEach(item => {
								item.select = false
								if (item.status) {
									item.select = true
								}
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
						that.regoodsList = JSON.parse(JSON.stringify(data.pageDate
							.data)) // 深拷贝，goodsList改变，regoodsList不改变
						that.oldGoodsList = data.pageDate.data
						// that.goodsList.forEach(item => {
						// 	item.list.forEach(value => {
						// 		if (value.select) {
						// 			that.selectGoodsList.push(value)
						// 		}
						// 	})
						// })
						console.log('明日预定商品', orderGoodsList)
						data.pageDate.data.forEach(item => {
							if (item.status) {
								item.select = true
								that.selectGoodsList.push(item)
							}
						})
						if (that.selectGoodsList.length == 0) {
							that.shareBtn = false
							if (that.timeIdx == 0) {
								// 今日菜单
								data.pageDate.data.forEach(item => {
									item.disabled = false
									item.select = false
									if (item.status) {
										item.disabled = true
										item.select = true
									}
								})
							} else {
								// 明日菜单
								data.pageDate.data.forEach(item => {
									item.select = false
									if (orderGoodsList.length != 0) {
										orderGoodsList.forEach(value => {
											if (value.productId == item.productId) {
												item.select = true
											}
										})
									}
								})
							}
							if (data.weather !== null) {
								that.weather = data.weather
								if (data.weather == '晴') {
									that.weatherIdx = [0]
								} else if (data.weather == '阴') {
									that.weatherIdx = [1]
								} else if (data.weather == '雨') {
									that.weatherIdx = [2]
								} else if (data.weather == '雪') {
									that.weatherIdx = [3]
								}
							} else {
								that.weather = '晴'
								that.weatherIdx = [0]
							}
						} else {
							if (that.timeIdx == 1) {
								// 明日菜单
								that.goodsList.forEach((item, i) => {
									that.goodsList[i].select = true
									that.goodsList[i].list.forEach(value => {
										if (!value.select) {
											// 有未选中的
											that.goodsList[i].select = false
										}
									})
								})
							}

							// that.selectGoodsList.forEach(item => {
							// 	data.pageDate.data.forEach(value => {
							// 		item.select = false
							// 		if (item.productId == value.productId) {
							// 			value.status = true
							// 			value.select = true
							// 			item.select = true
							// 		}
							// 	})
							// })
							that.shareBtn = true
							// that.goodsList = data.pageDate.data
						}
						// that.goodsList.push(...data.pageDate.data)
					}
				})
			}
		},
		async onShareAppMessage(res) {
			this.shareWayShow = false
			let pic = await this.sharePoster()
			let title
			let path
			if (this.timeIdx == 0) {
				// 今日菜单
				title = ':今日菜单'
				path = '/custom/fresh/fresh?receivingWay=1&'
			} else {
				// 明日菜单
				title = ':明日菜单'
				path = '/custom/dailyMenu/dailyMenu?'
			}
			return {
				title: this.storeInfo.name + title,
				imageUrl: this.memuPicture,
				path: path + 'storeId=' + this.storeId + '&shareState=true'
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getClassifyList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			stopRoll() {

			},
			/* 获取商品分类顺序 */
			getClassifyList() {
				let that = this
				that.goodsList = []
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
						that.getMenuGoodsList()
					}
				})
			},
			/* 获取菜单商品列表 */
			getMenuGoodsList() {
				let that = this
				let orderGoodsList = uni.getStorageSync('orderGoodsList')
				that.selectGoodsList = []
				that.request({
					url: that.config.menuGoodsList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						memuDate: that.memuDate, // 日期
						storeId: that.storeId,
						productName: that.productName
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.goodsList.forEach((citem, i) => {
						data.pageDate.data.forEach(item => {
							item.select = false
							if (item.status) {
								item.select = true
							}
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
							// if (item.productClass == '0101') {
							// 	// 面包
							// 	that.goodsList[0].list.push(item)
							// 	if (item.select) {
							// 		that.brandGoodsList.push(item)
							// 	}
							// } else if (item.productClass == '0102') {
							// 	// 饮品
							// 	that.goodsList[1].list.push(item)
							// 	if (item.select) {
							// 		that.drinkList.push(item)
							// 	}
							// } else if (item.productClass == '0199') {
							// 	// 其他
							// 	that.goodsList[2].list.push(item)
							// 	if (item.select) {
							// 		that.otherGoodList.push(item)
							// 	}
							// }
						})
					})
					that.regoodsList = JSON.parse(JSON.stringify(data.pageDate
						.data)) // 深拷贝，goodsList改变，regoodsList不改变
					that.oldGoodsList = data.pageDate.data
					// that.goodsList.forEach(item => {
					// 	item.list.forEach(value => {
					// 		if (value.select) {
					// 			that.selectGoodsList.push(value)
					// 		}
					// 	})
					// })
					console.log('明日预定商品', orderGoodsList)
					data.pageDate.data.forEach(item => {
						if (item.status) {
							item.select = true
							that.selectGoodsList.push(item)
						}
					})
					if (that.selectGoodsList.length == 0) {
						that.shareBtn = false
						if (that.timeIdx == 0) {
							// 今日菜单
							data.pageDate.data.forEach(item => {
								item.disabled = false
								item.select = false
								if (item.status) {
									item.disabled = true
									item.select = true
								}
							})
						} else {
							// 明日菜单
							data.pageDate.data.forEach(item => {
								item.select = false
								if (orderGoodsList.length != 0) {
									orderGoodsList.forEach(value => {
										if (value.productId == item.productId) {
											item.select = true
										}
									})
								}
							})
						}
						if (data.weather !== null) {
							that.weather = data.weather
							if (data.weather == '晴') {
								that.weatherIdx = [0]
							} else if (data.weather == '阴') {
								that.weatherIdx = [1]
							} else if (data.weather == '雨') {
								that.weatherIdx = [2]
							} else if (data.weather == '雪') {
								that.weatherIdx = [3]
							}
						} else {
							that.weather = '晴'
							that.weatherIdx = [0]
						}
						// that.goodsList = data.pageDate.data
					} else {
						if (that.timeIdx == 1) {
							// 明日菜单
							that.goodsList.forEach((item, i) => {
								that.goodsList[i].select = true
								that.goodsList[i].list.forEach(value => {
									if (!value.select) {
										// 有未选中的
										that.goodsList[i].select = false
									}
								})
							})
						}

						// that.selectGoodsList.forEach(item => {
						// 	data.pageDate.data.forEach(value => {
						// 		item.select = false
						// 		if (item.productId == value.productId) {
						// 			value.status = true
						// 			value.select = true
						// 			item.select = true
						// 		}
						// 	})
						// })
						that.shareBtn = true
						// that.goodsList = data.pageDate.data
					}
				})
			},
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					console.log('店铺', res)
					that.storeInfo = res.data.data
					that.verifyStoreAttr()
				})
			},
			/* 搜索商品 */
			searchGoods() {
				this.completed = false
				this.selectGoodsList = []
				this.goodsList.forEach(item => {
					item.list.forEach(value => {
						if (value.select) {
							this.selectGoodsList.push(item)
						}
					})
				})
				console.log('选中商品', this.selectGoodsList)
				this.getClassifyList()
			},
			/* 选择天气 */
			selectWeather(res) {
				this.weather = res[0][0].text
			},
			/* 切换日期 */
			changeDate(index) {
				this.timeIdx = index
				this.goodsList = []
				this.brandGoodsList = []
				this.otherGoodList = []
				this.drinkList = []
				this.selectGoodsList = []
				this.pageIndex = 1
				this.completed = false
				this.$refs.dropdown.tapMask()
				this.shareBtn = false
				if (index == 1) {
					// 明天
					var day = new Date()
					day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
					var tomorrow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
					var tomorrow1 = (day.getMonth() + 1) + '月' + day.getDate() + '日'
					this.memuDate = tomorrow
					this.date = tomorrow1
				} else if (index == 0) {
					// 今天
					var myDate = new Date()
					this.memuDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
					this.date = (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日'
				}
				this.getClassifyList()
			},
			verifyStoreAttr() {
				if (this.storeInfo.smallCode == null || this.storeInfo.smallCode === '') {
					console.log('000000000')
					this.shareBtn = false
				} else if (this.storeInfo.logo == null || this.storeInfo.logo === '') {
					console.log('111111111')
					this.shareBtn = false
				} else if (this.storeInfo.weChatQRCode == null || this.storeInfo.weChatQRCode === '') {
					console.log('222222222222')
					this.shareBtn = false
				} else if (this.storeInfo.openingTime == null || this.storeInfo.openingTime === '') {
					console.log('3333333333')
					this.shareBtn = false
				} else if (this.storeInfo.district == null || this.storeInfo.district === '') {
					console.log('444444444444')
					this.shareBtn = false
				} else if (this.brandGoodsList.length == 0 && this.otherGoodList.length == 0 && this.drinkList.length ==
					0) {
					console.log('555555555')
					this.shareBtn = false
				} else {
					console.log('66666666666666')
					this.shareBtn = true
				}
			},
			verifyGoodsState() {
				if (this.brandGoodsList.length == 0 && this.otherGoodList.length == 0 && this.drinkList.length == 0) {
					uni.showToast({
						title: '请先选择商品',
						icon: 'none'
					})
				} else if (this.storeInfo.smallCode == null || this.storeInfo.smallCode === '') {
					uni.showToast({
						title: '缺少【小程序码】，请完善后再生成菜单',
						icon: 'none'
					})
				} else if (this.storeInfo.logo == null || this.storeInfo.logo === '') {
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
				}
			},
			/* 分享海报 */
			async sharePoster() {
				if (this.brandGoodsList.length == 0 && this.otherGoodList.length == 0 && this.drinkList.length == 0) {
					uni.showToast({
						title: '请先选择商品',
						icon: 'none'
					})
				} else if (this.storeInfo.smallCode == null || this.storeInfo.smallCode === '') {
					uni.showToast({
						title: '缺少【小程序码】，请完善后再生成菜单',
						icon: 'none'
					})
				} else if (this.storeInfo.logo == null || this.storeInfo.logo === '') {
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
				this.shareWayShow = false
				this.selectClassifyShow = false
				console.log('商品列表', this.goodsList)
				console.log('面包列表', this.brandGoodsList)
				console.log('饮品列表', this.drinkList)
				this.selectGoodsList = []
				this.goodsList.forEach(item => {
					item.list.forEach(value => {
						if (value.select) {
							this.selectGoodsList.push(value)
						}
					})
				})
				// this.selectGoodsList = (this.brandGoodsList.concat(...this.otherGoodList)).concat(...this.drinkList)
				console.log('选中商品', this.selectGoodsList)
				let pic = await this.sharePoster()
				// if (pic != undefined) {
				// 	this.menuShow = true
				// 	this.menuPosterImg = pic
				// }
			},
			/* 打开保存图片 */
			openSaveImg() {
				this.menuShow = false
				this.$refs.poster.saveImgShow()
			},
			/* 菜单绘画完成 */
			canvasGoodsPic(e) {
				let that = this
				that.memuPicture = e
				var list = []
				that.oldGoodsList.forEach((item, i) => {
					if (that.timeIdx == 0) {
						// 今日菜单
						console.log('regoodsList', that.regoodsList)
						if (that.oldGoodsList[i].select !== that.regoodsList[i].select) {
							console.log(that.oldGoodsList[i])
							// 开关状态改变
							if (that.oldGoodsList[i].select && !that.regoodsList[i].status) {
								// 增加该菜单
								list.push({
									productId: that.oldGoodsList[i].productId,
									productPicture: that.oldGoodsList[i].cardPicture,
									detailFlag: 'added',
									menuOrder: i + 1
								})
							} else if (that.oldGoodsList[i].status) {
								// 已加入的菜单
								list.push({
									productId: that.oldGoodsList[i].productId,
									productPicture: that.oldGoodsList[i].cardPicture,
									detailFlag: 'modified',
									menuOrder: i + 1
								})
							}
						}
					} else {
						if (that.oldGoodsList[i].select !== that.regoodsList[i].select) {
							// 开关状态改变
							if (that.oldGoodsList[i].select) {
								// 增加该菜单
								list.push({
									productId: that.oldGoodsList[i].productId,
									productPicture: that.oldGoodsList[i].cardPicture,
									detailFlag: 'added',
									menuOrder: i + 1
								})
							} else {
								// 删除该菜单
								list.push({
									productId: that.oldGoodsList[i].productId,
									productPicture: that.oldGoodsList[i].cardPicture,
									detailFlag: 'deleted',
									menuOrder: i + 1
								})
							}
						}
					}
				})
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
							that.drinkList = []
							that.otherGoodList = []
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
			/* 选择商品 */
			selectGoods(goods, item) {
				goods.select = !goods.select
				// if (goods.select) {
				// 	this.selectGoodsList.push(goods)
				// } else {
				// 	this.selectGoodsList.forEach((value, i) => {
				// 		if (goods.productId == value.productId) {
				// 			this.selectGoodsList.splice(i, 1)
				// 		}
				// 	})
				// }
				// console.log('selectGoodsList444444444', this.selectGoodsList)
				// this.brandGoodsList = []
				// this.otherGoodList = []
				// this.drinkList = []
				// item.select = false
				// this.selectGoodsList.forEach(sitem => {
				// 	if (sitem.select) {
				// 		// 选中商品
				// 		if (sitem.productClass == '0101') {
				// 			// 面包分类商品
				// 			this.brandGoodsList.push(sitem)
				// 		} else if (sitem.productClass == '0102') {
				// 			// 饮品商品
				// 			this.drinkList.push(sitem)
				// 		} else if (sitem.productClass == '0199') {
				// 			// 其他分类商品
				// 			this.otherGoodList.push(sitem)
				// 		}
				// 	}
				// })
				let flag = true
				item.list.forEach(value => {
					if (!value.select) {
						flag = false
					}
				})
				if (!flag) {
					item.select = false
				} else {
					item.select = true
				}

				console.log('选择完面包分类商品', this.brandGoodsList)
			},
			getPercent(animationPercent) {
				this.percent = animationPercent;
			},
			openSelectShareWay() {
				this.selectClassifyShow = false
				this.shareWayShow = true
			},
			closeShareWayShow() {
				this.shareWayShow = false
			},
			/* 跳转商品排序 */
			goGoodsSort() {
				console.log('选中商品', this.selectGoodsList)
				console.log('面包', this.brandGoodsList)
				console.log('饮品', this.drinkList)
				console.log('其他', this.otherGoodList)
				let selectGoodsList = []
				this.brandGoodsList.forEach(item => {
					if (item.select) {
						selectGoodsList.push(item)
					}
				})
				this.drinkList.forEach(item => {
					if (item.select) {
						selectGoodsList.push(item)
					}
				})
				this.otherGoodList.forEach(item => {
					if (item.select) {
						selectGoodsList.push(item)
					}
				})
				uni.setStorageSync('selectGoodsList', selectGoodsList)
				uni.navigateTo({
					url: '../goods/sort?memuDate=' + this.memuDate + '&weather=' + this.weather
				})
			},
			openClassifyShow() {
				this.percent = 0
				this.loadRefresh = false
				this.$nextTick(() => {
					this.loadRefresh = true
				})
				this.brandGoodsList = []
				this.drinkList = []
				this.otherGoodList = []
				// 遍历商品列表,查找已选中的商品插入到selectGoodsList中
				this.goodsList.forEach(item => {
					item.list.forEach(value => {
						if (value.select) {
							// 选中商品
							this.selectGoodsList.push(value)
							if (value.productClass == '0101') {
								// 面包分类商品
								this.brandGoodsList.push(value)
							} else if (value.productClass == '0102') {
								// 饮品商品
								this.drinkList.push(value)
							} else if (value.productClass == '0199') {
								// 其他分类商品
								this.otherGoodList.push(value)
							}
						}
					})
				})
				console.log('brandGoodsList', this.brandGoodsList)
				console.log('drinkList', this.drinkList)
				console.log('otherGoodList', this.otherGoodList)
				// let brandGoodsList = []
				// let drinkList = []
				// let otherGoodList = []
				// this.selectGoodsList.forEach(sitem => {
				// 	if (sitem.select) {
				// 		// 选中商品
				// 		if (sitem.productClass == '0101') {
				// 			// 面包分类商品
				// 			brandGoodsList.push(sitem)
				// 		} else if (sitem.productClass == '0102') {
				// 			// 饮品商品
				// 			drinkList.push(sitem)
				// 		} else if (sitem.productClass == '0199') {
				// 			// 其他分类商品
				// 			otherGoodList.push(sitem)
				// 		}
				// 	}
				// })
				if (this.brandGoodsList.length == 0) {
					this.classify[0].select = false
				} else {
					this.classify[0].select = true
				}
				if (this.drinkList.length == 0) {
					this.classify[1].select = false
				} else {
					this.classify[1].select = true
				}
				if (this.otherGoodList.length == 0) {
					this.classify[2].select = false
				} else {
					this.classify[2].select = true
				}
				this.selectClassifyShow = true
			},
			closeClassifyShow() {
				this.selectClassifyShow = false
			},
			changeSelectState(item) {
				item.select = !item.select
				if (!item.select) {
					// 未选中
					if (item.class == '0101') {
						this.brandGoodsList = []
					} else if (item.class == '0102') {
						this.drinkList = []
					} else if (item.class == '0199') {
						this.otherGoodList = []
					}
				}
				console.log(item)
			},
			/* 全选分类 */
			selectClassify(item, index) {
				console.log(item)
				item.select = !item.select
				if (item.select) {
					// 全选
					this.goodsList[index].list.forEach(value => {
						value.select = true
					})
				} else {
					this.goodsList[index].list.forEach(value => {
						value.select = false
					})
				}
			},
			closeLoad() {
				this.loadingShow = false
			}
		}
	}
</script>

<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}

	.time-weather {
		margin: 40rpx 24rpx 0 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 99;
	}

	.time-nav {
		display: flex;
		align-items: flex-end;
		font-size: 28rpx;
		color: #666;
	}

	.time-select {
		width: 254rpx;
		height: 68rpx;
		line-height: 68rpx;
		text-align: center;
		background-image: url(../../static/store/timebg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.time-select:nth-child(2) {
		margin-left: -40rpx;
		z-index: 22;
	}

	.time-select.today-active {
		background-image: url(../../static/store/todayActive.png);
		color: #F2AB99;
		z-index: 23;
		height: 80rpx;
		line-height: 80rpx;
	}

	.time-select.tommorrow-active {
		background-image: url(../../static/store/tommorrow.png);
		color: #F2AB99;
		z-index: 23;
		height: 80rpx;
		line-height: 80rpx;
	}

	.weather-img image {
		width: 60rpx;
		height: auto;
	}

	.select-goods-cont {
		padding: 40rpx 24rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		background-color: #fff;
		margin-bottom: 24rpx;
	}

	.goods-cont {
		padding: 24rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.goods-box {
		/* background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx; */
		width: 226rpx;
		position: relative;
		margin-right: 12rpx;
		margin-bottom: 12rpx;
	}

	.goods-box:nth-child(3n) {
		margin-right: 0;
	}

	/* .selected-menu {
		margin: 0;
		border-bottom: 1rpx solid #F4F4F4;
		box-shadow: 0 10rpx 5rpx rgba(0, 0, 0, .1);
		border-radius: 0;
	} */

	.goods-img {
		margin-right: 20rpx;
	}

	.goods-img image {
		width: 226rpx;
		height: 226rpx;
		display: block;
	}

	.goods-info {
		font-size: 28rpx;
	}

	.select-goods-box {
		text-align: center;
		color: #333;
		margin-right: 24rpx;
	}

	.goods-name-box {
		background-color: rgba(0, 0, 0, .3);
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 12rpx;
	}

	.goods-name {
		color: #fff;
		font-size: 28rpx;
	}

	/* .goods-price {
		color: #F2AB99;
		padding-top: 28rpx;
		font-size: 28rpx;
	}

	.selected-menu-tip {
		color: #999;
		font-size: 28rpx;
	} */

	.btn-box {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 20rpx;
		left: 24rpx;
		right: 24rpx;
	}

	.btn-box view {
		border: 2rpx solid #F2AB99;
		background-color: #f4f4f4;
		color: #F2AB99;
		font-size: 28rpx;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		width: 344rpx;
	}

	.btn-box view.share-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}

	.goods-cont>>>.u-switch {
		background-color: #fff !important;
		border: 4rpx solid #ccc !important;
		width: 72rpx !important;
		height: 46rpx !important;
	}

	.goods-cont>>>.u-switch__bg {
		background-color: #fff !important;
	}

	.goods-cont>>>.u-switch__node {
		background-color: #ccc;
		width: 30rpx !important;
		height: 30rpx !important;
		transform: translateX(-30rpx) !important;
		box-shadow: unset !important;
	}

	.goods-cont>>>.u-switch__node.u-switch__node--on {
		background-color: #F2AB99;
		transform: translateX(-8rpx) !important;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		text-align: center;
		position: absolute;
		right: 14rpx;
		top: 14rpx;
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

	.classify-select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		text-align: center;
		margin-right: 14rpx;
	}

	.classify-select-goods image {
		width: 18rpx;
		height: 12rpx;
	}

	.classify-isSelect-goods {
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-classify-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx;
		background-color: #fff;
	}

	.select-classify {
		display: flex;
		align-items: center;
	}

	.select-classify-icon {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		text-align: center;
	}

	.isselect-classify-icon {
		background-color: #F2AB99;
		border: 2rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-classify-icon image {
		width: 18rpx;
		height: 12rpx;
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
</style>