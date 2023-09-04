<template>
	<view>
		<view class="address-box" v-for="(item, index) in addressList" :key="index" @click="selectAddress(item)">
			<view class="content-left">
				<view class="default-address-box">
					<view class="store-type">{{item.addressTypeName}}</view>
					<view class="address">{{item.address}}</view>
				</view>
				<view class="base-info">
					<view class="name">{{item.consignee}}</view>
					<view v-if="item.gender == 1">先生</view>
					<view v-if="item.gender == 2">女士</view>
					<view class="phone">{{item.contact}}</view>
				</view>
			</view>
			<block v-if="managerState">
				<view class="content-right" @click.stop="goModifyAddressPage(item.id)">
					<image src="../../static/goods/editIcon.png" mode="widthFix"></image>
				</view>
			</block>
			<view v-else>
				<view class="circle" v-if="item.deliveryStatus">
					<block v-if="addressId == item.id">
						<view class="isSelect-address"></view>
					</block>
				</view>
				<view class="over-address" v-else>超过配送范围</view>
			</view>
			<!-- <view class="content-right">
				<u-icon name="edit-pen" color="#999" size="45" @click="goModifyAddressPage(item.id)"></u-icon>
				<u-icon name="trash" color="#999" size="45" @click="deleteAddress(index, item.id)"></u-icon>
			</view> -->
		</view>
		<view class="store-info-box" v-if="!managerState">
			<view class="current-store">当前店铺：{{storeInfo.name}}</view>
			<map style="width: 100%; height: 750rpx;" :latitude="latitude" :longitude="longitude" :markers="covers" :circles="circles"
				:enable-traffic="true">
			</map>
		</view>

		<view style="height: 200rpx;"></view>

		<view class="add-btn" @click="addAddress">
			<u-icon name="plus" color="#fff" size="16"></u-icon>
			<view class="add-address">新建地址</view>
		</view>
	</view>
</template>

