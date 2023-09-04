<template>
	<view class="daily-menu" :style="storeInfo.storeAttribute == '1' ? 'background-color: #fff;' : ''">
		<u-sticky>
			<yp-nav :title="freshTite" :shareState="shareState" :loginState="loginState" :goodsReverse="true"
				:tomorrowStatus="tomorrowStatus" :productClass="productClass">
			</yp-nav>
		</u-sticky>
		<block v-if="bakeInfo.id != null">
			<block v-if="storeInfo.storeAttribute == '2'">
				<!-- 个性版 -->
				<view class="head" v-if="receivingWay == '1'">
					<!-- 自提 -->
					<view class="time-box">
						<view>{{fromatDate}}</view>
						<view class="week">{{fromateWeek}}</view>
					</view>
					<view class="weather-img">
						<block v-if="bakeInfo.weather == '晴'">
							<image src="../../static/store/sunny.png" mode="widthFix"></image>
						</block>
						<block v-if="bakeInfo.weather == '阴'">
							<image src="../../static/store/cloudy.png" mode="widthFix"></image>
						</block>
						<block v-if="bakeInfo.weather == '雨'">
							<image src="../../static/store/rain.png" mode="widthFix"></image>
						</block>
						<block v-if="bakeInfo.weather == '雪'">
							<image src="../../static/store/snow.png" mode="widthFix"></image>
						</block>
					</view>
				</view>
			</block>
			<!-- 自提 -->
			<block v-if="receivingWay == '1'">
				<view class="delivery-img" v-if="storePublicity.reservationPicture != null">
					<image :src="storePublicity.reservationPicture"></image>
				</view>
			</block>
			<!-- 送货 -->
			<block v-if="receivingWay == '2'">
				<view class="delivery-img" v-if="storePublicity.deliveryPicture != null">
					<image :src="storePublicity.deliveryPicture"></image>
				</view>
			</block>
			<view v-if="receivingWay == '2' && storeInfo.storeAttribute == '2'" class="delivery-box">
				<!-- 配送 -->
				<view>订单预计最晚送达时间</view>
				<view>{{serveTime}}</view>
			</view>
			<u-sticky :offset-top="statusBarHeight + 47">
				<view class="nav-box" :class="storeInfo.storeAttribute == '1' ? 'water-fall-nav' : ''">
					<!-- 标准版 -->
					<block v-if="storeInfo.storeAttribute == '1'">
						<view class="nav-cont">
							<view v-for="(item, index) in goodsClassList" :key="index" class="class-nav"
								:class="[index != 0 ? 'other-class-nav' : '', productClass == item.classCode ? 'active-nav' : '']"
								@click="changeGoodsClass(item)">
								<image :src="item.img" mode="widthFix"></image>
								<view>{{item.className}}</view>
							</view>
						</view>
						<view class="water-fall-delivery" v-if="receivingWay == '2'">
							<!-- 配送 -->
							<view>订单预计最晚送达时间</view>
							<view>{{serveTime}}</view>
						</view>
					</block>
					<!-- 个性版 -->
					<block v-if="storeInfo.storeAttribute == '2'">
						<u-tabs :list="goodsClassList" keyName="className" lineColor="#F2AB99"
							activeStyle="color: #F2AB99;" @click="changeGoodsClass"></u-tabs>
					</block>
				</view>
			</u-sticky>
			<!-- 烘烤列表 -->
			<!-- 标准版 -->
			<block v-if="storeInfo.storeAttribute == '1'">
				<view class="goods-cont">
					<custom-waterfalls-flow ref="waterfallsFlowRef" :value="bakeList" :column="2" :columnSpace="1.5"
						:seat="2" imageKey="cardPicture" @imageClick="goToGoodsDetail" v-if="sonRefresh">
						<view class="store-info" v-for="(item, index) in bakeList" :key="index" slot="slot{{index}}">
							<view class="weight-cal">
								<view class="weight-box" v-if="item.weight !== null && item.weight != 0">
									<view>重量：</view>
									<view>{{item.weight}}g</view>
								</view>
								<view class="weight-box" v-if="item.calorie !== null && item.calorie != 0">
									<view>热量：</view>
									<view>{{item.calorie}}cal</view>
								</view>
							</view>
							<view class="add-good-box">
								<view>
									<block v-if="!(storeInfo.storeType == 3 && tomorrowStatus)">
										<!-- 非预定版 明日菜单 -->
										<!-- 面包分类 手动烘焙 -->
										<block v-if="item.productClass == '0101' && item.bakeType == 1">
											<view v-if="item.bakeState == 1" class="bake-time-box">
												<view class="state-tag bake-load">烘烤中</view>
												<view class="count-down-time">
													<yp-circle-progress :percent="item.remainTime * 100" :size="22"
														:circleWidth="4" :animate="true" circleColor="#F2AB99">
														<span slot="content"
															class="count-down-date">{{item.date}}</span>
													</yp-circle-progress>
													<block v-if="item.remainTimeList > 0">
														<block v-for="(time, idx) in item.remainTimeList" :key="idx">
															<yp-circle-progress percent="100" :size="22"
																:circleWidth="4" :animate="true" circleColor="#F2AB99">
																<span slot="content" class="count-down-date">1H</span>
															</yp-circle-progress>
														</block>
													</block>
												</view>
											</view>
											<view v-if="item.bakeState == 0" class="sell-out tag-nostart">
												未开始
											</view>
										</block>
										<view v-if="item.bakeState == 2" class="state-tag out-ovn">
											已出炉
										</view>
										<!-- 面包分类 自动烘焙 未出炉 -->
										<view
											v-if="item.productClass == '0101' && item.bakeType == 2 && item.bakeState == 0"
											class="state-tag">
											{{item.bakeTimeEnd}}出炉
										</view>
										<block v-if="item.bakeState == 3">
											<view class="sell-out">售罄</view>
										</block>
									</block>
								</view>
								<block v-if="!todayMenu">
									<!-- 0-未开始、1-烘烤中、2-已出炉、3-已售罄 -->
									<view class="add-img"
										v-if="item.bakeState == 0 || item.bakeState == 1 || item.bakeState == 2 || item.bakeType == 2">
										<block v-if="item.num != 0">
											<view class="minus" @click.stop="reduceGoodsNum(item, index)">
												<image src="../../static/custome/reduce.png">
												</image>
											</view>
											<text class="goods-input">{{item.num}}</text>
										</block>
										<view class="plus" @click.stop="addGoodsNum(item, index)">
											<image src="../../static/goods/addIcon.png"></image>
										</view>
									</view>
								</block>
							</view>
						</view>
					</custom-waterfalls-flow>
				</view>
			</block>
			<!-- 个性版 -->
			<block v-if="storeInfo.storeAttribute == '2'">
				<view class="bake">
					<view class="bake-item" v-for="(item, index) in bakeList" :key="item.id">
						<view class="img-box" @click="goToGoodsDetail(item.productId, item.state)">
							<view class="goods-img">
								<image class="img" :src="item.picture" mode=""></image>
							</view>
							<view>
								<view class="goods-state">
									<view>{{item.name}}</view>
									<!-- 面包分类  手动烘焙商品 展示型店铺 -->
									<block
										v-if="productClass == '0101' && item.bakeType == 1 && storeInfo.storeType == 1">
										<view v-if="item.bakeState == 0" class="tag tag-nostart">
											未开始
										</view>
										<view v-if="item.bakeState == 1" class="tag tag-bake">
											烘烤中
										</view>
										<view v-if="item.bakeState == 2" class="tag tag-out">
											已出炉
										</view>
									</block>
									<view v-if="item.bakeState == 3" class="tag tag-end">
										卖光了
									</view>
								</view>
								<view class="price">￥{{item.marketPrice}}</view>
							</view>
						</view>
						<view class="state" :class="productClass == '0199' ? 'other-add-img' : ''">
							<block v-if="productClass == '0101'">
								<!-- 未烘烤 -->
								<view class="before" v-if="item.bakeState == 0">
									<view class="time">预计
										<block v-if="item.bakedEnd == 1">上午</block>
										<block v-if="item.bakedEnd == 2">下午</block>
										<block v-if="item.bakedEnd == 3">全天</block>
										出炉
									</view>
								</view>
								<!-- 烘烤中 -->
								<view class="bakeing" v-if="item.bakeState == 1 && item.dateTime != 0">
									<block v-if="item.dateTime < 60">
										<view class="count-down-box">
											<text class="count-down">{{item.dateTime}}</text>分钟后出炉
										</view>
									</block>
									<block v-else>
										<view class="count-down-box">
											<text class="count-down">{{item.remainTimeList}}</text>小时
											<text class="count-down">{{item.date}}</text>分钟后出炉
										</view>
									</block>
								</view>
							</block>
							<!-- 已出炉 面包分类商品 -->
							<view v-if="item.bakeState == 2 && item.productClass == '0101'">
								<text class="count-down">{{item.finishTime}}</text>出炉
							</view>
							<block v-if="!todayMenu">
								<!-- 未开始、烘烤中、已出炉、自动烘焙、其他分类商品 可进行预定 -->
								<block v-if="item.bakeState != 3">
									<!-- 未售罄 -->
									<view class="add-img"
										v-if="item.bakeState == 0 || item.bakeState == 1 || item.bakeState == 2 || item.bakeType == 2 || productClass == '0199'">
										<view class="goods-num-box">
											<block v-if="item.num != 0">
												<view class="minus" @click.stop="reduceGoodsNum(item, index)">
													<image src="../../static/custome/reduce.png"></image>
												</view>
												<text class="goods-input">{{item.num}}</text>
											</block>
											<view class="plus" @click.stop="addGoodsNum(item, index)">
												<image src="../../static/goods/addIcon.png"></image>
											</view>
										</view>
										<!-- <block v-if="item.num == 0">
											<image src="../../static/goods/addIcon.png" mode=""
												@click.stop="addGoodsNum(item)">
											</image>
										</block>
										<block v-else>
											<u-number-box v-model="item.num">
												<view slot="minus" class="minus" @click.stop="reduceGoodsNum(item)">
													<image src="../../static/custome/reduce.png" mode=""></image>
												</view>
												<text slot="input" class="goods-input">{{item.num}}</text>
												<view slot="plus" class="plus" @click.stop="changeAddGoodsNum(item)">
													<image src="../../static/goods/addIcon.png" mode=""></image>
												</view>
											</u-number-box>
										</block> -->
									</view>
								</block>
							</block>
						</view>
					</view>
				</view>
			</block>

			<view style="height: 200rpx;"></view>
			<block v-if="storeInfo.storeType != 1">
				<!-- 交易型 -->
				<view :class="selectGoodsShow ? 'box-shadow' : ''" @touchmove.stop.prevent
					@click="closeSelectGoodsShow">
					<view class="select-goods-box" :class="selectGoodsShow ? 'select-goodsbox' : ''">
						<block v-if="selectGoodsShow">
							<view class="select-goods-cont" @click.stop="openSelectGoodsShow">
								<view v-for="(item, index) in selectGoodsList" :key="index" class="goods-box">
									<view class="img-box">
										<view class="bake-goods-img">
											<image :src="item.picture"></image>
										</view>
										<view>
											<view class="goods-name">{{item.name}}</view>
											<view class="price">￥{{item.marketPrice}}</view>
										</view>
									</view>
									<view class="add-img">
										<view class="goods-num-box">
											<block v-if="item.num != 0">
												<view class="minus" @click.stop="reduceGoodsNum(item, index)">
													<image src="../../static/custome/reduce.png"></image>
												</view>
												<text class="goods-input">{{item.num}}</text>
											</block>
											<view class="plus" @click.stop="addGoodsNum(item, index)">
												<image src="../../static/goods/addIcon.png"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<view class="account-box">
							<view class="num-price" @click.stop="openSelectGoodsShow">
								<view class="goods-num">
									<block v-if="selectGoodsShow">
										<image src="../../static/custome/shopCart.png" mode="widthFix"></image>
									</block>
									<block v-if="!selectGoodsShow">
										<image src="../../static/custome/shopCart2.png" mode="widthFix"></image>
									</block>
									<u-badge bgColor="#F2AB99" max="99" :value="totalNum" :absolute="true"
										:offset="[6, -9]" :showZero="true"></u-badge>
								</view>
								<view class="total-price-box">
									<view class="total-price">￥{{totalPrice}}</view>
									<view v-if="receivingWay == '2'">当前配送费{{deliveryFee}}元</view>
								</view>
							</view>
							<!-- 未达到起送金额 -->
							<view class="due-to-btn up-to-send"
								v-if="totalPrice < storeDeliveryAttr.deliveryThreshold && receivingWay == '2'">
								￥{{storeDeliveryAttr.deliveryThreshold}}起送</view>
							<view @click="dueToGoods" v-else class="due-to-btn">确认下单</view>
						</view>
					</view>
				</view>
			</block>
		</block>
		<view class="menu-empty" v-else>
			<image src="../../static/store/default.png" mode="widthFix"></image>
			<view>今日未设置菜单</view>
		</view>

		<!-- 商品详情 -->
		<u-popup :show="detailShow" @close="closeDetailShow" :round="10">
			<scroll-view class="detail-box" scroll-y="true"
				:style="'max-height:' + (screenHeight - 130 - statusBarHeight) + 'px'">
				<yp-detail ref="detail" :productsId="productsId" :selectGoodsList="selectGoodsList"
					:bakeState="bakeState" @closeDetailShow="closeDetailShow" @addGoodsNum="addGoodsNum"></yp-detail>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import customWaterfallsFlow from "@/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue";
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	import ypCircleProgress from '@/components/yp-circle-progress/yp-circle-progress.vue'
	import date from '@/common/js/date.js'
	import ypWaterfall from '@/components/yp-waterfall/yp-waterfall.vue'
	import ypDetail from '@/components/yp-goodDetail/yp-detail.vue'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				bakeInfo: {},
				countDown: null, // 倒计时
				timeData: {}, // 计时器
				bakeIndex: null, // 烘烤索引
				storeId: '', // 店铺id  暂无
				startTime: null,
				bakeList: [], // 展示
				pageIndex: 1,
				pageSize: 20,
				empty: false, // 菜单是否为空
				totalNum: 0,
				totalPrice: 0,
				deliveryTime: 0, // 取货时间
				classIdx: 0,
				goodsClassList: [{
					img: this.config.imgUrl + 'brandIcon.png',
					name: '面包',
					value: '0101'
				}, {
					img: this.config.imgUrl + 'brandIcon.png',
					name: '饮品',
					value: '0102'
				}, {
					img: this.config.imgUrl + 'otherBrand.png',
					name: '其他',
					value: '0199'
				}],
				productClass: '',
				selectGoodsList: [],
				selectGoodsShow: false,
				storeInfo: {},
				detailShow: false,
				productsId: '', // 查看详情商品id
				shareState: false,
				completed: false,
				sonRefresh: false,
				loginState: false,
				loginRefresh: false,
				productName: '',
				receivingWay: '',
				storeDeliveryAttr: {}, // 店铺配送属性
				serveTime: '', // 送达时间
				deliveryFee: 0,
				storePublicity: {},
				statusBarHeight: 0,
				screenHeight: 0,
				userInfo: {},
				todayMenu: false,
				freshTite: '商品预定',
				bakeState: '', // 商品状态
				tomorrowStatus: false,
				memuDate: ''
			}
		},
		components: {
			ypNav,
			ypCircleProgress,
			ypWaterfall,
			ypDetail,
			customWaterfallsFlow
		},
		computed: {
			// 计算日期
			fromatDate() {
				let date = new Date(this.bakeInfo.memuDate * 1)
				// console.log(time)
				let years = date.getFullYear() || 2000
				let mount = date.getMonth() + 1 || 1
				let day = date.getDate() || 1
				return years + '年' + mount + '月' + day + '日'
			},
			// 计算星期
			fromateWeek() {
				let date = new Date(this.bakeInfo.memuDate * 1)
				let week = date.getDay() || 1
				switch (week) {
					case 1:
						return '星期一'
						break;
					case 2:
						return '星期二'
						break;
					case 3:
						return '星期三'
						break;
					case 4:
						return '星期四'
						break;
					case 5:
						return '星期五'
						break;
					case 6:
						return '星期六'
						break;
					case 7:
						return '星期日'
						break;
				}
				return week
			},
			/* 选中商品数量 */
			selectGoodsNum() {
				this.totalNum = 0
				this.totalPrice = 0
				this.selectGoodsList.forEach(item => {
					this.totalNum += item.num
					if (item.num != 0) {
						this.totalPrice = parseFloat(this.totalPrice) + parseFloat((item.marketPrice * item.num)
							.toFixed(2))
					}
				})
				if (this.receivingWay == '2') {
					// 配送
					if (this.totalPrice < this.storeDeliveryAttr.deliveryFree) {
						// 商品价格小于免配送费金额
						this.deliveryFee = this.storeDeliveryAttr.deliveryFee
					} else {
						this.deliveryFee = 0
					}
				}
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.pageIndex = 1
			this.completed = false
			this.bakeList = []
			this.shareState = options.shareState == 'true' ? true : false
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.tomorrowStatus = options.tomorrowStatus == undefined ? '' : true

			this.getClassifyList()
			this.getStoreInfo()
			this.loginState = options.loginState == 'true' ? true : false
			this.todayMenu = options.todayMenu == 'true' ? true : false
			if (!this.loginState) {
				this.onLogin()
			} else {
				let that = this
				that.loginRefresh = false
				that.$nextTick(() => {
					that.loginRefresh = true
				})
			}
			this.sonRefresh = false
			this.$nextTick(() => {
				this.sonRefresh = true
			})
			this.receivingWay = options.receivingWay
			if (this.tomorrowStatus) {
				// 预定版
				this.freshTite = '明日菜单'
			} else {
				if (this.todayMenu) {
					// 今日菜单
					this.freshTite = '今日菜单'
				} else {
					if (this.receivingWay == '2') {
						this.freshTite = '给您送达'
						this.getStoreAttr() // 获取店铺配送属性
					} else {
						this.freshTite = '自己取单'
					}
				}
			}
			this.getStorePublicity() // 获取店铺宣传图

			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
					that.screenHeight = res.screenHeight
					console.log('screenHeight', that.screenHeight)
				}
			})
			this.backState = options.backState
			uni.setStorageSync('selectGoodsList', [])

			if (options.goodsId != undefined) {
				// 分享商品详情
				this.goToGoodsDetail(options.goodsId, options.bakeState)
			}
			if (this.tomorrowStatus) {
				// 明日预定
				this.timeIdx = 1
				var day = new Date()
				day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
				var tomorrow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
				var tomorrow1 = (day.getMonth() + 1) + '月' + day.getDate() + '日'
				this.memuDate = tomorrow
			} else {
				this.timeIdx = 0
				// 获取当前日期时间
				var myDate = new Date();
				this.memuDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
			}
		},
		onShow() {
			// 搜索页选择商品
			let selectGoodsList = uni.getStorageSync('selectGoodsList')
			console.log('selectGoodsList', selectGoodsList)
			if (selectGoodsList.length !== 0) {
				this.selectGoodsList = selectGoodsList
				this.pageIndex = 1
				this.completed = false
				this.bakeList = []
				this.getBakeList()
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
			}
			console.log('选中商品信息', this.selectGoodsList)
		},
		onPullDownRefresh() {
			this.pageIndex = 1
			this.completed = false
			this.bakeList = []
			this.getBakeList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			let that = this
			that.pageIndex += 1
			that.getBakeList()
		},
		methods: {
			/* 获取门店信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeId
				}).then(res => {
					let data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
				})
			},
			// 获取烘烤列表
			getBakeList() {
				let that = this
				if (!that.completed) {
					var myDate = new Date()
					let memuDate = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate()
					// that.request({
					// 	url: that.config.catalog,
					// 	data: {
					// 		storeId: that.storeId,
					// 		pageIndex: that.pageIndex,
					// 		pageSize: that.pageSize,
					// 		sort: 'DESC',
					// 		productClass: that.productClass,
					// 		productName: that.productName,
					// 		when: that.tomorrowStatus
					// 	},
					// 	method: 'GET'
					that.request({
						url: that.config.menuGoodsList,
						data: {
							pageIndex: that.pageIndex,
							pageSize: that.pageSize,
							memuDate: that.memuDate, // 日期
							storeId: that.storeId,
							productName: that.productName,
							productClass: that.productClass
						}
					}).then(res => {
						console.log(res)
						if (res.statusCode == 200) {
							const data = res.data.data
							if (data.pageDate.data.length == 0) {
								that.completed = true
							} else {
								// 计算烘烤剩余时间
								data.pageDate.data.forEach(item => {
									item.num = 0
									item.deliveryTime = 0
									if (item.bakeState == 1) {
										item.dateTime = that.getDate(memuDate + ' ' + item.finishTime)
										item.remainTime = (parseInt(item.dateTime) / 60).toFixed(2)
										item.remainTimeList = Math.ceil(item.remainTime) - 1
										if (item.dateTime > 60) {
											item.date = item.dateTime - item.remainTimeList * 60
											if (item.date < 10) {
												item.date = '0' + item.date
											}
											item.remainTime = (parseInt(item.date) / 60).toFixed(2)
										} else {
											item.date = item.dateTime
										}
									}
									that.selectGoodsList.forEach(value => {
										if (item.id == value.id) {
											item.num = value.num
										}
									})
									if (item.bakeState == 2 && item.productClass == '0101') {
										item.finishTime = item.finishTime.substring(0, 5)
									}
									if (item.status) {
										that.bakeList.push(item)
									}
								})
								that.bakeInfo = data
							}
						} else {
							that.empty = true
						}
					})
				}
			},
			/* 日期格式转换成时间戳 */
			getDate(time) {
				var time
				var nowTime = +new Date(); //当前时间总毫秒数
				var inputTime = +new Date(time); //用户输入时间总毫秒数
				var times = (inputTime - nowTime) / 1000; //剩余时间时间总秒数（毫秒变成秒）
				var d = parseInt(times / 60 / 60 / 24) //天数
				d = d < 10 ? '0' + d : d;
				var h = parseInt(times / 60 / 60 % 24) //小时

				var m = parseInt(times / 60 % 60) //分
				m = m < 10 ? '0' + m : m;

				var s = parseInt(times % 60) //秒
				s = s < 10 ? '0' + s : s;
				if (h > 0) {
					m = parseInt(m) + h * 60
				}

				return m;
			},
			/* 选择商品进行预定 */
			addGoodsNum(item, index) {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId +
							'&goodsReverse=true&backState=' + this.backState
					})
				} else {
					console.log('增加商品数量', item)

					if (item.num == 0) {
						console.log('item.num=0')
						item.num++
						this.selectGoodsList.push(item)
						this.bakeList.forEach(goods => {
							this.selectGoodsList.forEach(value => {
								if (goods.id == item.id || goods.productId == item.id) {
									goods.num = item.num
									// value.num = item.num
								}
								// if (goods.productId == value.id) {
								// 	item.num = value.num
								// }
							})
						})
					} else {
						console.log('item.num!=0')
						item.num++
						this.bakeList.forEach(goods => {
							this.selectGoodsList.forEach(value => {
								if (goods.id == item.id || goods.productId == item.id) {
									goods.num = item.num
									// value.num = item.num
								}
							})
						})
					}
					console.log('index', index)
					if (index == undefined) {
						// 商品详情加入购物车
						// if (this.selectGoodsList.length == 0) {
						// 	index = 0
						// } else {
						this.bakeList.forEach((goods, i) => {
							console.log('goods', goods)
							if (item.id == goods.id || item.id == goods.productId) {
								index = i
							}
						})
						// }
					}
					console.log('idnex2222222', index)
					this.bakeList[index].num = item.num
					let idx
					if (this.selectGoodsList.length != 0) {
						this.selectGoodsList.forEach((value, i) => {
							if (value.id == item.id || item.productId == value.id) {
								idx = i
							}
						})
					}
					this.selectGoodsList[idx].num = item.num
					uni.setStorageSync('selectGoodsList', this.selectGoodsList)
				}
			},
			/* 减少商品数量 */
			reduceGoodsNum(item, index) {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId +
							'&goodsReverse=true&backState=' + this.backState
					})
				} else {
					let idx
					this.selectGoodsList.forEach((value, i) => {
						if (value.id == item.id || item.productId == value.id) {
							idx = i
						}
					})
					item.num--
					this.bakeList.forEach(goods => {
						this.selectGoodsList.forEach(value => {
							if (goods.id == item.id || goods.productId == item.id) {
								goods.num = item.num
							}
							// if (goods.productId == value.id) {
							// 	goods.num = value.num
							// }
						})
					})
					if (item.num == 0) {
						this.selectGoodsList.splice(idx, 1)
					} else {
						this.selectGoodsList[idx].num = item.num
						this.bakeList[index].num = item.num
					}
					uni.setStorageSync('selectGoodsList', this.selectGoodsList)
				}
			},
			/* 增加商品数量 */
			// changeAddGoodsNum(item) {
			// 	if (!this.loginState) {
			// 		// 未登录注册
			// 		uni.reLaunch({
			// 			url: '/pages/startUp/login/login?storeId=' + this.storeId +
			// 				'&goodsReverse=true&backState=' + this.backState
			// 		})
			// 	} else {
			// 		item.num++
			// 		this.selectGoodsList.forEach(value => {
			// 			if (item.id == value.id) {
			// 				value.num = item.num
			// 			}
			// 		})
			// 		uni.setStorageSync('selectGoodsList', this.selectGoodsList)
			// 	}
			// },
			/* 提前预定商品 */
			dueToGoods() {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId +
							'&goodsReverse=true&backState=' + this.backState
					})
				} else {
					if (this.selectGoodsList.length == 0) {
						uni.showToast({
							title: '请选择预定商品',
							icon: 'none'
						})
					} else {
						// if (this.receivingWay == '1') {
						// 自提订单
						// 订阅消息
						// wx.requestSubscribeMessage({
						// 	tmplIds: ['nX58DGMw6zSLY2A_RolgoFv1UAAYOvX_GK6Adn5WUGg', 'SG8Mzezq5jvj154pKAFAD--pfKwB0AHqFZIrckUJPLE'],
						// 	success(res) {
						// 		console.log('订阅成功', res)
						// 	},
						// 	fail(err) {
						// 		console.log('订阅失败', err)
						// 	}
						// })
						// } else if (this.receivingWay == '2') {
						// 	// 配送订单
						// 	wx.requestSubscribeMessage({
						// 		tmplIds: ['SG8Mzezq5jvj154pKAFAD--pfKwB0AHqFZIrckUJPLE'],
						// 		success(res) {
						// 			console.log('订阅成功', res)
						// 		},
						// 		fail(err) {
						// 			console.log('订阅失败', err)
						// 		}
						// 	})
						// }

						let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
						let dateTime = date.parseTime(Number(new Date()), "{y}/{m}/{d} {h}:{i}:{s}")
						let deliveryTimeArr = []
						this.selectGoodsList.forEach(item => {
							if (item.bakeState == 1) {
								// 烘烤中商品 取餐时间为出炉时间
								// 当前日期+出炉时间 
								let time = new Date(dateDay + ' ' + item.finishTime)
								item.deliveryTime = time.getTime() // 当前时间转换成时间戳
							} else if (item.bakeState == 2 || item.productClass == '0199') {
								// 已出炉 或 其他分类商品取餐时间为当前时间
								item.deliveryTime = new Date(dateTime).getTime()
							} else if (item.bakeType == 2) {
								// 自动烘焙商品  取餐时间为出炉时间
								// 当前日期+出炉时间 
								let bakeTypeTime = new Date(dateDay + ' ' + item.bakeTimeEnd)
								item.deliveryTime = bakeTypeTime.getTime() // 当前时间转换成时间戳
							} else if (item.bakeState == 0) {
								// 未开始商品，取餐时间为店铺最晚自提时间
								let lastExtractionTime = new Date(dateDay + ' ' + this.storeInfo
									.lastExtractionTime)
								item.deliveryTime = lastExtractionTime.getTime()
							}
							deliveryTimeArr.push(item.deliveryTime)
						})
						let maxDeliveryTime = Math.max(...deliveryTimeArr)
						this.deliveryTime = date.parseTime(maxDeliveryTime, "{h}:{i}")

						uni.setStorageSync('goodsList', this.selectGoodsList)
						uni.navigateTo({
							url: '../order/submitOrder?totalPrice=' + this
								.totalPrice + '&deliveryTime=' + this.deliveryTime + '&storeId=' + this.storeId +
								'&receivingWay=' + this.receivingWay + '&tomorrowStatus=' + this.tomorrowStatus
						})
					}
				}
			},
			/* 切换商品分类 */
			changeGoodsClass(item) {
				this.productClass = item.classCode
				this.pageIndex = 1
				this.completed = false
				this.bakeList = []
				this.getBakeList()
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
			},
			openSelectGoodsShow() {
				this.selectGoodsShow = true
			},
			closeSelectGoodsShow() {
				this.selectGoodsShow = false
			},
			/* 弹出商品详情 */
			goToGoodsDetail(id, state) {
				console.log('商品详情', id)
				if (id.productId != undefined) {
					this.productsId = id.productId
					this.bakeState = id.bakeState
				} else {
					this.productsId = id
					this.bakeState = state
				}
				setTimeout(() => {
					this.$refs.detail.getProductsByID()
					this.detailShow = true
				}, 10)
			},
			closeDetailShow() {
				this.detailShow = false
			},
			/* 登录获取token */
			onLogin() {
				let that = this
				uni.login({
					success: res => {
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02' + '&store_id=' + that.storeId +
								'&avatar=&nick_name=',
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
						}).then(res => {
							// 用户存在
							let data = res.data
							console.log('登录返回', data)
							if (res.statusCode == 200 && data.access_token) {
								that.loginState = true
								// 保存 token 到全局
								uni.setStorageSync('token', data.access_token)
								that.getLoginUser()
							} else {
								that.loginState = false
							}
							that.loginRefresh = false
							that.$nextTick(() => {
								that.loginRefresh = true
							})
						})
					}
				})
			},
			// 获取登录用户信息
			getLoginUser() {
				let that = this
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					if (res.data.code == 200000) {
						let data = res.data.data
						// 缓存用户信息
						uni.setStorageSync('userInfo', data)
						that.userInfo = data
						// that.registerStore()
					} else {
						that.loginState = false
					}
				})
			},
			/* 搜索商品 */
			searchGoods() {
				this.pageIndex = 1
				this.completed = false
				this.bakeList = []
				this.getBakeList()
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
			},
			/* 获取店铺配送属性 */
			getStoreAttr() {
				let that = this
				that.request({
					url: `${that.config.storeDeliveries}/${that.storeId}`
				}).then(res => {
					console.log('店铺属性', res)
					const data = res.data.data
					that.storeDeliveryAttr = data
					let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
					let time = new Date(dateDay + ' ' + data.deliveryTime)
					let deliveryTime = time.getTime() + parseFloat(data.estimatedTime) *
						3600000 // 开始配送时间转换成时间戳  +  配送用时（毫秒）
					that.serveTime = date.parseTime(deliveryTime, "{h}:{i}")
				})
			},
			/* 获取店铺宣传图 */
			getStorePublicity() {
				let that = this
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`
				}).then(res => {
					console.log('获取店铺宣传图', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.storePublicity = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取商品分类顺序 */
			getClassifyList() {
				let that = this
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
							item.img = ''
							if (item.classCode == '0101') {
								// 面包
								item.img = this.config.imgUrl + 'brandIcon.png'
							} else if (item.classCode == '0102') {
								// 饮品
								item.img = this.config.imgUrl + 'brandIcon.png'
							} else if (item.classCode == '0199') {
								// 其他
								item.img = this.config.imgUrl + 'otherBrand.png'
							}
						})
						that.goodsClassList = data
						that.productClass = data[0].classCode
						that.getBakeList()
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

	/* 未设置菜单 */
	.title {
		margin-top: 50rpx;
		text-align: center;
	}

	.head {
		padding: 20rpx 24rpx 20rpx 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		background-color: #F4F4F4;
	}

	.time-box {
		display: flex;
		align-items: center;
	}

	.week {
		padding-left: 20rpx;
	}

	.weather-img image {
		width: 60rpx;
		height: auto;
	}

	.nav-box {
		margin-bottom: 18rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
	}

	.nav-box.water-fall-nav {
		margin-bottom: 0;
		padding: 20rpx 24rpx;
		justify-content: space-between;
	}

	.nav-cont {
		display: flex;
		align-items: center;
	}

	.class-nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		border: 2rpx solid #fff;
		box-shadow: 4rpx 4rpx 10rpx rgba(0, 0, 0, .1);
		margin-right: 14rpx;
		color: #525252;
		font-size: 28rpx;
	}

	.class-nav.active-nav {
		border-color: #F2AB99;
		box-shadow: unset;
	}

	.class-nav image {
		width: 56rpx;
		height: auto;
		margin-bottom: 10rpx;
	}

	.other-class-nav image {
		width: 44rpx;
		height: auto;
	}

	.bake-item {
		margin-bottom: 14rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		padding: 20rpx 24rpx;
	}

	.img-box {
		display: flex;
		align-items: center;
		width: 70%;
	}

	.bake-goods-img {
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
	}

	.bake-goods-img image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		display: block;
	}

	.goods-state {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.price {
		font-size: 24rpx;
		/* padding-top: 24rpx; */
		color: #F2AB99;
	}

	.bake-item .state {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	.bake-item .state.other-add-img {
		justify-content: flex-end;
	}

	.state .time {
		font-size: 24rpx;
	}

	.state .btn {
		padding: 8rpx 0;
		border-radius: 12rpx;
		margin-bottom: 10rpx;
	}

	.goods-input {
		width: 40rpx;
		text-align: center;
	}

	/* 烘烤前 */
	.before .btn {
		background-color: #ffc900;
		color: #a62d2d;
	}

	.bakeing {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
	}

	/* 烘烤中 */
	.state .bakeing .btn {
		background-color: #ff1d00;
		color: #FFFFFF;
	}

	.state .bakeing .time {
		color: #ff4d00;
	}

	/* 已出炉 */
	.state .end .btn {
		background-color: #ff4d00;
		color: #FFFFFF;
	}

	.state .end .time {
		color: #ff4d00;
	}

	/* 卖光了 */
	.out-btn {
		color: #FAF6F6;
		background-color: #6A6866;
		padding: 8rpx 0;
		border-radius: 12rpx;
	}

	.tag {
		font-size: 20rpx;
		border-radius: 50rpx;
		padding: 0 10rpx;
		margin-left: 14rpx;
		height: 32rpx;
		line-height: 32rpx;
	}

	.tag.tag-nostart {
		color: #FFC263;
		background: #FFF3E0;
		border: 1rpx solid #FFC263;
	}

	.tag.tag-bake {
		color: #F2AB99;
		background: #FCEEEB;
		border: 1rpx solid #F2AB99;
	}

	.tag.tag-out {
		color: #7CD1F8;
		background: #E5F6FE;
		border: 1rpx solid #7CD1F8;
	}

	.tag.tag-end {
		colog: #333333;
		background: #D6D6D6;
		border: 1rpx solid #333333;
	}

	.count-down-box {
		margin-bottom: 22rpx;
	}

	.count-down-time {
		display: flex;
		align-items: center;
		margin-left: 14rpx;
	}

	.count-down {
		color: #F2AB99;
		display: inline-block;
		padding: 0 6rpx;
	}

	.count-down-date {
		color: #F2AB99;
		font-size: 18rpx;
	}

	.menu-empty {
		text-align: center;
		color: #333;
		font-size: 28rpx;
		padding-top: 260rpx;
	}

	.menu-empty image {
		width: 96rpx;
		height: auto;
		margin-bottom: 40rpx;
	}

	.add-img {
		display: flex;
		align-items: center;
	}

	.add-img image {
		width: 44rpx;
		height: 44rpx;
	}

	.select-goods-box {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		z-index: 24;
		background-color: #fff;
		overflow: hidden;
		border-radius: 50rpx;
	}

	.select-goods-box.select-goodsbox {
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
	}

	.account-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #666;
		border-radius: 50rpx;
		height: 100rpx;
		overflow: hidden;
		box-shadow: 0 -1rpx 0 rgba(0, 0, 0, .1);
	}

	.select-goodsbox .account-box {
		background-color: #fff;
	}

	.num-price {
		display: flex;
		align-items: center;
		padding-left: 28rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.goods-num {
		position: relative;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.goods-num image {
		width: 66rpx;
		height: auto;
	}

	.total-price-box {
		margin-left: 44rpx;
		font-size: 22rpx;
	}

	.total-price {
		color: #F2AB99;
		font-size: 28rpx;
	}

	.due-to-btn {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		width: 200rpx;
		text-align: center;
		line-height: 100rpx;
		height: 100rpx;
	}

	.due-to-btn.up-to-send {
		background-color: #ccc;
	}

	.goods-box {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.select-goods-cont {
		background-color: #fff;
		padding: 20rpx;
	}

	.box-shadow {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 23;
	}

	.select-tip {
		font-size: 22rpx;
		color: #999;
	}

	.daily-menu>>>.u-icon__icon {
		z-index: 9999;
	}

	.delivery-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #F2FAFE;
		color: #7CD1F8;
		font-size: 24rpx;
		padding: 0 14rpx;
		height: 100rpx;
		line-height: 100rpx;
	}

	.delivery-img {
		margin: 0 24rpx;
	}

	.delivery-img image {
		width: 100%;
		height: 320rpx;
		display: block;
		border-radius: 10rpx;
	}

	.daily-menu>>>.u-popup__content {
		overflow: hidden;
	}

	.water-fall-delivery {
		background-color: #F2FAFE;
		color: #7CD1F8;
		font-size: 24rpx;
		height: 120rpx;
		text-align: center;
		padding: 0 14rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	/* .daily-menu>>>.circle-progress-bar {
		margin-left: 0;
	}

	.daily-menu>>>.content {
		background-color: #F2AB99 !important;
	}

	.daily-menu>>>.count-down-date {
		color: #fff;
	} */

	.daily-menu>>>.column-value {
		position: relative;
		box-shadow: 4rpx 4rpx 10rpx rgba(0, 0, 0, .1);
	}

	.goods-cont {
		margin: 14rpx 24rpx;
	}

	.bake-goods-box {
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 4rpx 4rpx 10rpx rgba(0, 0, 0, .2);
	}

	.goods-img-box {
		position: relative;
	}

	.goods-img image {
		width: 120rpx;
		height: 120rpx;
		display: block;
	}

	.goods-label {
		position: absolute;
		left: 20rpx;
		top: 20rpx;
		width: 66rpx;
		height: auto;
	}

	.name-cont {
		margin-top: -60rpx;
		position: relative;
	}

	.no-ename {
		margin-top: 0;
	}

	.goods-ename {
		background-color: rgba(0, 0, 0, .4);
		color: #fff;
		text-align: center;
		font-size: 24rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.store-info {
		padding: 0 20rpx 20rpx;
		color: #333;
		font-size: 28rpx;
	}

	.weight-cal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 20rpx;
		color: #999;
	}

	.weight-box {
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;
	}

	.price-num {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20rpx;
	}

	.add-img image {
		width: 44rpx;
		height: 44rpx;
		display: block;
	}

	.sell-out {
		font-size: 24rpx;
		border-radius: 50rpx;
		padding: 0 20rpx;
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

	.sell-out.tag-bake {
		color: #F2AB99;
		background: #FCEEEB;
		border: 1rpx solid #F2AB99;
	}

	.add-good-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bake-time-box {
		display: flex;
		align-items: center;
	}

	.state-tag {
		color: #FFC263;
		font-size: 20rpx;
		border: 2rpx solid #FFC263;
		background-color: #FFF3E0;
		padding: 0 20rpx;
		border-radius: 50rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
	}

	.state-tag.out-ovn {
		color: #7CD1F8;
		border-color: #7CD1F8;
		background-color: #E5F6FE;
	}

	.state-tag.bake-load {
		color: #F2AB99;
		border-color: #F2AB99;
		background-color: #FCEEEB;
	}

	.count-down-time {
		display: flex;
		align-items: center;
	}

	.count-down-date {
		color: #F2AB99;
		font-size: 18rpx;
	}

	.goods-num-box {
		display: flex;
		align-items: center;
	}

	.comment-box {
		margin-top: -60rpx;
	}

	.daily-menu>>>.u-sticky {
		z-index: 9 !important;
	}

	.daily-menu>>>.u-popup__content {
		overflow: hidden;
	}
</style>