<template>
	<view>
		<map :style="'width: 100%; height: ' + windowHeight + 'px;'" :latitude="latitude" :longitude="longitude" :markers="covers"
			:enable-traffic="true">
		</map>
		<view class="store-info-box">
			<view class="store-name-box">
				<view class="store-name">{{storeInfo.name}}</view>
				<view class="store-state" :class="storeInfo.businessState ? '' : 'store-rest'">
					<block v-if="storeInfo.businessState">营业中</block>
					<block v-if="!storeInfo.businessState">休息中</block>
				</view>
			</view>
			<view class="store-address-box">
				<view class="store-address">
					{{storeInfo.state}}{{storeInfo.city}}{{storeInfo.district}}{{storeInfo.address}}
				</view>
				<view class="store-distance">
					<u-icon name="map-fill" color="#ccc" size="12"></u-icon>
					<view v-if="storeInfo.distance < 1">距您{{storeInfo.distance * 1000}}m</view>
					<view v-else>距您{{storeInfo.distance}}km</view>
				</view>
			</view>
			<view @click="location" class="nav-btn">到这里</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: '',
				longitude: '',
				covers: [{
					id: 1,
					latitude: '',
					longitude: '',
					iconPath: '/static/custome/local.png',
					width: 18,
					height: 23
				}], // 地图标记点配置
				storeId: '',
				storeInfo: {},
				customerLongitude: '',
				customerLatitude: '',
				windowHeight: 0
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			let that = this
			uni.getSystemInfo({
				success: function (res) {
					console.log(res)
					that.windowHeight = res.windowHeight
				}
			});
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that.customerLongitude = res.longitude
					that.customerLatitude = res.latitude
				}
			})
			that.getStoreInfo()
		},
		methods: {
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: that.config.stores +
						`/${this.storeId}?customerLongitude=${that.customerLongitude}&customerLatitude=${that.customerLatitude}`
				}).then((res) => {
					console.log('门店信息', res)
					const data = res.data.data
					that.storeInfo = data
					that.latitude = data.latitude
					that.longitude = data.longitude
					that.covers[0].latitude = data.latitude
					that.covers[0].longitude = data.longitude
					setTimeout(() => {
						that.loading = false
					}, 1000)
				})
			},
			/* 使用应用内置地图查看位置 */
			location() {
				let that = this
				let latitude = parseFloat(that.latitude)
				let longitude = parseFloat(that.longitude)
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function(res) {
						console.log('success')
					}
				})
			}
		}
	}
</script>

<style scoped>
	.store-info-box {
		padding: 30rpx 30rpx 60rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		position: fixed;
		bottom: 0;
		left: 24rpx;
		right: 24rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.store-name-box {
		display: flex;
		align-items: center;
		padding-bottom: 16rpx;
	}
	
	.store-name{
		color: #333;
		font-size: 28rpx;
		padding-right: 8rpx;
	}

	.store-state {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		color: #fff;
		border-radius: 50rpx;
		text-align: center;
		background-color: #7CD1F8;
		font-size: 20rpx;
	}

	.store-state.store-rest {
		background-color: #F2AB99;
	}

	.store-address-box {
		display: flex;
		align-items: center;
	}
	
	.store-distance {
		display: flex;
		align-items: center;
		color: #999;
	}
	
	.nav-btn{
		width: 340rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		border-radius: 50rpx;
		text-align: center;
		background-color: #333;
		color: #fff;
		font-size: 28rpx;
		margin: 30rpx auto 0;
	}
</style>
