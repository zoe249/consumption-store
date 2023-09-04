<template>
	<view>
		<image :src="imgUrl + 'chouka.png'" mode="widthFix" class="chouka"></image>
		<view class="draw-card">
			<view class="draw-card-btn" @click="drawCard">抽卡</view>
			<view class="exchange-tip" @click="changeRecordShow">明细</view>
		</view>
		<view class="card-box" v-if="cardRecordShow">
			<view class="lottery-head">
				<view class="lottery-time">时间</view>
				<view class="lottery-time">卡片</view>
			</view>
			<view v-for="(record, index) in drawCardList" :key="index" class="lottery-head">
				<view class="lottery-time">{{record.createTime}}</view>
				<view class="lottery-time">{{record.name}}*{{record.count}}</view>
			</view>
		</view>

		<!-- 抽卡 -->
		<u-overlay :show="cardShow" @click="receiveCard">
			<view class="receive-card-box">
				<image class="animate__flipInY" :src="cardInfo.cardPicture"></image>
				<view class="receive-btn">
					<view class="review-card" @click="reviewCard">查看卡片</view>
					<view class="" @click="drawCard">继续抽奖({{availableCount}})</view>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				drawCardList: [],
				activityId: '',
				pageIndex: 1,
				pageSize: 10,
				cardShow: false,
				cardInfo: {}, // 卡片信息
				cardRecordShow: false,
				storeId: '',
				availableCount: 0
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.activityId = options.activityId
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getDrawRecord()
		},
		methods: {
			/* 获取抽卡记录 */
			getDrawRecord() {
				let that = this
				that.request({
					url: that.config.drawRecord,
					data: {
						id: that.activityId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log('抽卡记录', res)
					that.drawCardList = res.data.data
				})
			},
			/* 抽卡 */
			drawCard() {
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
						activityId: that.activityId
					}
				}).then(res => {
					uni.hideLoading()
					console.log('抽卡', res)
					if (res.data.code == '200000') {
						that.cardInfo = res.data.data
						that.getActivityInfo()
						that.cardShow = true
						// 抽卡记录
						that.getDrawRecord()
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
			changeRecordShow() {
				this.cardRecordShow = !this.cardRecordShow
			},
			/* 查看卡片 */
			reviewCard() {
				uni.navigateTo({
					url: '../exchange/exchange'
				})
			},
			/* 获取门店进行中的集卡游戏详情 */
			getActivityInfo() {
				let that = this
				that.request({
					url: `${that.config.activityList}/${that.storeId}/detailOfOngoingActivity`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.availableCount = data.availableCount
				})
			},
		}
	}
</script>

<style>
	page {
		background-image: url(https://qiaokun.yuepong.com/hongbei/choukabg.png);
		background-repeat: no-repeat;
		background-size: 100%;
		background-color: #fff;
	}
</style>

<style scoped>
	.chouka {
		width: 100%;
		height: auto;
		margin: 48rpx 0 0;
	}

	.draw-card {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.draw-card-btn {
		width: 270rpx;
		height: 270rpx;
		border-radius: 50%;
		text-align: center;
		font-size: 80rpx;
		color: #fff;
		background: linear-gradient(to right, #FFA49A, #FF9662);
		box-shadow: #FFC8B0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: -30rpx;
	}

	.exchange-tip {
		margin: 40rpx 0;
		display: block;
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1rpx solid #333;
		color: #333;
		font-size: 28rpx;
		border-radius: 50rpx;
	}

	.card-box {
		background-color: rgba(255, 255, 255, .5);
		margin: 0 24rpx;
	}

	.lottery-head {
		display: flex;
		align-items: center;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin: 40rpx 0;
	}

	.lottery-detail {
		display: flex;
		align-items: center;
		text-align: center;
		padding: 20rpx 0;
	}

	.lottery-time {
		width: 50%;
	}

	.activity-cont>>>.u-popup__content {
		max-width: 540rpx;
	}

	.receive-card-box {
		margin: 200rpx auto 0;
	}

	.receive-card-box image {
		width: 540rpx;
		height: 720rpx;
		animation-duration: 2s;
		animation-delay: 0;
		animation-iteration-count: 1;
	}
	
	.receive-btn{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.receive-btn view {
		width: 260rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		background-color: #F2AB99;
		border-radius: 50rpx;
		font-size: 24rpx;
		margin: 40rpx auto 0;
		border: 1rpx solid #F2AB99;
	}
	
	.receive-btn view.review-card{
		color: #F2AB99;
		background-color: transparent;
		margin-right: 20rpx;
	}
</style>
