<template>
	<view>
		<block v-if="emptyState">
			<view class="no-activity">
				<image :src="imgUrl + 'noActivity.png'" mode="widthFix"></image>
				<view>游戏即将推出，敬请期待</view>
			</view>
		</block>
		<block v-else>
			<view class="store-card-box">
				<view class="store-card-time-box">
					<view class="store-card">
						<view class="store-logo">
							<image :src="storeInfo.logo" mode=""></image>
						</view>
						<view class="store-name-time">
							<view>{{storeInfo.name}}</view>
							<view class="store-time">{{beginDate}}至{{endDate}}</view>
						</view>
					</view>
					<view class="view-card-detail" @click="goCardDetailList">集卡明细</view>
				</view>
				<view class="rule-box">
					<view class="rule-icon">
						<image :src="imgUrl + 'rule.png'" mode="widthFix"></image>
						<view>说明：</view>
					</view>
					<view>
						<view>①、单笔消费满{{activityInfo.thresholdValue}}元可集卡一张；</view>
						<view>②、须到店兑换。</view>
					</view>
				</view>
			</view>
			<view class="card-detail" v-for="(value, index) in activityInfo.changeRuleList" :key="index">
				<view class="nav-card-list">
					<view v-for="(card, index) in value.cardList" :key="index" class="nav-card-box">
						<image src="../../static/custome/defaultCard.png" v-if="card.count == 0"></image>
						<image :src="card.cardPicture" v-else></image>
					</view>
				</view>
				<view class="change-right" :class="value.state ? 'change-card-box' : ''">
					<view class="goods-box" v-if="ruleInfo.productList != null">
						<image :src="changeProductImg" mode=""></image>
						<view class="goods-name">{{exchangeGoods}}</view>
					</view>
					<view v-else class="goods-type-price">
						<view class="award-price-box">
							<text class="award-price">{{ruleInfo.amount}}</text>元以下商品
						</view>
					</view>
					<block v-if="value.state">
						<view class="card-num-tip">集卡成功</view>
						<view class="collect-btn change-btn" @click="saveExchange">去兑换</view>
					</block>
					<block v-else>
						<view class="card-num-tip">还差{{ruleInfo.cardList.length - cardNum}}张卡</view>
						<view class="collect-btn" @click="goCustomHome">去集卡</view>
					</block>
				</view>
			</view>
		</block>
		
		<!-- 兑换二维码 -->
		<view v-if="qrcodeShow" class="qrcode-box" @touchmove.stop.prevent="stopRoll">
			<view class="custom-qrcode">
				<view>请向商家出示二维码进行核销</view>
				<view class="qrcode-img">
					<yp-qrcode :text="qrcodeCont" :size="size" :quality="quality"></yp-qrcode>
				</view>
				<view class="qrcode-tip">
					<image :src="imgUrl + 'rule.png'"></image>
					<view>核销后卡片将从账户中扣除</view>
				</view>
				<view class="close-qrcode" @click="closeQrcode">关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				indicatorDots: false,
				interval: 2000,
				duration: 500,
				swiperIdx: 0,
				storeId: '',
				activityInfo: {},
				pageIndex: 1,
				pageSize: 10,
				activityList: [],
				beginDate: '',
				endDate: '',
				cardList: [],
				cardNum: 0,
				ruleInfo: {},
				storeInfo: {},
				changeProductImg: '',
				exchangeGoods: '',
				collectCardList: [],
				qrcodeShow: false,
				qrcodeCont: '', // 要生成的二维码值
				size: 250,
				quality: 'L',
				userInfo: {},
				productId: '',
				ruleId: '',
				emptyState: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.userInfo = uni.getStorageSync('userInfo')
			this.getUserActivityList(this.storeId)
			this.getActivityInfo(this.storeId)
			this.getStoreInfo()
		},
		methods: {
			/* 切换游戏 */
			changeActivity(e) {
				this.swiperIdx = e.detail.current
				let storeId = this.activityList[this.swiperIdx].storeId
				this.getActivityInfo(storeId)
			},
			/* 获取用户活动列表 */
			getUserActivityList(storeId) {
				let that = this
				that.request({
					url: that.config.userActivity,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						state: 1
					},
				}).then(res => {
					let data = res.data.data
					that.activityList = data
					if (parseInt(storeId) > 0) {
						// 查看游戏详情
						data.forEach((item, i) => {
							if (item.storeId == storeId) {
								that.swiperIdx = i
							}
						})
					} else {
						that.getActivityInfo(data[0].storeId)
					}
				})
			},
			/* 获取门店进行中的集卡游戏详情 */
			getActivityInfo(storeId) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let that = this
				that.request({
					url: `${that.config.activityList}/${storeId}/detailOfOngoingActivity`
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					const data = res.data.data
					that.activityInfo = data
					if (data.id == null) {
						that.emptyState = true
					} else {
						that.emptyState = false
					}
					that.ruleInfo = data.changeRuleList[0]
					that.ruleId = that.ruleInfo.id
					that.productId = that.ruleInfo.productId
					that.beginDate = data.beginDate.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
					that.beginDate = that.beginDate.slice(0, 11)
					that.endDate = data.endDate.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
					that.endDate = that.endDate.slice(0, 11)
					that.cardList = data.changeRuleList[0].cardList
					if (data.changeRuleList[0].productList != null) {
						let productList = data.changeRuleList[0].productList[0]
						if (that.ruleInfo.awardType == '2') {
							that.exchangeGoods = productList.name
							that.changeProductImg = productList.picture
						}
					}

					if (that.cardList.length !== 0) {
						that.collectCardList = []
						that.collectCard()
					}
				})
			},
			/* 集卡片组 */
			collectCard() {
				let cardFlag = true
				let arr = []
				this.cardList.forEach(item => {
					if (item.count == 0) {
						// 未集齐卡片
						cardFlag = false
						arr.push(item)
					}
				})
				this.cardNum = this.cardList.length - arr.length
				if (cardFlag) {
					// 满足卡片集齐条件
					this.cardList.forEach(item => {
						item.count--
					})
					this.collectCardList.push('集齐')
					this.collectCard()
					
					let cardList = JSON.parse(JSON.stringify(this.cardList))
					cardList.forEach(card => {
						card.count = 1
					})
					if (this.collectCardList.length != 0) {
						console.log('插入新集卡 进度')
						this.activityInfo.changeRuleList.unshift({
							cardList: cardList,
							state: true
						})
					}
					console.log('cardList', this.cardList)
					console.log('collectCardList', this.collectCardList)
					console.log('changeRuleList', this.activityInfo.changeRuleList)
				}
			},
			/* 跳转集卡明细 */
			goCardDetailList() {
				uni.navigateTo({
					url: '../cardList/detail'
				})
			},
			/* 兑换 */
			saveExchange() {
				let that = this
				that.request({
					url: that.config.cardExchanges,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						openId: that.userInfo.openId,
						ruleId: that.ruleId,
						productId: that.productId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.verifyQrcodeShow = true
						let userInfo = {
							openId: that.userInfo.openId,
							ruleId: that.ruleId,
							productId: that.productId
						}
						that.qrcodeCont = JSON.stringify(userInfo)
						that.qrcodeShow = true
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取门店信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					console.log('门店信息', res)
					let data = res.data.data
					that.storeInfo = data
				})
			},
			/* 跳转顾客端主页 */
			goCustomHome() {
				uni.navigateTo({
					url: '/custom/home/index/index?storeId=' + this.storeId
				})
			},
			closeQrcode(){
				this.qrcodeShow = false
			}
		}
	}
