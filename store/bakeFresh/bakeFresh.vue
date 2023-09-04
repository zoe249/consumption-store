<template>
	<view>
		<u-sticky>
			<yp-nav title="商品状态"></yp-nav>
		</u-sticky>
		<view class="wrap-content" v-if="isShow">
			<view class="head">
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
			<view class="bake-tip">注：长按商品图片可直接出炉</view>
			<view class="nav-box">
				<u-tabs :list="goodsClassList" lineColor="#F2AB99" activeStyle="color: #F2AB99;"
					@click="changeGoodsClass"></u-tabs>
				<view @click="changeStockState" v-if="storeInfo.storeType == 2 || storeInfo.storeType == 4">数量管理</view>
			</view>
			<!-- 烘烤列表 -->
			<view class="bake">
				<view class="bake-item" v-for="(item, index) in bakeList" :key="item.id"
					@longpress="openReleasedAdvance(item)">
					<!-- 已出炉商品 -->
					<button class="img-box" open-type="share" :id="index" v-if="item.bakeState == 2">
						<view class="goods-img">
							<image class="img" :src="item.picture" mode=""></image>
						</view>
						<view>
							<!-- 面包分类商品 -->
							<view class="goods-state">
								<view>{{item.name}}</view>
								<block v-if="item.productClass == '0101' && item.bakeType == 1">
									<view v-if="item.bakeState == 1" class="tag tag-bake">
										烘烤中
									</view>
									<view v-if="item.bakeState == 2" class="tag tag-out">
										已出炉
									</view>
									<view v-if="item.bakeState == 3" class="tag tag-end">
										卖光了
									</view>
								</block>
							</view>
							<view class="price-stock">
								<view class="price">￥{{item.marketPrice}}</view>
								<!-- 交易版旗舰版存在库存概念 -->
								<view class="goods-stock" v-if="!stockManage && (storeInfo.storeType == 2 || storeInfo.storeType == 4)">
									库存：{{item.productInventory}}</view>
							</view>
						</view>
					</button>
					<view class="img-box" v-else>
						<view class="goods-img">
							<image class="img" :src="item.picture" mode=""></image>
						</view>
						<view>
							<!-- 面包分类商品 -->
							<view class="goods-state">
								<view>{{item.name}}</view>
								<block v-if="item.productClass == '0101' && item.bakeType == 1">
									<view v-if="item.bakeState == 1" class="tag tag-bake">
										烘烤中
									</view>
									<view v-if="item.bakeState == 2" class="tag tag-out">
										已出炉
									</view>
									<view v-if="item.bakeState == 3" class="tag tag-end">
										卖光了
									</view>
								</block>
							</view>
							<view class="price-stock">
								<view class="price">￥{{item.marketPrice}}</view>
								<!-- 交易版旗舰版存在库存概念 -->
								<view class="goods-stock" v-if="!stockManage && (storeInfo.storeType == 2 || storeInfo.storeType == 4)">
									库存：{{item.productInventory}}</view>
							</view>
						</view>
					</view>
					<view class="state">
						<block v-if="stockManage">
							<u-number-box v-model="item.productInventory" :min="0"></u-number-box>
						</block>
						<block v-if="!stockManage">
							<!-- 面包分类商品  手动烘焙商品 -->
							<block v-if="item.productClass == '0101' && item.bakeType == 1">
								<!-- 未烘烤 -->
								<view class="before" v-if="item.bakeState == 0">
									<view class="btn" @click.stop='clickBake(item.id,index)'>开始烘烤</view>
									<view class="time"></view>
								</view>
								<!-- 烘烤中 -->
								<view class="bakeing" v-if="item.bakeState == 1 && item.dateTime != 0">
									<block v-if="item.dateTime < 60">
										<view class="count-down-box"><text
												class="count-down">{{item.dateTime}}</text>分钟后出炉
										</view>
									</block>
									<block v-else>
										<view class="count-down-box">
											<text class="count-down">{{item.remainTimeList}}</text>小时
											<text class="count-down">{{item.date}}</text>分钟后出炉
										</view>
									</block>
									<view class="count-down-time">
										<yp-circle-progress :percent="item.remainTime * 100" :size="22" :circleWidth="4"
											circleColor="#F2AB99" :animate="true">
											<span slot="content" class="count-down-date">{{item.date}}</span>
										</yp-circle-progress>
										<block v-if="item.remainTimeList > 0">
											<block v-for="(time, idx) in item.remainTimeList" :key="idx">
												<yp-circle-progress percent="100" :size="22" :circleWidth="4"
													:animate="true">
													<span slot="content" class="count-down-date">1H</span>
												</yp-circle-progress>>
											</block>
										</block>
									</view>
								</view>
							</block>
							<!-- 烘烤中  自动烘焙 -->
							<block v-if="item.bakeState == 1 && item.bakeType == 2">
								<view class="bakeing" v-if="item.bakeState == 1 && item.dateTime != 0">
									<block v-if="item.dateTime < 60">
										<view class="count-down-box"><text
												class="count-down">{{item.dateTime}}</text>分钟后出炉
										</view>
									</block>
									<block v-else>
										<view class="count-down-box">
											<text class="count-down">{{item.remainTimeList}}</text>小时
											<text class="count-down">{{item.date}}</text>分钟后出炉
										</view>
									</block>
									<view class="count-down-time">
										<yp-circle-progress :percent="item.remainTime * 100" :size="22" :circleWidth="4"
											circleColor="#F2AB99" :animate="true">
											<span slot="content" class="count-down-date">{{item.date}}</span>
										</yp-circle-progress>
										<block v-if="item.remainTimeList > 0">
											<block v-for="(time, idx) in item.remainTimeList" :key="idx">
												<yp-circle-progress percent="100" :size="22" :circleWidth="4"
													:animate="true">
													<span slot="content" class="count-down-date">1H</span>
												</yp-circle-progress>
											</block>
										</block>
									</view>
								</view>
							</block>
							<!-- 已出炉 -->
							<!-- 其他分类商品直接出炉 -->
							<view class="end" v-if="item.bakeState != 1">
								<!-- 不是烘烤中商品 -->
								<!-- 面包分类 手动烘焙 已出炉 -->
								<view class="finish-time"
									v-if="item.productClass == '0101' && item.bakeState == 2 && item.bakeType == 1">
									<text class="count-down">{{item.finishTime}}</text>出炉
								</view>
								<!-- 自动烘焙 非售罄情况 -->
								<view class="finish-time"
									v-if="item.productClass == '0101' && item.bakeType == 2 && item.bakeState != 3">
									<text class="count-down">{{item.bakeTimeEnd}}</text>出炉
								</view>
								<!-- 其他分类商品 非售罄 || 面包分类商品 已出炉 -->
								<view class="sell-out" @click.stop="sellOutGoods(item.id)"
									v-if="(item.productClass != '0101' && item.bakeState != 3) || (item.productClass == '0101' && item.bakeState == 2)">
									<u-switch inactiveColor="#fff" activeColor="#fff" v-model="selledState" :space="4">
									</u-switch>
									<view class="selled-tip">在售</view>
								</view>
							</view>
							<!-- 卖光了 -->
							<view v-if="item.bakeState == 3" class="sell-out-box">
								<u-switch inactiveColor="#fff" activeColor="#fff" v-model="selloutState" :space="4">
								</u-switch>
								<view class="sell-out-tip" @click="editGoodsStock(item.emEmuDetailId, 99)">售罄</view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view v-if="stockManage" class="save-btn" @click="saveGoodsStock">保存</view>
			<!-- 确认按钮弹出 -->
			<u-popup :show="confrimView" mode="center" :round="10">
				<view class="popup-content">
					是否开始烘烤
					<view class="popup-btn">
						<view class="cancel btn" @click="closeConfrim">再想想</view>
						<view class="confrim btn" @click="bake">确定</view>
					</view>
				</view>
			</u-popup>
			<!-- 确认按钮弹出 -->
			<u-popup :show="sellOutView" mode="center" :round="10">
				<view class="popup-content">
					是否已卖光
					<view class="popup-btn">
						<view class="cancel btn" @click="closeSellOut">再想想</view>
						<view class="confrim btn" @click="save">确定</view>
					</view>
				</view>
			</u-popup>

			<!-- 提前出炉 -->
			<u-modal :show="bakeFinishShow" title="是否直接出炉？" content="商品状态变为已出炉状态" confirmText="是" cancelText="否"
				:showCancelButton="true" confirmColor="#F2AB99" @confirm="releasedAdvance"
				@cancel="closeReleasedAdvance"></u-modal>
		</view>

		<!-- 空数据 -->
		<view class="wrap-title" v-else>
			<image class="default" src="../../static/store/default.png" mode="widthFix"></image>
			<view>您今日未设置菜单</view>
		</view>
	</view>
