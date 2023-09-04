<template>
	<view class="set">
		<view class="delivery-func">
			<view>配送功能</view>
			<u-switch v-model="deliveryState"></u-switch>
		</view>
		<block v-if="deliveryState">
			<view class="store-map">
				<map style="width: 100%; height: 700rpx;" :latitude="latitude" :longitude="longitude" :markers="covers"
					:enable-traffic="true">
				</map>
			</view>
			<view class="attr-box">
				<view class="input-box" @click="selectLocation">
					<view>配送中心</view>
					<view class="input-right">
						<view>{{address}}</view>
						<image class="store-local" src="../../static/store/local.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="input-box" @click="selectDeliveryRadius('1')">
					<view>配送半径</view>
					<view class="input-right">
						<view>{{deliveryRadius}}公里</view>
						<image src="../../static/store/setArrow.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="input-box" @click="selectDeliveryRadius('2')">
					<view>起送金额</view>
					<view class="input-right">
						<view>{{deliveryThreshold}}元</view>
						<image src="../../static/store/setArrow.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="input-box" @click="selectDeliveryRadius('3')">
					<view>配送费</view>
					<view class="input-right">
						<view>{{deliveryFee}}元</view>
						<image src="../../static/store/setArrow.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="input-box" @click="selectDeliveryRadius('4')">
					<view>免费配送金额</view>
					<view class="input-right">
						<view>{{deliveryFree}}元</view>
						<image src="../../static/store/setArrow.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="input-box">
					<view>开始配送时间</view>
					<picker mode="time" :value="time" start="00:00" end="23:59" @change="selectDeliveryTime">
						<view class="input-right">
							<view>{{deliveryTime}}</view>
							<image src="../../static/store/setArrow.png" mode="widthFix"></image>
						</view>
					</picker>
				</view>
				<view class="input-box" @click="openEstimatedTimeShow">
					<view>配送用时</view>
					<view class="input-right">
						<view>{{estimatedTime}}</view>
						<image src="../../static/store/setArrow.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</block>
		<view class="save-btn" @tap="$u.throttle(saveStoreAttr, 500)">保存</view>
		<view style="height: 10rpx;"></view>

		<!-- 配送半径 -->
		<u-popup :show="deliveryRadiusShow" @close="closeDeliveryRadiusShow" :closeable="true">
			<view class="add-title">
				<block v-if="type == 1">配送半径</block>
				<block v-if="type == 2">起送金额</block>
				<block v-if="type == 3">配送费</block>
				<block v-if="type == 4">免费配送金额</block>
			</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="deliveryRadiusValue"
					@change="radiusValueChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in list" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('1')">自定义</view>
				<view @click="confirmDeliveryRadius">确定</view>
			</view>
		</u-popup>

		<!-- 自定义输入框 -->
		<u-popup :show="definitionShow" @close="closeDefinitionShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<input type="number" v-model="definitionValue" placeholder="请输入自定义"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="closeDefinitionShow">取消</view>
					<view class="confirm-btn" @click="confirmDefinition">确认</view>
				</view>
			</view>
		</u-popup>

		<!-- 选择配送用时 -->
		<u-popup :show="estimatedTimeShow" @close="closeEstimatedTimeShow">
			<picker-view :indicator-style="indicatorStyle" :value="bakeTimeValue" @change="selectEstimatedTime"
				class="time-picker-view">
				<picker-view-column>
					<view class="time-item" v-for="(item, index) in hours" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="time-item" v-for="(item, index) in minutes" :key="index">{{item}}分</view>
				</picker-view-column>
			</picker-view>
		</u-popup>
	</view>
</template>

