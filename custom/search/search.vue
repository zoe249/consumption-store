<template>
	<view>
		<view class="wrap">
			<u-search placeholder="请输入商品名称" v-model="productName" :showAction="false" @search="searchGoods"
				:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
				searchIconColor="#F2AB99" shape="square" @clear="searchGoods"></u-search>
		</view>
		<!-- 烘烤列表 -->
		<!-- 标准版 -->
		<block v-if="storeInfo.storeAttribute == '1'">
			<WaterfallsFlow :wfList='bakeList' @addGoodsNum="addGoodsNum" @reduceGoodsNum="reduceGoodsNum"
				@changeAddGoodsNum="changeAddGoodsNum" @goToGoodsDetail="goToGoodsDetail" />
		</block>
		<!-- 个性版 -->
		<block v-if="storeInfo.storeAttribute == '2'">
			<view class="bake">
				<view class="bake-item" v-for="(item, index) in bakeList" :key="item.id">
					<view class="img-box" @click="goToGoodsDetail(item.productId)">
						<view class="goods-img">
							<image class="img" :src="item.picture" mode=""></image>
						</view>
						<view>
							<view class="goods-state">
								<view>{{item.name}}</view>
								<!-- 面包分类  手动烘焙商品 -->
								<block v-if="productClass == '0101' && item.bakeType == 1">
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
					<view class="state" :class="productClass != '0101' ? 'other-add-img' : ''">
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
							<text class="count-down">{{item.finishTime.substring(0, 5)}}</text>出炉
						</view>
						<!-- 烘烤中、已出炉、自动烘焙、其他分类商品 可进行预定 -->
						<block v-if="item.bakeState != 3">
							<!-- 未售罄 -->
							<view class="add-img"
								v-if="item.bakeState == 1 || item.bakeState == 2 || item.bakeType == 2 || productClass != '0101'">
								<view class="goods-num-box">
									<block v-if="item.num != 0">
										<view class="minus" @click.stop="reduceGoodsNum(item)">
											<image src="../../static/custome/reduce.png"></image>
										</view>
										<text class="goods-input">{{item.num}}</text>
									</block>
									<view class="plus" @click.stop="addGoodsNum(item)">
										<image src="../../static/goods/addIcon.png"></image>
									</view>
								</view>
								<!-- <block v-if="item.num == 0">
									<image src="../../static/goods/addIcon.png" mode="" @click.stop="addGoodsNum(item)">
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
					</view>
				</view>
			</view>
		</block>

	</view>
</template>

<script>
	import WaterfallsFlow from '../../components/WaterfallsFlow/WaterfallsFlow.vue'
	export default {
		data() {
			return {
				storeId: '',
				storeInfo: {},
				bakeList: [],
				pageIndex: 1,
				pageSize: 10,
				completed: false,
				sonRefresh: false,
				productName: '',
				selectGoodsList: [],
				empty: false,
				productClass: ''
			}
		},
		components: {
			WaterfallsFlow
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = this.storeInfo.id
			this.tomorrowStatus = options.tomorrowStatus == undefined ? true : ''
			this.productClass = options.productClass == undefined ? '' : options.productClass
		},
		methods: {
			/* 搜索商品 */
			searchGoods() {
				let selectGoodsList = uni.getStorageSync('selectGoodsList')
				console.log('selectGoodsList', selectGoodsList.length == 0)
				if (selectGoodsList.length !== 0) {
					this.selectGoodsList = selectGoodsList
				}
				this.pageIndex = 1
				this.completed = false
				this.bakeList = []
				this.getBakeList()
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
			},
			// 获取烘烤列表
			getBakeList() {
				let that = this
				if (!that.completed) {
					var myDate = new Date()
					let memuDate = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate()
					that.request({
						url: that.config.catalog,
						data: {
							storeId: that.storeId,
							pageIndex: that.pageIndex,
							pageSize: that.pageSize,
							sort: 'DESC',
							productClass: that.productClass,
							productName: that.productName,
							when: that.tomorrowStatus
						},
						method: 'GET'
					}).then(res => {
						console.log(res)
						if (res.statusCode == 200) {
							if (res.data.data[0].emEmuDetail.length == 0) {
								that.completed = true
							} else {
								// 计算烘烤剩余时间
								res.data.data[0].emEmuDetail.forEach(item => {
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
								})
								let bakeInfo = res.data.data[0]
								that.bakeList.push(...bakeInfo.emEmuDetail)
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
			addGoodsNum(item) {
				console.log('选中商品数量', item.num)
				if (item.num == 0) {
					item.num++
					this.selectGoodsList.push(item)
				} else {
					item.num++
					this.selectGoodsList.forEach(value => {
						if (item.id == value.id) {
							value.num = item.num
						}
					})
				}
				uni.setStorageSync('selectGoodsList', this.selectGoodsList)
			},
			/* 减少商品数量 */
			reduceGoodsNum(item) {
				let index
				item.num--
				this.selectGoodsList.forEach((value, i) => {
					if (value.id == item.id) {
						index = i
					}
				})
				this.selectGoodsList[index].num--
				if (item.num == 0) {
					this.selectGoodsList.splice(index, 1)
				}
				console.log('减少选中商品数量', this.selectGoodsList)
				uni.setStorageSync('selectGoodsList', this.selectGoodsList)
			},
			/* 增加商品数量 */
			changeAddGoodsNum(item) {
				item.num++
				this.selectGoodsList.forEach(value => {
					if (item.id == value.id) {
						value.num = item.num
					}
				})
				uni.setStorageSync('selectGoodsList', this.selectGoodsList)
			},
			/* 弹出商品详情 */
			goToGoodsDetail(id) {
				this.productsId = id
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

<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}
	
	.goods-num-box {
		display: flex;
		align-items: center;
	}
</style>
