<template>
	<view class="activity-cont">
		<view v-for="(item, index) in activityList" :key="index" class="activity-box">
			<view class="activity-info">
				<view class="activity-name">{{item.name}}</view>
				<view class="status" :class="[item.state == 0 ? 'nostart' : '', item.state == 2 ? 'finish' : '']">
					{{item.stateName}}
				</view>
			</view>
			<view class="activity-store">举办方：{{item.storeName}}</view>
			<view class="activity-info">
				<view class="activity-time">举办时间：{{item.beginDate}}-{{item.endDate}}</view>
				<view class="rule-desc" @click="openRuleDesc(item, index)">
					<image :src="imgUrl + 'rule.png'" mode=""></image>
					<view>规则说明</view>
				</view>
			</view>
			<block v-if="item.state != 0">
				<view class="unfold" v-if="!item.unfoldState" @click="unfoldActivity(item, index)">
					<image src="../../static/store/downArrow.png"></image>
					<view>展开</view>
				</view>
				<view class="unfold" v-else @click="unfoldActivity(item, index)">
					<image src="../../static/store/upArrow.png"></image>
					<view>收起</view>
				</view>
				<block v-if="item.unfoldState">
					<view class="draw-card-cont">
						<view class="draw-card-box">
							<image :src="imgUrl + 'drawCard.png'"></image>
							<view class="card-info">
								<view>抽卡次数</view>
								<view class="card-num"><text>{{item.availableCount}}</text> 次</view>
							</view>
							<view class="card-btn" @click="drawCard(item, index)">抽卡</view>
						</view>
						<view class="draw-card-box">
							<image :src="imgUrl + 'exchange.png'"></image>
							<view class="card-info">
								<view>集卡数量</view>
								<view class="card-num"><text class="exchange">{{item.cardCount}}</text> 张</view>
							</view>
							<view class="card-btn exchange-btn" @click="exchangeCard(item)">兑换</view>
						</view>
					</view>
					<view class="my-card-box">
						<block v-if="item.cardList.length != 0">
							<view class="card-tip">我的集卡</view>
							<view class="card-list">
								<view v-for="(card, index) in item.cardList" :key="index" class="card-box">
									<image :src="card.cardPicture" mode=""></image>
									<view class="card-count">{{card.count}}</view>
									<view class="">{{card.name}}</view>
								</view>
							</view>
						</block>
					</view>
					<view class="nav-box">
						<block v-for="(nav, navIndex) in navList" :key="navIndex">
							<view @click="changeNav(navIndex, item)" :class="navIdx == navIndex ? 'nav-active' : ''" class="nav">
								{{nav}}
							</view>
						</block>
					</view>
					<block v-if="navIdx == 0">
						<view class="lottery-head">
							<view class="lottery-time">时间</view>
							<view class="lottery-num">抽卡次数</view>
							<view class="lottery-card">卡片</view>
						</view>
						<view v-for="(record, index) in item.cardRightDetail" :key="index" class="lottery-detail">
							<view class="lottery-time">{{record.createTime}}</view>
							<view class="lottery-num">1</view>
							<view class="lottery-card">{{record.name}}*{{record.count}}</view>
						</view>
					</block>
					<block v-if="navIdx == 1">
						<view class="lottery-head">
							<view class="exchange-time">时间</view>
							<view class="exchange-num">兑换商品</view>
							<view class="exchange-card">卡片</view>
						</view>
						<view v-for="(record, index) in item.cardRightDetail" :key="index" class="lottery-detail">
							<view class="exchange-time">{{record.createTime}}</view>
							<view class="exchange-num">{{record.productName}}*{{record.productCount}}</view>
							<view class="exchange-card">{{record.cardListCount}}</view>
						</view>
					</block>
				</block>
			</block>
		</view>
		
		<view v-if="activityList.length == 0" class="empty-box">
			<image :src="imgUrl + 'empty.png'" mode="widthFix"></image>
			<view>暂无活动</view>
		</view>
		
		<!-- 兑换规则 -->
		<u-popup :show="ruleShow" @close="closeRuleShow" mode="center" round="10rpx">
			<view class="rule-box">
				<view class="rule-title">活动说明</view>
				<view class="rule-cont">{{activityDesc}}</view>
				<!-- <view class="know-box">
					<view class="select-goods" :class="knowState ? 'isSelect-goods' : ''"
						@click="selectKnow">
						<block v-if="knowState">
							<image src="../../static/store/check.png" mode=""></image>
						</block>
					</view>
					<view>我已知悉，不再提醒</view>
				</view> -->
				<view class="rule-btn-box" @click="closeRuleShow">关闭</view>
					<!-- <view>取消</view> -->
					<!-- <view class="confirm-rule" @click="closeRuleShow">确认</view> -->
			</view>
		</u-popup>
		
		<!-- 抽卡 -->
		<u-overlay :show="cardShow" @click="receiveCard">
			<view class="receive-card-box">
				<image class="animate__flipInY" :src="cardInfo.cardPicture"></image>
				<view class="receive-card" @click="receiveCard">开心收下</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				pageIndex: 1,
				pageSize: 10,
				ruleShow: false,
				activityList: [],
				cardList: [],
				navList: ['抽卡明细', '兑换明细'],
				navIdx: 0,
				cardRightDetail: [],
				// knowStateIdList: [],
				// knowState: false,
				// knowStateIdx: 0,
				cardInfo: {}, // 抽到的卡信息
				cardShow: false,
				activityDesc: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.getActivityList()
			// this.knowStateIdList = uni.getStorageSync('knowStateIdList') === '' ? [] : uni.getStorageSync('knowStateIdList')
			// console.log('已勾选活动2', this.knowStateIdList)
		},
		// onHide() {
		// 	this.knowStateIdList = []
		// 	this.activityList.forEach(item => {
		// 		if (item.knowState) {
		// 			this.knowStateIdList.push(item.id)
		// 		}
		// 	})
		// 	console.log('已勾选活动1', this.knowStateIdList)
		// 	uni.setStorageSync('knowStateIdList', this.knowStateIdList)
		// },
		// onUnload() {
		// 	this.knowStateIdList = []
		// 	this.activityList.forEach(item => {
		// 		if (item.knowState) {
		// 			this.knowStateIdList.push(item.id)
		// 		}
		// 	})
		// 	console.log('已勾选活动1', this.knowStateIdList)
		// 	uni.setStorageSync('knowStateIdList', this.knowStateIdList)
		// },
		methods: {
			/* 获取我的活动列表 */
			getActivityList(index) {
				let that = this
				that.request({
					url: that.config.userActivity,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (index == undefined) {
						data.forEach(item => {
							item.unfoldState = false
							item.cardRightDetail = []
							if (item.state == '1') {
								// 进行中的活动默认展开
								item.unfoldState = true
								that.getDrawRecord(item)
							}
						})
						that.activityList = data
					} else {
						data.forEach(item => {
							item.unfoldState = false
							item.cardRightDetail = []
						})
						console.log('抽卡', that.activityList[index])
						that.activityList = data
						that.activityList[index].unfoldState = true
						if (that.navIdx == 0) {
							// 抽卡明细
							that.getDrawRecord(that.activityList[index])
						} else {
							// 兑换明细
							that.getExchangeRecord(that.activityList[index])
						}
					}
				})
			},
			/* 展开收起 */
			unfoldActivity(item, index) {
				console.log('展开', item)
				item.unfoldState = !item.unfoldState
				if (item.unfoldState) {
					// 展开
					this.activityDesc = item.description
					// this.knowState = item.knowState
					// this.knowStateIdx = index
					// if (!item.knowState) {
					// 	this.ruleShow = true
					// }
					this.getDrawRecord(item)
				}
			},
			/* 获取抽卡记录 */
			getDrawRecord(item) {
				let that = this
				that.request({
					url: that.config.drawRecord,
					data: {
						id: item.id,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log('抽卡记录', res)
					item.cardRightDetail = res.data.data
				})
			},
			/* 获取兑换记录 */
			getExchangeRecord(item) {
				let that = this
				that.request({
					url: that.config.exchangeRecord,
					data: {
						id: item.id,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log('兑换记录', res)
					item.cardRightDetail = res.data.data
				})
			},
			changeNav(index, item) {
				if (index == 0) {
					// 抽卡记录
					this.getDrawRecord(item)
				} else {
					// 兑换记录
					this.getExchangeRecord(item)
				}
				this.navIdx = index
			},
			/* 打开规则说明 */
			openRuleDesc(item, index) {
				console.log('打开规则', item)
				this.ruleShow = true
				this.activityDesc = item.description
				// this.knowState = item.knowState
				// this.knowStateIdx = index
			},
			closeRuleShow() {
				this.ruleShow = false
			},
			/* 知晓规则 */
			// selectKnow() {
			// 	this.knowState = !this.knowState
			// 	this.activityList[this.knowStateIdx].knowState = this.knowState
			// },
			/* 取消知晓规则 */
			cancleRule() {
				uni.navigateBack()
			},
			/* 确认知晓规则 */
			// confirmRule() {
			// 	if (this.knowState) {
			// 		this.ruleShow = false
			// 	} else {
			// 		uni.showToast({
			// 			title: '请勾选“我已知悉不再提醒”',
			// 			icon: 'none'
			// 		})
			// 	}
			// },
			/* 抽卡 */
			drawCard(item, index) {
				let that = this
				uni.showLoading({
					title: '抽卡中'
				})
				that.request({
					url: that.config.drawCardInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						activityId: item.id
					}
				}).then(res => {
					uni.hideLoading()
					console.log('抽卡', res)
					if (res.data.code == '200000') {
						that.cardInfo = res.data.data
						that.cardShow = true
						that.getActivityList(index)
						if (that.navIdx == 0) {
							// 抽卡记录
							that.getDrawRecord(item)
						} else {
							// 兑换记录
							that.getExchangeRecord(item)
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 收卡 */
			receiveCard() {
				this.cardShow = false
			},
			/* 跳转兑换页面 */
			exchangeCard(item) {
				uni.navigateTo({
					url: '../selectExchange/selectExchange?id=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.activity-box {
		background-color: #fff;
		padding: 26rpx 24rpx;
		margin-top: 14rpx;
		font-size: 28rpx;
		color: #333;
	}

	.activity-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.activity-name {
		font-size: 28rpx;
		color: #333;
	}

	.status {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #7CD1F8;
		border: 1rpx solid #7CD1F8;
		background-color: #E5F6FE;
		font-size: 20rpx;
	}

	.status.nostart {
		color: #FFC263;
		border: 1rpx solid #FFC263;
		background-color: #FFF3E0;
	}

	.status.finish {
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
		background-color: #FCEEEB;
	}

	.activity-store {
		color: #999;
		font-size: 28rpx;
		padding: 18rpx 0;
	}

	.activity-time {
		color: #999;
		font-size: 28rpx;
	}

	.rule-desc {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.rule-desc image {
		width: 24rpx;
		height: 24rpx;
		margin-right: 6rpx;
	}

	.unfold {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 130rpx;
		height: 44rpx;
		border-radius: 50rpx;
		background-color: #F4F4F4;
		color: #333;
		font-size: 24rpx;
		margin: 20rpx auto 0;
	}

	.unfold image {
		width: 16rpx;
		height: 8rpx;
		margin-right: 8rpx;
	}

	.draw-card-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.draw-card-box {
		display: flex;
		align-items: center;
		padding: 34rpx 20rpx;
		border: 1rpx solid #eee;
		border-radius: 10rpx;
	}

	.draw-card-box image {
		width: 60rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}

	.card-btn {
		width: 88rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #fff;
		background-color: #7CD1F8;
		font-size: 24rpx;
		margin-left: 24rpx;
	}

	.card-btn.exchange-btn {
		background-color: #FFC263;
	}

	.card-info {
		color: #333;
		font-size: 28rpx;
	}

	.card-num {
		margin-top: 18rpx;
	}

	.card-num text {
		color: #7CD1F8;
		margin-right: 6rpx;
	}

	.card-num text.exchange {
		color: #FFC263;
	}

	.card-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.my-card-box {
		padding: 38rpx 0;
	}

	.card-tip {
		color: #333;
		font-size: 28rpx;
	}

	.card-box {
		position: relative;
		margin-right: 14rpx;
		margin-top: 38rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.card-box:nth-child(4n) {
		margin-right: 0;
	}

	.card-count {
		position: absolute;
		right: -6rpx;
		top: -12rpx;
		background-color: #F2AB99;
		color: #fff;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		font-size: 24rpx;
		text-align: center;
	}

	.card-box image {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		margin-bottom: 8rpx;
	}

	.nav-box {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		background-color: #fff;
		border: 1rpx solid #333;
	}

	.nav.nav-active {
		background-color: #333;
		color: #fff;
	}

	.nav:first-child {
		border-top-left-radius: 50rpx;
		border-bottom-left-radius: 50rpx;
	}

	.nav:nth-child(2) {
		border-top-right-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
	}

	.lottery-head {
		display: flex;
		align-items: center;
		text-align: center;
		font-size: 28rpx;
		color: #999;
		padding: 36rpx 0 26rpx;
	}

	.lottery-detail {
		display: flex;
		align-items: center;
		text-align: center;
		padding: 20rpx 0;
	}

	.lottery-time {
		width: 40%;
	}

	.lottery-num {
		width: 20%;
	}

	.lottery-card {
		width: 40%;
	}

	.exchange-time {
		width: 40%;
	}

	.exchange-num {
		width: 50%;
	}

	.exchange-card {
		width: 10%;
	}
	
	.know-box{
		display: flex;
		align-items: center;
		padding: 40rpx 0;
		color: #F2AB99;
		font-size: 24rpx;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
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

	.rule-box {
		padding: 40rpx;
	}

	.rule-title {
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 36rpx;
	}

	.rule-cont {
		font-size: 24rpx;
		color: #333;
		line-height: 36rpx;
	}

	.rule-btn-box {
		margin: 40rpx 0 0;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		background-color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	/* .rule-btn-box view {
		width: 222rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #F2AB99;
		font-size: 28rpx;
		border: 2rpx solid #F2AB99;
	}

	.rule-btn-box view.confirm-rule {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	} */
	
	.activity-cont>>> .u-popup__content{
		max-width: 540rpx;
	}
	
	.receive-card-box{
		margin: 200rpx auto 0;
	}
	
	.receive-card-box image{
		width: 540rpx;
		height: 720rpx;
		animation-duration: 2s;
		animation-delay: 0;
		animation-iteration-count: 1;
	}
	
	.receive-card{
		width: 260rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		background-color: #F2AB99;
		border-radius: 50rpx;
		font-size: 24rpx;
		margin: 40rpx auto 0;
	}
	
	.empty-box{
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-top: 260rpx;
	}
	
	.empty-box image{
		width: 96rpx;
		height: auto;
		margin-bottom: 30rpx;
	}
</style>
