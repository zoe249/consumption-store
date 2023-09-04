<template>
	<view>
		<view @click="deleteAddress" class="delete-address" v-if="editState">删除地址</view>
		<view class="address-box">
			<view class="address-input">
				<view class="input-left">省市区</view>
				<view class="input-box" @click="selectLocation">
					<input type="text" placeholder="省市区" :disabled="true" class="input-right" :placeholder-style="style"
						v-model="areaValue">
					<u-icon name="arrow-right" color="#666" size="14"></u-icon>
				</view>
			</view>
			<view class="address-input">
				<view class="input-left">详细地址</view>
				<view class="input-box">
					<input type="text" class="input-right address-detail-input" placeholder="详细地址"
						:placeholder-style="style" v-model="address">
				</view>
			</view>
			<view class="address-input">
				<view class="input-left">联系人</view>
				<view class="input-box">
					<input type="text" placeholder="请填写收货人姓名" class="input-right" :placeholder-style="style"
						v-model="consignee">
					<view class="select-sex-box">
						<view v-for="(item, sexIdx) in sexList" :key="sexIdx" class="select-sex-box"
							@click="changeSex(item)">
							<view class="select-sex">
								<view :class="gender == item.value ? 'selected-sex' : ''"></view>
							</view>
							<view>{{item.name}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="address-input">
				<view class="input-left">手机号</view>
				<view class="input-box">
					<input type="text" placeholder="请填写收货手机号" class="input-right" :placeholder-style="style"
						v-model="contact">
				</view>
			</view>
			<view class="address-type-box address-input">
				<view class="input-left">地址类型</view>
				<view class="address-type">
					<view v-for="(item, index) in labelList" :key="index" class="type-box"
						:class="addressType == item.value ? 'type-active' : ''" @click="selectType(item)">{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @click="saveAddress" :class="saveState ? '' : 'disabled'">保存</view>
	</view>
</template>

<script>
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				style: 'color: #999; font-size: 28rpx;',
				sexList: [{
					name: '女士',
					value: 2
				}, {
					name: '先生',
					value: 1
				}],
				gender: 2,
				areaValue: '',
				address: '',
				consignee: '',
				contact: '',
				state: '',
				city: '',
				district: '',
				longitude: '',
				latitude: '',
				userInfo: {},
				addressId: '',
				editState: false,
				labelList: [{
					name: '家',
					value: 1
				}, {
					name: '公司',
					value: 2
				}, {
					name: '学校',
					value: 3
				}, {
					name: '其他',
					value: 4
				}],
				addressType: 1,
				saveState: true // 保存按钮状态
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.addressId = options.id == undefined ? '' : options.id
			if (this.addressId !== '') {
				// 编辑地址
				this.editState = true
				this.userInfo = uni.getStorageSync('userInfo')
				this.getAddressInfo()
			} else {
				// 新增地址
				this.editState = false
			}
		},
		methods: {
			/* 切换性别 */
			changeSex(item) {
				this.gender = item.value
			},
			/* 手动选择位置定位 */
			selectLocation() {
				let that = this
				uni.chooseLocation({
					success: function(res) {
						console.log('选择位置', res)
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
						that.state = res.result.address_component.province
						that.city = res.result.address_component.city
						that.district = res.result.address_component.district
						that.areaValue = that.state + that.city + that.district
						// 截取详细地址
						var reg = new RegExp(that.state + that.city + that.district, "g");
						var address = that.address.replace(reg, "");
						that.address = address
					}
				})
			},
			/* 保存地址 */
			saveAddress() {
				if (this.state === '') {
					uni.showToast({
						title: '请选择省市区',
						icon: 'none'
					})
				} else if (this.address === '') {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					})
				} else if (this.consignee === '') {
					uni.showToast({
						title: '请输入联系人姓名',
						icon: 'none'
					})
				} else if (this.contact === '') {
					uni.showToast({
						title: '请输入联系人手机号',
						icon: 'none'
					})
				} else if (!(/^1[3456789]\d{9}$/.test(this.contact))) {
					uni.showToast({
						title: '联系电话格式不正确',
						icon: 'none'
					})
				} else {
					this.saveState = false
					if (this.addressId === '') {
						this.addAddress() // 新增地址
					} else {
						this.editAddress() // 修改地址
					}
				}
			},
			/* 新增地址 */
			addAddress() {
				let that = this
				that.request({
					url: that.config.shippingAddresses,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						consignee: that.consignee,
						gender: that.gender,
						contact: that.contact,
						state: that.state,
						city: that.city,
						district: that.district,
						address: that.address,
						longitude: that.longitude,
						latitude: that.latitude,
						addressType: that.addressType
					}
				}).then(res => {
					console.log('保存地址', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
							that.saveState = true
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取地址信息 */
			getAddressInfo() {
				let that = this
				that.request({
					url: `${that.config.shippingAddresses}/${that.addressId}`
				}).then(res => {
					console.log('获取地址', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.consignee = data.consignee
						that.gender = data.gender
						that.contact = data.contact
						that.state = data.state
						that.city = data.city
						that.district = data.district
						that.areaValue = that.state + that.city + that.district
						that.address = data.address
						that.longitude = data.longitude
						that.latitude = data.latitude
						that.addressType = data.addressType
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 修改地址 */
			editAddress() {
				let that = this
				that.request({
					url: `${that.config.shippingAddresses}/${that.addressId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						consignee: that.consignee,
						gender: that.gender,
						contact: that.contact,
						state: that.state,
						city: that.city,
						district: that.district,
						address: that.address,
						longitude: that.longitude,
						latitude: that.latitude,
						addressType: that.addressType
					}
				}).then(res => {
					console.log('保存地址', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
							that.saveState = true
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除地址 */
			deleteAddress() {
				let that = this
				uni.showModal({
					content: '地址删除后无法恢复，是否删除地址',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中',
								mask: true
							})
							that.request({
								url: `${that.config.shippingAddresses}/${that.addressId}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('删除地址', res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '删除成功',
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
				})
			},
			/* 选择地址类型 */
			selectType(item) {
				this.addressType = item.value
			}
		}
	}
</script>

<style scoped>
	.delete-address {
		color: #F2AB99;
		text-decoration: underline;
		font-size: 28rpx;
		margin: 16rpx 24rpx;
		text-align: right;
	}

	.address-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		color: #333;
		font-size: 28rpx;
	}

	.address-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.address-input:last-child {
		border-bottom: 0;
	}

	.input-left {
		min-width: 120rpx;
	}

	.input-box {
		display: flex;
		align-items: center;
	}

	.input-right {
		color: #999;
		text-align: right;
	}

	.address-detail-input {
		width: 500rpx;
	}

	.select-sex-box {
		display: flex;
		align-items: center;
	}

	.select-sex {
		width: 28rpx;
		height: 28rpx;
		border: 1rpx solid #333;
		border-radius: 50%;
		margin: 0 6rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.selected-sex {
		background-color: #F2AB99;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
	}

	.add-btn {
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

	.disabled {
		pointer-events: none;
		/* background-color: #ccc; */
	}

	.address-type {
		display: flex;
		align-items: center;
	}

	.type-box {
		width: 100rpx;
		height: 54rpx;
		line-height: 54rpx;
		border-radius: 50rpx;
		border: 1rpx solid #ccc;
		background-color: #fff;
		text-align: center;
		font-size: 28rpx;
		margin-left: 20rpx;
		color: #999;
	}

	.type-box.type-active {
		border: 1rpx solid #7CD1F8;
		color: #fff;
		background-color: #7CD1F8;
	}
</style>
