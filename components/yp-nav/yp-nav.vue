<template>
	<view>
		<view class="nav-box" :style="{ 'padding-top': statusBarHeight + 9 + 'px'}"
			:class="(custome || dailyMenu || goodsReverse) ? 'custome-bg' : ''">
			<view @click="goBack" v-if="!shareState">
				<u-icon name="arrow-left" :color="color" size="20"></u-icon>
			</view>
			<view v-if="shareState" @click="goHome">
				<u-icon name="home" :color="color" size="20"></u-icon>
			</view>
			<view>{{title}}</view>
			<view style="width: 20rpx;">
				<view v-if="goodsReverse" class="search-icon" @click="goSearchGoods">
					<u-icon name="search" size="20"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				color: '#fff',
				storeId: ''
			}
		},
		props: {
			title: String,
			shareState: Boolean,
			custome: Boolean,
			loginState: {
				type: Boolean,
				default: true
			},
			dailyMenu: {
				type: Boolean,
				default: false
			},
			storeHome: {
				type: Boolean,
				default: false
			},
			goodsReverse: {
				type: Boolean,
				default: false
			},
			tomorrowStatus: {
				type: Boolean,
				default: false
			},
			productClass: String
		},
		mounted() {
			this.login = this.loginState
			this.storeId = uni.getStorageSync('storeInfo') == null ? '' : uni.getStorageSync('storeInfo').id
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					console.log('系统信息', res)
					that.statusBarHeight = res.statusBarHeight
				}
			})
			if (this.custome || this.dailyMenu || this.goodsReverse) {
				this.color = '#333'
			}
		},
		methods: {
			goBack() {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId + '&storeHome=' + this
							.storeHome + '&dailyMenu=' + this
							.dailyMenu + '&goodsReverse=' + this.goodsReverse
					})
				} else {
					uni.navigateBack()
				}
			},
			/* 返回顾客端 */
			goHome() {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId + '&storeHome=' + this
							.storeHome + '&dailyMenu=' + this
							.dailyMenu + '&goodsReverse=' + this.goodsReverse
					})
				} else {
					uni.reLaunch({
						url: '/custom/home/index/index?storeId=' + this.storeId
					})
				}
			},
			/* 跳转搜索页 */
			goSearchGoods() {
				if (!this.loginState) {
					// 未登录注册
					uni.reLaunch({
						url: '/pages/startUp/login/login?storeId=' + this.storeId + '&storeHome=' + this
							.storeHome + '&dailyMenu=' + this
							.dailyMenu + '&goodsReverse=' + this.goodsReverse
					})
				} else {
					uni.navigateTo({
						url: '/custom/search/search?tomorrowStatus=' + this.tomorrowStatus + '&productClass=' + this.productClass
					})
				}
			}
		}
	}
</script>

<style scoped>
	.nav-box {
		background-color: #F2AB99;
		color: #fff;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 38rpx 24rpx;
	}

	.nav-box.custome-bg {
		background-color: #fff;
		color: #333;
	}
	
	.search-icon{
		position: relative;
		right: 220rpx;
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		border: 2rpx solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