<script>
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				deliveryState: false,
				latitude: '',
				longitude: '',
				covers: [{
					id: 1,
					latitude: '',
					longitude: '',
					iconPath: '/static/custome/local.png',
					width: 18,
					height: 23
				}],
				storeId: '',
				address: '',
				deliveryRadiusShow: false,
				deliveryRadius: '1',
				deliveryRadiusList: ['1公里', '2公里', '3公里'],
				deliveryRadiusValue: [0],
				deliveryThreshold: '10',
				deliveryFee: '3',
				deliveryFree: '100',
				estimatedTime: '1小时',
				deliveryTime: '18:00',
				definitionShow: false,
				definitionValue: '',
				indicatorStyle: `height: 70rpx;`,
				type: '',
				list: [],
				deliveryThresholdList: ['28元'],
				deliveryFeeList: ['5元'],
				deliveryFreeList: ['58元'],
				hours: ['00', '01', '02', '03', '04', '05', '06'],
				minutes: ['00', '10', '20', '30', '40', '50'],
				estimatedTimeShow: false,
				estimatedTimeValue: [0],
				radiusIdx: 0
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getStoreInfo()
			this.getStoreDeliveryAttr()
		},
		methods: {
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then((res) => {
					console.log('门店信息', res)
					const data = res.data.data
					that.storeInfo = data
					uni.setStorageSync('storeInfo', data)
					that.latitude = data.latitude
					that.longitude = data.longitude
					that.covers[0].latitude = data.latitude
					that.covers[0].longitude = data.longitude
					that.address = data.state + data.city + data.district + data.address
				})
			},
			/* 保存店铺配送属性 */
			saveStoreAttr() {
				let that = this
				let estimatedTime
				let deliveryState
				if (that.estimatedTime.indexOf('分钟') > -1) {
					// 配送用时小于1小时
					estimatedTime = (parseInt(that.estimatedTime) / 60).toFixed(2)
				} else {
					estimatedTime = parseFloat(that.estimatedTime)
				}
				if (!that.deliveryState) {
					deliveryState = 2
				} else {
					deliveryState = 1
				}
				that.request({
					url: that.config.storeDeliveries,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						deliveryTime: that.deliveryTime,
						deliveryRadius: that.deliveryRadius,
						deliveryThreshold: that.deliveryThreshold,
						deliveryFee: that.deliveryFee,
						deliveryFree: that.deliveryFree,
						estimatedTime: parseFloat(estimatedTime),
						longitude: that.longitude,
						latitude: that.latitude,
						functionState: deliveryState
					}
				}).then(res => {
					console.log('保存配送属性', res)
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
			},
			selectDeliveryRadius(type) {
				this.type = type
				if (type == '1') {
					// 配送半径
					this.list = this.deliveryRadiusList
				} else if (type == '2') {
					// 起送金额
					this.list = this.deliveryThresholdList
				} else if (type == '3') {
					// 配送费
					this.list = this.deliveryFeeList
				} else if (type == '4') {
					// 免费配送金额
					this.list = this.deliveryFreeList
				}
				this.deliveryRadiusShow = true
			},
			radiusValueChange(e) {
				let index = e.detail.value[0]
				this.radiusIdx = index
			},
			closeDeliveryRadiusShow() {
				this.deliveryRadiusShow = false
			},
			confirmDeliveryRadius() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					if (this.type == '1') {
						// 配送半径
						this.deliveryRadius = parseFloat(this.deliveryRadiusList[this.radiusIdx])
					} else if (this.type == '2') {
						// 起送金额
						this.deliveryThreshold = parseFloat(this.deliveryThresholdList[0])
					} else if (this.type == '3') {
						// 配送费
						this.deliveryFee = parseFloat(this.deliveryFeeList[0])
					} else if (this.type == '4') {
						// 免费配送金额
						this.deliveryFree = parseFloat(this.deliveryFreeList[0])
					}
					this.deliveryRadiusShow = false
				}, 1000)
			},
			openDefinitionShow() {
				this.definitionShow = true
				this.deliveryRadiusShow = false
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				if (this.type == '1') {
					// 配送半径
					this.deliveryRadius = this.definitionValue
				} else if (this.type == '2') {
					// 起送金额
					this.deliveryThreshold = this.definitionValue
				} else if (this.type == '3') {
					// 配送费
					this.deliveryFee = this.definitionValue
				} else if (this.type == '4') {
					// 免费配送金额
					this.deliveryFree = this.definitionValue
				}
				this.definitionValue = ''
				this.definitionShow = false
			},
			openEstimatedTimeShow() {
				this.estimatedTimeShow = true
			},
			closeEstimatedTimeShow() {
				this.estimatedTimeShow = false
			},
			/* 选择开始配送时间 */
			selectDeliveryTime(e) {
				console.log('开始配送时间', e)
				this.deliveryTime = e.detail.value
			},
			/* 改变配送用时 */
			selectEstimatedTime(e) {
				console.log(e)
				let hourIdx = e.detail.value[0]
				let hour = parseFloat(this.hours[hourIdx])
				let minIdx = e.detail.value[1]
				let minute = parseFloat(this.minutes[minIdx])
				if (hour < 1) {
					// 小于一小时展示分钟
					this.estimatedTime = minute + '分钟'
				} else {
					this.estimatedTime = hour + parseFloat((minute / 60).toFixed(2)) + '小时'
				}
			},
			/* 选择中心点 */
			// selectCentralPoint(e) {
			// 	console.log('点击', e)
			// 	this.latitude = e.detail.latitude
			// 	this.longitude = e.detail.longitude
			// 	this.covers[0].latitude = e.detail.latitude
			// 	this.covers[0].longitude = e.detail.longitude
			// },
			/* 获取店铺配送属性 */
			getStoreDeliveryAttr() {
				let that = this
				that.request({
					url: `${that.config.storeDeliveries}/${that.storeId}`
				}).then(res => {
					console.log('店铺配送属性', res)
					const data = res.data.data
					if (data.functionState == '1') {
						that.deliveryState = true
					} else if (data.functionState == '2') {
						that.deliveryState = false
					}
					that.deliveryTime = data.deliveryTime
					that.deliveryRadius = data.deliveryRadius
					that.deliveryThreshold = data.deliveryThreshold
					that.deliveryFee = data.deliveryFee
					if (data.estimatedTime < 1) {
						// 小于1小时显示分钟
						that.estimatedTime = Math.round(data.estimatedTime * 60) + '分钟'
					} else {
						that.estimatedTime = data.estimatedTime + '小时'
					}
					that.deliveryFree = data.deliveryFree
					that.longitude = data.longitude
					that.latitude = data.latitude
					that.covers[0].latitude = data.latitude
					that.covers[0].longitude = data.longitude
					that.getLocation()
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
			/* 获取地址中文名称 */
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
						let province = res.result.address_component.province
						let city = res.result.address_component.city
						let district = res.result.address_component.district
						// 截取详细地址
						var reg = new RegExp(province + city + district, "g");
						var _address = that.address.replace(reg,"");
						that.address = _address
					}
				})
			},
		}
	}
