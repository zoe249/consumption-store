<template>
	<view>
		<map style="width: 100%; height: 600rpx;" :latitude="latitude" :longitude="longitude" :markers="covers">
		</map>
		<view class="">
			店铺地址：{{storeInfo.state}}{{storeInfo.city}}{{storeInfo.district}}{{storeInfo.address}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: 37.421483,
				longitude: 122.175813,
				covers: [{
					latitude: 37.421483,
					longitude: 122.175813,
					iconPath: '../../../../static/images/marker.png',
					width: 30,
					height: 30
				}],
				storeInfo: {} // 门店信息
			}
		},
		onLoad(options) {
			this.storeInfo = JSON.parse(options.storeInfo)
			this.latitude = this.storeInfo.latitude
			this.longitude = this.storeInfo.longitude
			this.covers[0].latitude = this.storeInfo.latitude
			this.covers[0].longitude = this.storeInfo.longitude
		},
		methods: {

		}
	}
</script>

<style scoped>
	page {
		width: 100%;
		height: 100%;
	}
</style>
