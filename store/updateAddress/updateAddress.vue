<template>
	<view>
		<view class="input-box">
			<view @click="selectLocation">
				<u-input placeholder="省市区" v-model="areaValue" :clearable="true" fontSize="28rpx" :readonly="true">
					<template slot="suffix">
						<image class="store-local" src="../../static/store/local.png"></image>
					</template>
				</u-input>
			</view>
			<u-input placeholder="详细地址" v-model="address" :clearable="true" fontSize="28rpx">
			</u-input>
		</view>
		<view class="save-btn" @click="submit">保存</view>
	</view>
</template>

<script>
	// 引入腾讯地图jssdk文件
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				storeId: '',
				store: {}, // 店铺信息
				userInfo: {}, // 用户信息
				areaValue: '', // 选中地区
				address: '', //详细地址
				latitude: '', // 经度
				longitude: '', // 纬度
				country: '', // 国家
				province: '', // 省
				city: '', // 市
				district: '', // 区
				street: '' // 街道
			}
		},
		onLoad(option) {
			uni.hideShareMenu()
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getStores()
		},
		methods: {
			getStores() {
				let that = this
				that.request({
					url: that.config.stores + '/' + that.storeId
				}).then(res => {
					let data = res.data.data
					that.store = data
					that.state = data.state
					that.city = data.city
					that.district = data.district
					that.areaValue = data.state + data.city + data.district
					that.address = data.address
				})
			},
			/* 手动选择位置定位 */
			selectLocation() {
				let that = this
				uni.chooseLocation({
					success: function(res) {
						console.log('1111', res)
						that.address = res.address + res.name
						that.latitude = res.latitude
						that.longitude = res.longitude
						that.getLocation()
					}
				})
			},
			getLocation() {
				let that = this
				// 逆地址解析方法
				let qqmapsdk = new QQMapWX({
					// 填写自己的Key值，这个值是与AppID绑定的
					key: '2XOBZ-JNIKG-CEIQ5-IIBLI-JPQVE-VVFUZ'
				});
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: that.latitude,
						longitude: that.longitude
					},
					success(res) {
						console.log('地址', res);
						that.province = res.result.address_component.province
						that.city = res.result.address_component.city
						that.district = res.result.address_component.district
						that.areaValue = that.province + that.city + that.district
						// 截取详细地址
						var reg = new RegExp(that.province + that.city + that.district, "g");
						var address = that.address.replace(reg,"");
						that.address = address
						console.log('切换地址', that.address)
					}
				})
			},
			submit() {
				let that = this
				if (that.areaValue === '') {
					uni.showToast({
						title: '地区不能为空',
						icon: 'none',
						duration: 2000
					})
				} else if (that.address === '') {
					uni.showToast({
						title: '详细地址不能为空',
						icon: 'none',
						duration: 2000
					})
				} else {
					that.request({
						url: that.config.stores + '/' + that.storeId,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json; charset=utf-8',
							'Transaction-No': new Date().getTime()
						},
						data: {
							unionId: that.userInfo.uid,
							state: that.province,
							city: that.city,
							district: that.district,
							address: that.address,
							latitude: that.latitude,
							longitude: that.longitude
						}
					}).then(res => {
						if (res.data.code == '200000') {
							uni.showToast({
								title: '保存成功',
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
				}
			}
		}
	}
</script>

<style scoped>
	.input-box {
		margin: 20rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.save-btn {
		margin: 40rpx 24rpx 0;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.input-box>>>input {
		height: 80rpx;
		line-height: 80rpx;
	}

	.input-box>>>.u-input {
		padding-top: 0 !important;
		padding-bottom: 0 !important;
		padding-left: 20rpx !important;
		padding-right: 20rpx !important;
	}

	.store-local {
		width: 24rpx;
		height: 24rpx;
		padding: 4rpx 10rpx 0 0;
	}
	
	.input-box >>> .u-input__content:first-child{
		border-bottom: 1rpx solid #F4F4F4;
	}
</style>