</script>

<style scoped>
	.delivery-func {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 26rpx 20rpx;
		border-radius: 10rpx;
		color: #999;
		font-size: 28rpx;
	}

	.set>>>.u-switch {
		background-color: #fff !important;
		border: 4rpx solid #ccc !important;
		width: 72rpx !important;
		height: 46rpx !important;
	}

	.set>>>.u-switch__bg {
		background-color: #fff !important;
	}

	.set>>>.u-switch__node {
		background-color: #ccc;
		width: 30rpx !important;
		height: 30rpx !important;
		transform: translateX(-30rpx) !important;
		box-shadow: unset !important;
	}

	.set>>>.u-switch__node.u-switch__node--on {
		background-color: #F2AB99;
		transform: translateX(-8rpx) !important;
	}

	.store-map {
		margin: 14rpx 24rpx;
	}

	.attr-box {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 0 24rpx;
	}

	.input-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
		font-size: 28rpx;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.input-right {
		display: flex;
		align-items: center;
		color: #333;
	}

	.input-right image {
		width: 8rpx;
		height: auto;
		margin-left: 10rpx;
	}

	.save-btn {
		margin: 40rpx 32rpx;
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

	.time-picker-view {
		height: 600rpx;
	}

	.time-item {
		height: 70rpx;
		line-height: 70rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	
	.input-right image.store-local {
		width: 24rpx;
		height: 24rpx;
		padding: 4rpx 10rpx 0 0;
	}
</style>