<script>
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				isAddress: true, // 有地址
				addressList: [],
				options: '',
				name: '',
				phone: '',
				address: '',
				customerId: '', // 用户id
				latitude: '', // 经度
				longitude: '', // 纬度
				country: '中国', // 国家
				province: '', // 省
				city: '', // 市
				area: '', // 区
				storeInfo: {},
				latitude: '',
				longitude: '',
				covers: [{
					id: 1,
					latitude: '',
					longitude: '',
					iconPath: '/static/custome/local.png',
					width: 18,
					height: 23
				}, {
					id: 2,
					latitude: '',
					longitude: '',
					iconPath: '/static/custome/local.png',
					width: 18,
					height: 23
				}], // 地图标记点配置
				circles: [{
					radius: 10,
					color: '#F2AB99FF',
					latitude: '',
					longitude: '',
					strokeWidth: 2
				}],
				storeAttrInfo: {},
				managerState: false,
				addressId: ''
			}
		},
		onLoad(options) {
			this.storeId = options.storeId
			this.managerState = options.managerState == 'true' ? true : false
			this.addressId = options.addressId == undefined ? '' :options.addressId
			this.getStoreDeliveryAttr()
			this.options = options
		},
		onShow() {
			let that = this
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that.covers[1].latitude = res.latitude
					that.covers[1].longitude = res.longitude
				}
			})
			this.getCurrentStoreInfo()
		},
		methods: {
			/* 获取当前店铺信息 */
			getCurrentStoreInfo() {
				let that = this
				that.request({
					url: that.config.stores + `/${that.storeId}`
				}).then((res) => {
					console.log('门店信息', res)
					const data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					that.latitude = data.latitude
					that.longitude = data.longitude
					that.covers[0].latitude = data.latitude
					that.covers[0].longitude = data.longitude
					that.circles[0].latitude = data.latitude
					that.circles[0].longitude = data.longitude
					that.getAddressInfo()
				})
			},
			/* 获取店铺配送属性 */
			getStoreDeliveryAttr() {
				let that = this
				that.request({
					url: `${that.config.storeDeliveries}/${that.storeId}`
				}).then(res => {
					console.log('店铺配送属性', res)
					const data = res.data.data
					// if (data.functionState == '1') {
					// 	that.deliveryState = true
					// } else if (data.functionState == '2') {
					// 	that.deliveryState = false
					// }
					that.storeAttrInfo = data
					that.circles[0].radius = data.deliveryRadius * 1000
				})
			},
			/* 选中地址 */
			selectAddress(item) {
				// 未超出配送范围
				item.isSelect = !item.isSelect
				if (item.deliveryStatus) {
					// var pages = getCurrentPages()
					// var prevPage = pages[pages.length - 2]
					// prevPage.$vm.addressId = item.id
					this.addressId = item.id
					uni.setStorageSync('addressId', item.id)
					uni.navigateBack()
				}
			},
			/* 添加新地址 */
			addAddress() {
				uni.navigateTo({
					url: './address'
				})
			},
			/* 跳转修改地址 */
			goModifyAddressPage(id) {
				uni.navigateTo({
					url: './address?id=' + id
				})
			},
			/* 获取地址列表信息 */
			getAddressInfo() {
				var that = this
				that.request({
					url: that.config.shippingAddresses,
					data: {
						storeId: that.storeInfo.id
					}
				}).then(res => {
					const data = res.data.data
					if (data.length != 0) {
						data.forEach(item => {
							item.isSelect = false
						})
					}
					that.addressList = data
				})
			},
			/* 保存地址 */
			// saveAddress() {
			// 	let that = this
			// 	let chiefly
			// 	if (that.addressList.length == 0) {
			// 		chiefly = true
			// 	} else {
			// 		chiefly = false
			// 	}
			// 	that.request({
			// 		url: that.config.shippingAddresses,
			// 		method: "POST",
			// 		header: {
			// 			'Content-Type': 'application/json; charset=utf-8',
			// 			'Authorization': 'Bearer' + ' ' + uni.getStorageSync('token')
			// 		},
			// 		data: {
			// 			customerId: that.customerId,
			// 			consignee: that.name,
			// 			phone: that.phone,
			// 			country: that.country,
			// 			state: that.province,
			// 			city: that.city,
			// 			district: that.area,
			// 			street: '',
			// 			address: that.address,
			// 			chiefly: chiefly,
			// 			addressLabel: '无',
			// 			longitude: that.longitude,
			// 			latitude: that.latitude
			// 		}
			// 	}).then(res => {
			// 		if (res.data.code == '200000') {
			// 			uni.showToast({
			// 				title: '添加成功',
			// 				duration: 2000,
			// 				icon: 'none'
			// 			})
			// 			that.getAddressInfo() // 重新获取地址列表
			// 		} else {
			// 			uni.showToast({
			// 				title: res.data.detail,
			// 				duration: 2000,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style scoped>
	.address-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 14rpx 24rpx;
		padding: 30rpx 20rpx;
		background: #fff;
		border-radius: 10rpx;
	}
	
	.content-left{
		width: 70%;
	}

	.base-info {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #999;
		padding-top: 10rpx;
	}

	.address-box .phone {
		margin-left: 40rpx;
	}

	.default-address-box {
		display: flex;
		align-items: center;
	}
	
	.store-type{
		width: 80rpx;
		height: 36rpx;
		line-height: 36rpx;
		color: #fff;
		background-color: #7CD1F8;
		text-align: center;
		font-size: 24rpx;
		border-radius: 50rpx;
		margin-right: 10rpx;
	}

	.address-box .address {
		font-size: 32rpx;
		color: #000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 80%;
	}
	
	.content-right image{
		width: 40rpx;
		height: auto;
	}

	.add-box {
		margin: 0 20rpx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 28rpx;
		background-color: #EFF5F8;
	}
	
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		border-radius: 50rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
	}
	
	.add-address{
		margin-left: 8rpx;
	}

	.circle {
		background-color: #fff;
		border: 2rpx solid #000;
		border-radius: 50%;
		width: 20rpx;
		height: 20rpx;
		margin: 12rpx 10rpx 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.isSelect-address{
		background-color: #F2AB99;
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
	}
	
	.over-address{
		color: #F2AB99;
		font-size: 28rpx;
	}

	.store-info-box {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 20rpx 20rpx;
		font-size: 32rpx;
		color: #000;
	}
	
	.current-store{
		padding: 30rpx 0;
	}
</style>