</script>

<style scoped>
	.no-activity {
		margin: 280rpx auto 0;
		text-align: center;
		font-size: 40rpx;
		color: #333;
	}

	.no-activity image {
		width: 108rpx;
		height: auto;
		margin-bottom: 52rpx;
	}

	.store-card-box {
		background-color: #fff;
		padding: 26rpx 24rpx;
	}

	.store-card-time-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.store-card {
		display: flex;
		align-items: center;
	}

	.store-logo {
		margin-right: 20rpx;
	}

	.store-logo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: block;
	}

	.store-name-time {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.store-time {
		color: #999;
		font-weight: normal;
		font-size: 24rpx;
		padding-top: 12rpx;
	}

	.view-card-detail {
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		color: #fff;
		background-color: #333;
		font-size: 28rpx;
		border-radius: 50rpx;
	}

	.rule-box {
		display: flex;
		font-size: 24rpx;
		color: #999;
		padding: 30rpx 0 0;
		line-height: 36rpx;
	}

	.rule-icon {
		display: flex;
	}

	.rule-icon image {
		width: 24rpx;
		height: auto;
		margin: 8rpx 10rpx 0 0;
		min-width: 24rpx;
	}

	.card-detail {
		display: flex;
		justify-content: space-between;
		margin: 14rpx 24rpx;
	}

	.nav-card-list {
		display: flex;
		flex-wrap: wrap;
		width: 486rpx;
		background-color: #fff;
		padding: 20rpx 0 0 20rpx;
		border-radius: 10rpx 0 0 10rpx;
		margin-right: 14rpx;
	}

	.nav-card-box {
		margin: 0 14rpx 20rpx 0;
	}

	.nav-card-box image {
		width: 140rpx;
		height: 188rpx;
		display: block;
	}

	.change-right {
		width: 200rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 0 10rpx 10rpx 0;
		padding: 20rpx 0;
	}

	.change-right.change-card-box {
		background-color: #FCEEEB;
	}

	.goods-box {
		position: relative;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.goods-box image {
		width: 160rpx;
		height: 160rpx;
		display: block;
	}

	.goods-name {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .5);
		color: #fff;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 20rpx;
		text-align: center;
	}

	.card-num-tip {
		padding: 20rpx 0;
	}

	.collect-btn {
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
		font-size: 28rpx;
		border-radius: 50rpx;
	}

	.collect-btn.change-btn {
		background-color: #F2AB99;
		color: #fff;
	}
	
	/* 二维码 */
	.qrcode-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 9999;
	}
	
	.custom-qrcode {
		text-align: center;
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
		margin: 150rpx 0 0;
	}
	
	.qrcode-img {
		margin: 60rpx auto 40rpx;
		width: 600rpx;
		height: 600rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #ccc;
	}
	
	.custom-qrcode>>>.canvas-qrcode {
		float: unset !important;
	}
	
	.qrcode-tip {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
		font-size: 28rpx;
	}
	
	.qrcode-tip image {
		width: 24rpx;
		height: 24rpx;
		padding-right: 14rpx;
	}
	
	.close-qrcode {
		position: fixed;
		left: 24rpx;
		right: 24rpx;
		bottom: 40rpx;
		border-radius: 50rpx;
		border: 1rpx solid #FDB193;
		color: #FDB193;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
	
	.goods-type-price{
		background-color: #E3D09E;
		color: #fff;
		width: 94rpx;
		height: 94rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	
	.award-price-box{
		width: 80rpx;
		height: 80rpx;
	}
	
	.award-price{
		font-size: 28rpx;
	}
</style>
