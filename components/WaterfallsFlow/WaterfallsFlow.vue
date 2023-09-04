<template>
	<view class="wf-page">
		<!--    left    -->
		<view id="left" v-if="leftList.length">
			<view v-for="(item,index) in leftList" :key="index" class="wf-item" @tap="itemTap(item)"
				@click="goodsDetail(item)">
				<view class="goods-box">
					<view class="goods-img-box">
						<image :src="item.picture" mode="widthFix" class="goods-img" />
						<block v-if="item.label == 1">
							<image :src="imgUrl + 'newGood.png'" mode="widthFix" class="goods-label"></image>
						</block>
						<block v-if="item.label == 2">
							<image :src="imgUrl + 'hotGood.png'" mode="widthFix" class="goods-label"></image>
						</block>
						<block v-if="item.label == 3">
							<image :src="imgUrl + 'no1Label.png'" mode="widthFix" class="goods-label"></image>
						</block>
						<view class="goods-ename" v-if="item.ename != ''">{{item.ename}}</view>
						<block v-if="storeInfo.storeType == 2">
							<!-- 交易型 -->
							<block v-if="item.productClass == 1 && item.bakeType == 1">
								<view v-if="item.bakeState == 1" class="state-tag bake-load">
									<view>烘烤中</view>
									<view class="count-down-time">
										<yp-circle-progress :pro="item.remainTime" :size="50" :border_width="4"
											:animate="true">
											<view class="count-down-date">{{item.date}}</view>
										</yp-circle-progress>
										<block v-if="item.remainTimeList > 0">
											<block v-for="(time, idx) in item.remainTimeList" :key="idx">
												<yp-circle-progress pro="1" :size="50" :border_width="4"
													:animate="true">
													<view class="count-down-date">1H</view>
												</yp-circle-progress>
											</block>
										</block>
									</view>
								</view>
								<view v-if="item.bakeState == 2" class="state-tag out-ovn">
									已出炉
								</view>
							</block>
							<!-- 自动烘焙 -->
							<view v-else-if="item.bakeType == 2" class="state-tag">
								{{item.bakeTimeEnd}}出炉
							</view>
						</block>
					</view>
					<view class="store-info">
						<view class="goods-name">{{item.name}}</view>
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
						<view class="price-num">
							<view class="price">￥{{item.marketPrice}}</view>
							<view class="add-img">
								<block v-if="todayMenu && storeInfo.storeType == 1">
									<!-- 今日菜单 展示型 -->
									<block v-if="item.bakeState == 3">
										<view class="sell-out">售罄</view>
									</block>
									<block v-else-if="item.productClass == 1 && item.bakeType == 1">
										<view v-if="item.bakeState == 0" class="sell-out tag-nostart">
											未开始
										</view>
										<view v-if="item.bakeState == 1" class="sell-out tag-bake">
											烘烤中
										</view>
										<view v-if="item.bakeState == 2" class="sell-out tag-out">
											已出炉
										</view>
									</block>
									<!-- 自动烘焙 -->
									<view v-else-if="item.bakeType == 2" class="sell-out tag-nostart">
										{{item.bakeTimeEnd}}出炉
									</view>
								</block>
								<block v-if="!todayMenu">
									<block v-if="item.bakeState == 3">
										<view class="sell-out">售罄</view>
									</block>
									<!-- 面包分类 手动烘焙商品才有未开始状态 -->
									<block
										v-else-if="item.bakeState == 0 && item.productClass == '1' && item.bakeType == 1">
										<view class="sell-out tag-nostart">未开始</view>
									</block>
									<block v-else>
										<block v-if="!todayMenu">
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
												<image src="../../static/goods/addIcon.png"
													@click.stop="addGoodsNum(item)">
												</image>
											</block>
											<block v-else>
												<u-number-box v-model="item.num">
													<view slot="minus" class="minus" @click.stop="reduceGoodsNum(item)">
														<image src="../../static/custome/reduce.png"></image>
													</view>
													<text slot="input" class="goods-input">{{item.num}}</text>
													<view slot="plus" class="plus"
														@click.stop="changeAddGoodsNum(item)">
														<image src="../../static/goods/addIcon.png"></image>
													</view>
												</u-number-box>
											</block> -->
										</block>
									</block>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>


		<!--    right    -->
		<view id="right" v-if="rightList.length">
			<view v-for="(item,index) in rightList" :key="index" class="wf-item" @tap="itemTap(item)"
				@click="goodsDetail(item)">
				<view class="goods-box">
					<view class="goods-img-box">
						<image :src="item.picture" mode="widthFix" class="goods-img" />
						<block v-if="item.label == 1">
							<image :src="imgUrl + 'newGood.png'" mode="widthFix" class="goods-label"></image>
						</block>
						<block v-if="item.label == 2">
							<image :src="imgUrl + 'hotGood.png'" mode="widthFix" class="goods-label"></image>
						</block>
						<block v-if="item.label == 3">
							<image :src="imgUrl + 'no1Label.png'" mode="widthFix" class="goods-label"></image>
						</block>
						<view class="goods-ename" v-if="item.ename !== ''">{{item.ename}}</view>
						<block v-if="storeInfo.storeType == 2">
							<block v-if="item.productClass == 1 && item.bakeType == 1">
								<view v-if="item.bakeState == 1" class="state-tag bake-load">
									<view>烘烤中</view>
									<view class="count-down-time">
										<yp-circle-progress :pro="item.remainTime" :size="50" :border_width="4"
											:animate="true">
											<view class="count-down-date">{{item.date}}</view>
										</yp-circle-progress>
										<block v-if="item.remainTimeList > 0">
											<block v-for="(time, idx) in item.remainTimeList" :key="idx">
												<yp-circle-progress pro="1" :size="50" :border_width="4"
													:animate="true">
													<view class="count-down-date">1H</view>
												</yp-circle-progress>
											</block>
										</block>
									</view>
								</view>
								<view v-if="item.bakeState == 2" class="state-tag out-ovn">
									已出炉
								</view>
							</block>
							<!-- 自动烘焙 -->
							<view v-else-if="item.bakeType == 2" class="state-tag">
								{{item.bakeTimeEnd}}出炉
							</view>
						</block>
					</view>
					<view class="store-info">
						<view class="goods-name">{{item.name}}</view>
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
						<view class="price-num">
							<view class="price">￥{{item.marketPrice}}</view>
							<view class="add-img">
								<block v-if="todayMenu && storeInfo.storeType == 1">
									<!-- 今日菜单 -->
									<block v-if="item.bakeState == 3">
										<view class="sell-out">售罄</view>
									</block>
									<block v-else-if="item.productClass == 1 && item.bakeType == 1">
										<view v-if="item.bakeState == 0" class="sell-out tag-nostart">
											未开始
										</view>
										<view v-if="item.bakeState == 1" class="sell-out tag-bake">
											烘烤中
										</view>
										<view v-if="item.bakeState == 2" class="sell-out tag-out">
											已出炉
										</view>
									</block>
									<!-- 自动烘焙 -->
									<view v-else-if="item.bakeType == 2" class="sell-out tag-nostart">
										{{item.bakeTimeEnd}}出炉
									</view>
								</block>
								<block v-if="!todayMenu">
									<block v-if="item.bakeState == 3">
										<view class="sell-out">售罄</view>
									</block>
									<!-- 面包分类 手动烘焙商品才有未开始状态 -->
									<block
										v-else-if="item.bakeState == 0 && item.productClass == '1' && item.bakeType == 1">
										<view class="sell-out tag-nostart">未开始</view>
									</block>
									<block v-else>
										<block v-if="!todayMenu">
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
												<image src="../../static/goods/addIcon.png"
													@click.stop="addGoodsNum(item)">
												</image>
											</block>
											<block v-else>
												<u-number-box v-model="item.num">
													<view slot="minus" class="minus" @click.stop="reduceGoodsNum(item)">
														<image src="../../static/custome/reduce.png"></image>
													</view>
													<text slot="input" class="goods-input">{{item.num}}</text>
													<view slot="plus" class="plus"
														@click.stop="changeAddGoodsNum(item)">
														<image src="../../static/goods/addIcon.png"></image>
													</view>
												</u-number-box>
											</block> -->
										</block>
									</block>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ypCircleProgress from '@/components/yp-circle-progress/yp-circle-progress.vue'
	export default {
		props: {
			// 瀑布流列表
			wfList: {
				type: Array,
				require: true
			},
			updateNum: {
				type: Number,
				default: 10
			},
			todayMenu: {
				type: Boolean,
				default: false
			}
		},
		components: {
			ypCircleProgress
		},
		data() {
			return {
				allList: [], // 全部列表
				leftList: [], // 左边列表
				rightList: [], // 右边列表
				mark: 0, // 列表标记
				boxHeight: [], // 下标0和1分别为左列和右列高度
				imgUrl: this.config.imgUrl,
				storeInfo: {}
			};
		},
		watch: {
			// 监听列表数据变化
			wfList() {
				// 如果数据为空或新的列表数据少于旧的列表数据（通常为下拉刷新或切换排序或使用筛选器），初始化变量
				if (!this.wfList.length ||
					(this.wfList.length === this.updateNum && this.wfList.length <= this.allList.length)) {
					this.allList = [];
					this.leftList = [];
					this.rightList = [];
					this.boxHeight = [];
					this.mark = 0;
				}

				// 如果列表有值，调用waterfall方法
				if (this.wfList.length) {
					this.allList = this.wfList;
					this.waterFall()
				}
			},

			// 监听标记，当标记发生变化，则执行下一个item排序
			mark() {
				const len = this.allList.length;
				if (this.mark < len && this.mark !== 0) {
					this.waterFall();
				}
			}
		},
		mounted() {
			this.storeInfo = uni.getStorageSync('storeInfo')
		},
		methods: {
			/* 增加商品数量 */
			addGoodsNum(item) {
				this.$emit('addGoodsNum', item)
			},
			/* 减少商品数量 */
			reduceGoodsNum(item) {
				this.$emit('reduceGoodsNum', item)
			},
			/* 改变商品数量 */
			changeAddGoodsNum(item) {
				this.$emit('changeAddGoodsNum', item)
			},
			/* 商品详情 */
			goodsDetail(item) {
				this.$emit('goToGoodsDetail', item.productId)
			},
			// 瀑布流排序
			waterFall() {
				const i = this.mark;
				if (i === 0) {
					// 初始化，从左边开始插入
					this.leftList.push(this.allList[i]);
					// 更新左边列表高度
					this.getViewHeight(0);
				} else if (i === 1) {
					// 第二个item插入，默认为右边插入
					this.rightList.push(this.allList[i]);
					// 更新右边列表高度
					this.getViewHeight(1);
				} else {
					// 根据左右列表高度判断下一个item应该插入哪边
					const leftOrRight = this.boxHeight[0] > this.boxHeight[1] ? 1 : 0;
					if (leftOrRight) {
						this.rightList.push(this.allList[i])
					} else {
						this.leftList.push(this.allList[i])
					}
					// 更新插入列表高度
					this.getViewHeight(leftOrRight);
				}
			},
			// 获取列表高度
			getViewHeight(leftOrRight) {
				const query = uni.createSelectorQuery().in(this);
				const id = leftOrRight ? '#right' : '#left';
				// 使用nextTick，确保页面更新结束后，再请求高度
				this.$nextTick(() => {
					query.select(id).boundingClientRect(res => {
						res ? this.boxHeight[leftOrRight] = res.height : '';
						this.mark = this.mark + 1;
					}).exec();
				})
			},
			// item点击
			itemTap(item) {
				this.$emit('itemTap', item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$page-padding: 10px;
	$grid-gap: 10px;

	.wf-page {
		display: flex;
		align-items: flex-start;
		grid-template-columns: 1fr 1fr;
		grid-gap: $grid-gap;
		padding: 0 24rpx;
	}

	.wf-item {
		width: calc((100vw - 2 * #{$page-padding} - #{$grid-gap}) / 2);
		padding-bottom: $grid-gap;
	}

	.goods-box {
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 4rpx 4rpx 10rpx rgba(0, 0, 0, .2);
		overflow: hidden;
	}

	.goods-img-box {
		position: relative;
	}

	.goods-img {
		width: 100%;
		height: auto;
		display: block;
	}

	.goods-label {
		position: absolute;
		left: 20rpx;
		top: 20rpx;
		width: 66rpx;
		height: auto;
	}

	.goods-ename {
		background-color: rgba(0, 0, 0, .4);
		color: #fff;
		text-align: center;
		font-size: 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.store-info {
		padding: 26rpx 20rpx 20rpx;
		color: #333;
		font-size: 28rpx;
		// display: flex;
		// align-items: center;
		// justify-content: space-between;
		// height: 100rpx;
	}

	.weight-cal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 20rpx;
		color: #999;
		margin: 10rpx 0;
	}

	.weight-box {
		display: flex;
		align-items: center;
	}

	.price-num {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.add-img image {
		width: 44rpx;
		height: 44rpx;
		display: block;
	}

	.goods-input {
		width: 80rpx;
		text-align: center;
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

	.state-tag {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		color: #fff;
		font-size: 20rpx;
		background-color: #FFC263;
		padding: 0 20rpx;
		border-radius: 50rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
	}

	.state-tag.out-ovn {
		background-color: #7CD1F8;
	}

	.state-tag.bake-load {
		height: 106rpx;
		background-color: #F2AB99;
		top: 0;
		padding-top: 10rpx;
		border-radius: 0 0 10rpx 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
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
</style>
