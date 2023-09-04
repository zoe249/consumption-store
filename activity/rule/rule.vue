<template>
	<view>
		<!-- <view class="add-rule" @tap="$u.throttle(addRule, 500)">
			<view class="add-img">
				<image src="../../static/goods/addIcon.png" mode=""></image>
			</view>
			<view>新增规则</view>
		</view> -->
		<!-- <view v-for="(rule, ruleIdx) in ruleList" :key="ruleIdx" class="rule-cont"> -->
		<view class="rule-cont">
			<view class="shadow-box" v-if="!editState"></view>
			<!-- <view class="exchange-rule">
				<view v-if="ruleIdx == 0">兑换规则A</view>
				<view v-if="ruleIdx == 1">兑换规则B</view>
				<view v-if="ruleIdx == 2">兑换规则C</view>
				<image src="../../static/goods/closeIcon.png" mode="" @click="deleteRule(ruleIdx)"></image>
			</view> -->
			<view class="rule-box">
				<!-- <view class="card-require-box">
					<view>卡片要求</view>
					<view class="card-require">
						<view v-for="(item, index) in repetitionTypeList" :key="index" class="rule-type"
							:class="rule.repetitionType == item.id ? 'select-rule-type' : ''"
							@click="selectCardRequire(index, ruleIdx)">{{item.name}}</view>
					</view>
				</view> -->
				<view class="card-kind-box">
					<view class="card-kind-title">卡片种类</view>
					<view class="card-cont">
						<!-- <view v-for="(item, index) in cardList" :key="index" class="week-box"
							:class="item.select ? 'week-active' : ''" @click="selectCard(item)">{{item.name}}</view> -->
						<view v-for="(item, idx) in cardList" :key="idx" class="card-box">
							<image :src="item.cardPicture" class="card-img"></image>
							<!-- <view>{{item.name}}</view> -->
							<!-- <view class="select-goods">
								<block v-if="item.select">
									<image src="../../static/store/check.png" mode=""></image>
								</block>
							</view> -->
						</view>
					</view>
				</view>
				<!-- <view class="card-require-box">
					<view>集卡数量</view>
					<view class="card-num" @click="openCardNumShow(ruleIdx)">
						<view v-if="rule.cardQuantity == 0">请选择集卡数量</view>
						<view v-else>{{rule.cardQuantity}}</view>
						<image src="../../static/store/setArrow.png"></image>
					</view>
				</view> -->
				<view class="card-require-box">
					<view>兑换方式</view>
					<view class="card-require">
						<view v-for="(item, index) in exchangeTypeList" :key="index" class="rule-type"
							:class="awardType == item.id ? 'select-rule-type' : ''"
							@click="selectExchangeType(index)">{{item.name}}</view>
					</view>
				</view>
				<view class="card-require-box" v-if="awardType == 1">
					<view>按商品金额</view>
					<view class="card-num" @click="openGoodsAmountShow">
						<view v-if="amount === ''">请选择指定商品金额</view>
						<view v-else>{{amount}}元以下</view>
						<image src="../../static/store/setArrow.png"></image>
					</view>
				</view>
				<view class="card-require-box" v-if="awardType == 2">
					<view>按商品</view>
					<view class="card-num" @click="goSelectGoods">
						<view v-if="selectGoodsIdList.length == 0">请选择指定商品</view>
						<block v-else>
							<view>{{selectGoods}}</view>
						</block>
						<image src="../../static/store/setArrow.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="save-btn" @tap="$u.throttle(saveRule, 500)" v-if="editState">保存</view>

		<!-- 集卡数量 -->
		<!-- <u-popup :show="cardNumShow" @close="closeCardNumShow" :closeable="true">
			<view class="add-title">集卡数量</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="cardNumValue" @change="bindCardNumChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in cardNumList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('1')">自定义</view>
				<view @click="confirmCardNum">确定</view>
			</view>
		</u-popup> -->

		<!-- 指定商品金额 -->
		<u-popup :show="goodsAmountShow" @close="closeGoodsAmountShow" :closeable="true">
			<view class="add-title">指定商品金额</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="goodsAmountValue" @change="bindGoodsAmountChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in goodsAmountList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('2')">自定义</view>
				<view @click="confirmGoodsAmount">确定</view>
			</view>
		</u-popup>

		<!-- 自定义输入框 -->
		<u-popup :show="definitionShow" @close="closeDefinitionShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<input type="digit" v-model="definitionValue" placeholder="请输入自定义"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="closeDefinitionShow">取消</view>
					<view class="confirm-btn" @click="confirmDefinition">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardList: [],
				exchangeTypeList: [{
					id: 1,
					name: '按金额'
				}, {
					id: 2,
					name: '按商品'
				}],
				exchangeType: '',
				exchangeTypeIdx: 0,
				indicatorStyle: `height: 70rpx;`,
				cardNum: 0,
				cardNumShow: false, // 集卡数量弹出框
				cardNumList: ['3', '4', '5'], // 卡片种类列表
				cardNumIdx: 0,
				cardNumValue: [0],
				cardIdx: 0,
				goodsAmount: '',
				goodsAmountShow: false, // 指定商品金额弹出框
				goodsAmountList: ['10元以下', '15元以下', '20元以下'], // 卡片种类列表
				goodsAmountIdx: 0,
				goodsAmountValue: [0],
				definitionShow: false, // 自定义弹出框
				definitionType: '',
				definitionValue: '',
				activityId: '', // 活动id
				ruleList: [],
				_ruleList: [], // 备份规则列表
				deleteRuleList: [], // 删除规则列表
				selectGoodsIdList: [],
				selectGoods: '',
				selectGoodsIndex: 0,
				storeId: '',
				state: '', // 活动类型
				activityInfo: {}, // 创建活动基本信息
				editState: false,
				awardType: 1, // 兑换方式，默认指定金额1
				amount: 10, // 指定金额，默认10
				ruleId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.activityId = options.id == undefined ? '' : options.id
			this.storeId = options.storeId
			this.state = options.state
			if (this.state == '0') {
				// 只有未开始的活动才能进行编辑
				this.editState = true
			}
			if (options.activityInfo !== undefined) {
				this.activityInfo = JSON.parse(options.activityInfo)
				console.log('活动集合', this.activityInfo)
				this.cardList = this.activityInfo.cardList
			}
			if (this.activityId !== '') {
				this.getAcitivityRuleInfo()
			// } else {
			// 	this.ruleList.push({
			// 		awardType: 1,
			// 		amount: parseFloat(this.goodsAmountList[0]),
			// 		productList: [],
			// 		// cardQuantity: this.cardNumList[0],
			// 		cardNumIdx: 0,
			// 		detailFlag: 'added'
			// 	})
			}
		},
		// onShow() {
		// 	if (this.selectGoodsIdList.length !== 0) {
		// 		this.ruleList[this.selectGoodsIndex].selectGoods = this.selectGoods
		// 		this.ruleList[this.selectGoodsIndex].selectGoodsIdList = this.selectGoodsIdList
		// 	}
		// },
		methods: {
			getAcitivityRuleInfo() {
				let that = this
				that.request({
					url: `${that.config.activityList}/${this.activityId}/changeRule`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.changeRuleList.length == 0) {
						// 无规则，新建规则，图片状态不改变，初始状态始终为false,默认图片全选
						// that.ruleList.push({
						// 	awardType: 1,
						// 	amount: parseFloat(this.goodsAmountList[0]),
						// 	productList: [],
						// 	// cardQuantity: this.cardNumList[0],
						// 	cardNumIdx: 0,
						// 	detailFlag: 'added'
						// })
					} else {
						// 有规则
						let ruleInfo = data.changeRuleList[0]
						that.cardList = ruleInfo.cardList
						that.amount = ruleInfo.amount
						that.awardType = ruleInfo.awardType
						ruleInfo.productList.forEach(item => {
							that.selectGoodsIdList.push(item.id)
							that.selectGoods = item.name
						})
						that.ruleId = ruleInfo.id


						// 多规则
						// // 有规则，与已选卡片列表比较
						// console.log('卡片集合', data.activityCardList)
						// data.ruleList.forEach(item => {
						// 	item.activityCardList = data.activityCardList
						// 	item.selectGoods = ''
						// 	item.selectGoodsIdList = []
						// 	item.editState = false
						// 	if (that.state == '0') {
						// 		// 只有未开始的活动才能进行编辑
						// 		item.editState = true
						// 	}
						// })
						// // data.ruleList.forEach(item => {
						// // 	item.activityCardList = data.activityCardList
						// // 	item.activityCardList.forEach(img => {
						// // 		img.select = false
						// // 	})
						// // })
						// that.ruleList = JSON.parse(JSON.stringify(data.ruleList)) // 规则集合
						// that._ruleList = JSON.parse(JSON.stringify(data.ruleList)) // 规则集合
						// that.ruleList.forEach(item => {
						// 	item.detailFlag = 'modified'
						// 	item.activityCardList.forEach(value => {
						// 		item.cardList.forEach(card => {
						// 			if (card.id == value.id) {
						// 				value.select = true
						// 			}
						// 		})
						// 	})
						// 	let arr = []
						// 	let goodsIdArr = []
						// 	item.productList.forEach(goods => {
						// 		arr.push(goods.name)
						// 		item.selectGoods = arr.join('、')
						// 		goodsIdArr.push(goods.id)
						// 		item.selectGoodsIdList = goodsIdArr
						// 	})
						// })
						// console.log('规则集合', that.ruleList)
					}
					// that.cardList = data.activityCardList // 卡片集合
				})
			},
			/* 选择卡片要求 */
			// selectCardRequire(idx, index) {
			// 	this.ruleList[index].repetitionType = this.repetitionTypeList[idx].id
			// },
			/* 选择卡片 */
			// selectCard(item) {
			// 	console.log(item)
			// 	item.select = !item.select
			// },
			/* 选择兑换方式 */
			selectExchangeType(idx) {
				this.awardType = this.exchangeTypeList[idx].id
				this.amount = parseFloat(this.goodsAmountList[0])
			},
			/* 打开集卡数量 */
			// openCardNumShow(index) {
			// 	this.cardIdx = index
			// 	this.cardNumValue = [this.ruleList[index].cardNumValue]
			// 	this.cardNumShow = true
			// },
			// closeCardNumShow() {
			// 	this.cardNumShow = false
			// },
			// bindCardNumChange(e) {
			// 	console.log(e)
			// 	this.ruleList[this.cardIdx].cardNumIdx = e.detail.value[0]
			// },
			// confirmCardNum() {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 	setTimeout(() => {
			// 		uni.hideLoading()
			// 		this.ruleList[this.cardIdx].cardQuantity = parseInt(this.cardNumList[this.ruleList[this
			// 				.cardIdx]
			// 			.cardNumIdx])
			// 		this.cardNumShow = false
			// 	}, 1000)
			// },
			/* 打开指定商品金额 */
			openGoodsAmountShow() {
				// this.amountIdx = index
				this.goodsAmountValue = [0]
				this.goodsAmountShow = true
			},
			closeGoodsAmountShow() {
				this.goodsAmountShow = false
			},
			bindGoodsAmountChange(e) {
				this.goodsAmountIdx = e.detail.value[0]
			},
			confirmGoodsAmount() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.amount = parseFloat(this.goodsAmountList[this.goodsAmountIdx])
					this.goodsAmountShow = false
				}, 1000)
			},
			/* 自定义弹出框 */
			openDefinitionShow(type) {
				this.definitionType = type
				this.definitionValue = ''
				// if (type == '1') {
				// 	// 集卡数量
				// 	this.cardNumShow = false
				// } else
				if (type == '2') {
					// 指定商品金额
					this.goodsAmountShow = false
				}
				this.definitionShow = true
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				// if (this.definitionType == '1') {
				// 	// 集卡数量
				// 	this.ruleList[this.cardIdx].cardQuantity = parseInt(this.definitionValue)
				// } else 
				if (this.definitionType == '2') {
					// 指定商品金额
					this.amount = parseInt(this.definitionValue)
				}
				this.definitionShow = false
			},
			/* 新增规则 */
			// addRule() {
			// 	if (this.ruleList.length == 3) {
			// 		uni.showToast({
			// 			title: '最多创建3条规则',
			// 			icon: 'none'
			// 		})
			// 	} else {
			// 		let arr = JSON.parse(JSON.stringify(this.cardList))
			// 		arr.forEach(item => {
			// 			item.select = true
			// 		})
			// 		this.ruleList.push({
			// 			// repetitionType: 1,
			// 			awardType: 1,
			// 			cardQuantity: this.cardNumList[0],
			// 			cardNumIdx: 0,
			// 			amount: parseFloat(this.goodsAmountList[0]),
			// 			productList: [],
			// 			detailFlag: 'added',
			// 			activityCardList: arr,
			// 			selectGoods: '',
			// 			selectGoodsIdList: [],
			// 			editState: true
			// 		})
			// 		console.log('新增', this.ruleList)
			// 	}
			// },
			/* 删除规则 */
			// deleteRule(index) {
			// 	if (this.ruleList.length == 1) {
			// 		uni.showToast({
			// 			title: '至少创建1条规则',
			// 			icon: 'none'
			// 		})
			// 	} else {
			// 		this.deleteRuleList.push({
			// 			id: this.ruleList[index].id,
			// 			detailFlag: 'deleted'
			// 		})
			// 		this.ruleList.splice(index, 1)
			// 	}
			// },
			/* 保存规则 */
			saveRule() {
				let that = this
				uni.showLoading({
					title: '保存中'
				})
				// that.addActivityShow = false
				
				// 多条规则
				// var cardArr = []
				// that.ruleList.forEach(value => {
				// 	cardArr = []
				// 	// 选择的卡片集合
				// 	value.activityCardList.forEach(item => {
				// 		if (item.select) {
				// 			cardArr.push(item.id)
				// 			console.log('cardArr', cardArr)
				// 			value.cardIdList = cardArr
				// 		}
				// 	})
				// 	// if (value.repetitionType == '2') {
				// 	// 	value.cardQuantity = value.cardIdList.length
				// 	// }
				// })
				// console.log('ruleList', that.ruleList)
				// console.log('_ruleList', that._ruleList)
				// let arr = []
				// let flag = false
				// that.ruleList.forEach((item, i) => {
				// 	if (that._ruleList != undefined) {
				// 		// 判断是否已修改规则
				// 		that._ruleList.forEach((rule, j) => {
				// 			if (that.ruleList[j].cardQuantity == that._ruleList[j].cardQuantity && that.ruleList[j].awardType == that._ruleList[j].awardType &&
				// 				that.ruleList[j].amount == that._ruleList[j].amount
				// 			) {
				// 				flag = true
				// 				that.ruleList[j].detailFlag = 'unchanged'
				// 			} else {
				// 				if (flag) {
				// 					that.ruleList[j].cardList.forEach((card, c) => {
				// 						that._ruleList[j].cardList.forEach((cardd, d) => {
				// 							if (that.ruleList[j].cardList[c].id == that._ruleList[j].cardList[c].id) {
				// 								that.ruleList[j].detailFlag = 'unchanged'
				// 							} else {
				// 								that.ruleList[j].detailFlag = 'modified'
				// 							}
				// 						})
				// 					})
				// 					that.ruleList[j].productList.forEach((card, c) => {
				// 						that._ruleList[j].productList.forEach((cardd, d) => {
				// 							if (that.ruleList[j].productList[c] == that._ruleList[j].productList[c]) {
				// 								that.ruleList[j].detailFlag = 'unchanged'
				// 							} else {
				// 								that.ruleList[j].detailFlag = 'modified'
				// 							}
				// 						})
				// 					})
				// 				} else {
				// 					that.ruleList[j].detailFlag = 'modified'
				// 				}
				// 			}
				// 		})
				// 	}
				// 	arr.push({
				// 		// repetitionType: (item.repetitionType).toString(),
				// 		cardList: item.cardIdList,
				// 		cardQuantity: item.cardQuantity,
				// 		awardType: (item.awardType).toString(),
				// 		amount: item.amount,
				// 		productList: item.selectGoodsIdList,
				// 		detailFlag: item.detailFlag
				// 	})
				// })
				// that.deleteRuleList.forEach(drule => {
				// 	arr.push({
				// 		id: drule.id,
				// 		detailFlag: 'deleted',
				// 		// repetitionType: '',
				// 		cardList: [''],
				// 		cardQuantity: 1,
				// 		awardType: '',
				// 		amount: 1,
				// 		productList: []
				// 	})
				// })
				if (that.activityId === '') {
					that.addRule() // 新建活动规则
				} else {
					that.editRule() // 修改活动规则
				}
			},
			/* 修改活动规则 */
			editRule() {
				let that = this
				// let cardArr = []
				// that.cardList.forEach(item => {
				// 	cardArr.push(item.id)
				// })
				if (that.awardType == 1) {
					// 指定金额
					that.selectGoodsIdList = []
				} else if (that.awardType == 2) {
					// 指定商品
					that.amount = ''
				}
				let arr = []
				arr.push({
					id: that.ruleId,
					awardType: that.awardType,
					amount: that.amount,
					productList: that.selectGoodsIdList,
					detailFlag: 'modified'
				})
				that.request({
					url: `${that.config.editActivity}/${that.activityId}/changeRule`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						changeRuleList: arr
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 新建活动规则 */
			addRule() {
				let that = this
				// 单规则
				// let cardArr = []
				// that.cardList.forEach(item => {
				// 	if (item.select) {
				// 		cardArr.push({
				// 			cardPicture: item.cardPicture
				// 		})
				// 	}
				// })
				if (that.awardType == 1) {
					// 指定金额
					that.selectGoodsIdList = []
				} else if (that.awardType == 2) {
					// 指定商品
					that.amount = ''
				}
				let arr = []
				arr.push({
					awardType: that.awardType,
					amount: that.amount,
					productList: that.selectGoodsIdList,
					detailFlag: 'added'
				})
				that.request({
					url: `${that.config.editActivity}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						beginDate: that.activityInfo.beginDate,
						endDate: that.activityInfo.endDate,
						thresholdValue: that.activityInfo.thresholdValue,
						description: that.activityInfo.description,
						classType: that.activityInfo.classType,
						cardList: that.cardList,
						changeRuleList: arr,
						countdown: 14, // 进入倒计时天数,默认14
						countdownTime: 30, // 倒计时提示天数,默认30
						confirmTime: '15,16' // 确认提醒天数，默认15
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 选择商品 */
			goSelectGoods(index) {
				// this.addActivityShow = false
				uni.navigateTo({
					url: '../selectGoods/selectGoods?index=' + index + '&storeId=' + this.storeId
				})
			},
			/* 删除活动 */
			deleteActivity() {
				let that = this
				that.request({
					url: `${that.config.editActivity}/${that.activityId}`,
					method: 'DELETE',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						// uni.showToast({
						// 	title: '删除成功',
						// 	icon: 'none'
						// })
						// setTimeout(() => {
						// 	uni.navigateBack()
						// }, 2000)
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
	.add-rule {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		background-color: #fff;
		padding: 40rpx 0;
		margin: 20rpx 24rpx;
		border: 2rpx dashed #F2AB99;
		border-radius: 16rpx;
		line-height: 40rpx;
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

	.rule-cont {
		position: relative;
	}

	.shadow-box {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, .3);
		z-index: 23;
	}

	.exchange-rule {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22rpx 24rpx;
	}

	.exchange-rule image {
		width: 30rpx;
		height: 30rpx;
	}

	.rule-box {
		background-color: #fff;
		padding: 0 24rpx;
	}

	.card-require-box {
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.card-require-box:last-child {
		border-bottom: 0;
	}

	.card-require {
		display: flex;
		align-items: center;
	}

	.rule-type {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-left: 14rpx;
		background-color: #EBEBEB;
		color: #999;
		border: 2rpx solid #999;
	}

	.rule-type.select-rule-type {
		background-color: #FCEEEB;
		color: #F2AB99;
		border-color: #F2AB99;
	}

	.card-kind-box {
		padding: 20rpx 0 0;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.card-kind-title {
		min-width: 116rpx;
		margin-bottom: 20rpx;
	}

	.card-cont {
		display: flex;
		flex-wrap: wrap;
	}

	.card-box {
		width: 164rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
		position: relative;
		margin-right: 14rpx;
	}

	.card-box:nth-child(4n) {
		margin-right: 0;
	}

	.card-img {
		width: 160rpx;
		height: 220rpx;
		border-radius: 10rpx;
		margin-bottom: 18rpx;
		border: 1rpx solid #eee;
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
		color: #F2AB99;
	}

	.isSelect-goods image {
		border: 1rpx solid #F2AB99;
	}

	.isSelect-goods .select-goods {
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-num {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #ccc;
	}

	.card-num image {
		width: 8rpx;
		height: 16rpx;
		margin-left: 10rpx;
	}

	.save-btn {
		margin: 40rpx 24rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.add-title {
		background-color: #F4F4F4;
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.picker-view {
		height: 300rpx;
	}

	.item {
		height: 70rpx;
		line-height: 70rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.select-btn-box {
		margin: 22rpx 24rpx;
	}

	.select-btn-box view {
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50rpx;
		font-size: 28rpx;
		margin-top: 26rpx;
	}

	.select-btn-box view.definition-btn {
		background-color: #fff;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	.cont>>>.u-popup__content__close--top-right {
		top: 24rpx;
		right: 24rpx;
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
		width: 172rpx;
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

	.week-box {
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		border: 1rpx solid #999;
		background-color: #EBEBEB;
		text-align: center;
		margin: 0 0 20rpx 14rpx;
	}

	.week-box.week-active {
		border: 1rpx solid #F2AB99;
		color: #F2AB99;
		background-color: #FCEEEB;
	}
</style>