</template>

<script>
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	import ypCircleProgress from '@/components/yp-circle-progress/yp-circle-progress.vue'
	export default {
		data() {
			return {
				storeInfo: {},
				storeId: '',
				isShow: false,
				bakeInfo: {},
				bakeList: [], // 烘烤列表
				confrimView: false, // 确认烘烤弹出层
				sellOutView: false, // 确认售罄弹出层
				pageIndex: 1,
				pageSize: 20,
				completed: false,
				bakeFinishShow: false, // 提前出炉
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
				selledState: true,
				selloutState: false,
				stockManage: false
			}
		},
		components: {
			ypNav,
			ypCircleProgress
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
			}
		},
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex++
				var myDate = new Date()
				let memuDate = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate()
				that.request({
					url: that.config.catalog,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						sort: 'ASC',
						productClass: that.productClass
					},
					method: 'GET'
				}).then(res => {
					if (res.statusCode == 200) {
						const data = res.data.data[0].emEmuDetail
						if (data.length == 0) {
							that.completed = true
						} else {
							this.isShow = true
							this.bakeInfo = data[0]
							data[0].emEmuDetail.forEach(item => {
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
								if (item.productClass == '0101' && item.bakeState == 2 && item.bakeType == 1) {
									item.finishTime = item.finishTime.substring(0, 5)
								}
							})
							this.bakeList.push(...this.bakeInfo.emEmuDetail)
						}
					}
				})
			}
		},
		onPullDownRefresh() {
			this.getBakeList()
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			this.productClass = this.goodsClassList[0].value
			this.getBakeList()
		},
		onShareAppMessage(res) {
			let item = this.bakeList[res.target.id]
			console.log(item)
			// 已出炉
			return {
				title: item.name,
				imageUrl: item.cardPicture,
				path: '/custom/fresh/fresh?storeId=' + this.storeId + '&shareState=true&receivingWay=1&goodsId=' + item
					.productId + '&bakeState=' + item.backState
			}
		},
		methods: {
			// 获取烘烤列表
			getBakeList() {
				let that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				that.pageIndex = 1
				that.bakeList = []
				var myDate = new Date()
				let memuDate = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate()
				that.request({
					url: that.config.catalog,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						sort: 'ASC',
						productClass: that.productClass
					}
				}).then(res => {
					uni.hideLoading()
					if (res.statusCode == 200) {
						this.isShow = true
						this.bakeInfo = res.data.data[0]
						res.data.data[0].emEmuDetail.forEach(item => {
							if (item.bakeState == 1) {
								item.dateTime = that.getDate(memuDate + ' ' + item.finishTime)
								item.remainTime = (parseInt(item.dateTime) / 60).toFixed(2)
								item.remainTimeList = Math.ceil(item.remainTime) - 1
								if (item.dateTime > 60) {
									item.date = item.dateTime - item.remainTimeList * 60
									if (item.date < 10) {
										item.date = '0' + item.date
									}
									console.log('剩余时间', item.date)
									item.remainTime = (parseInt(item.date) / 60).toFixed(2)
								} else {
									item.date = item.dateTime
								}
							}
							if (item.productClass == '0101' && item.bakeState == 2 && item.bakeType == 1) {
								item.finishTime = item.finishTime.substring(0, 5)
							}
						})
						this.bakeList = this.bakeInfo.emEmuDetail
					}
				})
			},
			getDate(time) {
				var nowTime = +new Date(); //当前时间总毫秒数
				var inputTime = new Date(time); //用户输入时间总毫秒数
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
			/* 开始烘烤 */
			clickBake(id, index) {
				this.id = id
				this.openConfrim()
				return
			},
			// 售罄
			sellOutGoods(id) {
				// console.log('this.selledState', this.selledState)
				// console.log('this.selloutState', this.selloutState)
				this.id = id
				this.selledState = true
				this.selloutState = false
				this.openSellOut()
				// this.confrimView = true
			},
			// 弹出确认按钮
			openConfrim() {
				this.confrimView = true
			},
			// 弹出确认按钮
			openSellOut() {
				this.sellOutView = true
			},
			// 关闭确认按钮
			closeConfrim() {
				this.confrimView = false
			},
			// 关闭确认按钮
			closeSellOut() {
				this.sellOutView = false
				// this.selledState = true
				// this.selloutState = false
			},
			// 确定 开始烘烤
			bake() {
				// 关闭弹出层
				this.closeConfrim()
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let that = this
				// 开始烘烤
				that.request({
					url: `${that.config.catalog}/${that.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					uni.hideLoading()
					// 重新获取烘烤列表
					this.getBakeList()
				})
			},
			// 确定 售罄
			save() {
				// 关闭弹出层
				this.closeSellOut()
				let that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				// 售罄
				that.request({
					url: `${that.config.sellOut}/${that.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					uni.hideLoading()
					this.getBakeList()
				})
			},
			/* 打开提前出炉弹出框 */
			openReleasedAdvance(item) {
				if (this.productClass == '0101') {
					if (item.bakeState == 0 || item.bakeState == 1) {
						// 未开始或烘烤中
						this.bakeFinishShow = true
						this.id = item.id
					}
				}
			},
			closeReleasedAdvance() {
				this.bakeFinishShow = false
			},
			/* 提前出炉 */
			releasedAdvance() {
				let that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				that.request({
					url: `${that.config.releasedAdvance}/${that.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log('出炉', res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						that.bakeFinishShow = false
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.getBakeList()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			/* 切换商品分类 */
			changeGoodsClass(item) {
				console.log(item)
				this.productClass = item.value
				this.pageIndex = 1
				this.bakeList = []
				this.getBakeList()
			},
			changeStockState() {
				this.stockManage = !this.stockManage
			},
			/* 库存编辑 */
			saveGoodsStock() {
				this.bakeList.forEach(item => {
					this.editGoodsStock(item.emEmuDetailId, item.productInventory)
				})
			},
			editGoodsStock(id, stock) {
				let that = this
				that.request({
					url: `${that.config.menuGoodsList}/${id}/productInventory`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Transaction-No': new Date().getTime()
					},
					data: {
						productInventory: stock
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.stockManage = false
							that.getBakeList()
						}, 2000)
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
	.head {
		padding: 20rpx 24rpx 20rpx 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
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
		background-color: #fff;
		margin-bottom: 14rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
		font-size: 28rpx;
		padding: 0 24rpx 0 0;
	}

	.bake-tip {
		color: #999;
		font-size: 24rpx;
		padding: 0 0 20rpx 10rpx;
	}

	.bake-item {
		margin-bottom: 14rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 20rpx 24rpx;

	}

	.img-box {
		display: flex;
		align-items: center;
		background-color: transparent;
		/* width: 60%; */
		margin: 0;
		padding: 0;
		text-align: unset;
		line-height: unset;
	}

	.bake-item button::after {
		border: none;
	}

	.goods-img {
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
	}

	.goods-img image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
	}

	.goods-state {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.bake-item .state {
		min-width: 160rpx;
		text-align: center;
	}

	.state .time {
		font-size: 24rpx;
	}

	.state .btn {
		border-radius: 30rpx;
	}

	/* 烘烤前 */
	.before .btn {
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #7CD1F8;
		color: #FFFFFF;
	}

	/* 烘烤中 */
	.bakeing {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.state .bakeing .btn {
		background-color: #ff1d00;
		color: #FFFFFF;
	}

	.state .bakeing .time {
		color: #333333;
	}

	.count-down-box {
		margin-bottom: 22rpx;
	}

	.count-down-time {
		display: flex;
		align-items: center;
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

	/* 已出炉 */
	.state .end .btn {
		background-color: #ff4d00;
		color: #FFFFFF;
		width: 45%;
	}

	.end-btn {
		display: flex;
		justify-content: space-between;
	}

	.state .end .time {
		color: #ff4d00;
	}

	/* 售罄 */
	.out-btn {
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #FFFFFF;
		background: #F2AB99;
		margin-top: 16rpx;
		width: 160rpx;
	}

	.wrap-title {
		text-align: center;
		margin: 436rpx auto 0;
		font-size: 28rpx;
		color: #333;
	}

	.default {
		width: 96rpx;
		height: auto;
		margin-bottom: 40rpx;
	}

	/* 弹出层 */
	.popup-content {
		padding: 20rpx 20rpx;
		padding-top: 50rpx;
		height: 250rpx;
		width: 600rpx;
		text-align: center;
	}

	.popup-btn {
		display: flex;
		justify-content: space-around;
	}

	.popup-btn .btn {
		margin: 20rpx 20rpx;
		margin-top: 60rpx;
		background-color: #ffc900;
		border: 2rpx solid #000000;
		width: 170rpx;
		height: 60rpx;
		border-radius: 15rpx;
		font-size: 32rpx;
		line-height: 60rpx;
	}

	.popup-btn .confrim {
		color: #c55a2d;
		font-weight: 600;
	}

	.popup-btn .cancel {
		color: #000;
	}

	.tag {
		font-size: 20rpx;
		border-radius: 50rpx;
		padding: 0 10rpx;
		margin-left: 14rpx;
		height: 32rpx;
		line-height: 32rpx;
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

	.wrap-content>>>.u-modal__content__text {
		text-align: center;
		color: #999;
	}

	.end {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.sell-out {
		margin-top: 20rpx;
		position: relative;
	}

	.selled-tip {
		position: absolute;
		bottom: 8rpx;
		right: 18rpx;
		font-size: 24rpx;
	}

	.sell-out-box {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		position: relative;
	}

	.sell-out-tip {
		position: absolute;
		bottom: 8rpx;
		right: 46rpx;
		font-size: 24rpx;
		color: #ccc;
	}

	.bake .sell-out>>>.u-switch {
		border: 4rpx solid #333 !important;
	}

	.sell-out>>>.u-switch__node.u-switch__node--on {
		background-color: #F2AB99;
		transform: translateX(-68rpx) !important;
	}

	.bake>>>.u-switch {
		background-color: #fff !important;
		border: 4rpx solid #ccc !important;
		width: 112rpx !important;
		height: 46rpx !important;
	}

	.bake>>>.u-switch__bg {
		background-color: #fff !important;
	}

	.bake>>>.u-switch__node {
		background-color: #ccc;
		width: 30rpx !important;
		height: 30rpx !important;
		transform: translateX(-6rpx) !important;
		box-shadow: unset !important;
	}

	.save-btn {
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		font-size: 28rpx;
		margin: 40rpx 24rpx;
	}

	.price-stock {
		display: flex;
		align-items: center;
		padding-top: 24rpx;
		font-size: 24rpx;
	}
	
	.goods-stock{
		margin-left: 20rpx;
		font-size: 24rpx;
		color: #999;
	}
</style>