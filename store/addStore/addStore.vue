<template>
	<view>
		<view class="add-box">
			<view class="name-input">
				<view class="name-left">店铺编码</view>
				<block v-if="addState">
					<view>{{storeCode}}</view>
				</block>
				<block v-else>
					<view>{{storeAttrInfo.code}}</view>
				</block>
			</view>
			<view class="name-input">
				<view class="name-left">店铺名称</view>
				<block v-if="addState">
					<input placeholder="请输入店铺名称" v-model="storeName" :placeholder-style="style" />
				</block>
				<block v-else>
					<view>{{storeInfo.name}}</view>
				</block>
			</view>
			<view class="name-input">
				<view class="name-left">店铺地址</view>
				<view class="select-time" @click="selectLocation">
					<view>
						<input placeholder="省市区" v-model="areaValue" :placeholder-style="style" :disabled="true" />
					</view>
					<!-- <image src="../../static/store/local.png" mode=""></image> -->
				</view>
			</view>
			<view class="name-input">
				<view class="name-left">详细地址</view>
				<view>
					<input placeholder="详细地址" v-model="address" :placeholder-style="style" />
				</view>
			</view>
			<view class="name-input">
				<view class="name-left">店铺属性</view>
				<block v-if="addState">
					<view>{{storeAttribute}}</view>
				</block>
				<block v-else>
					<view>
						<block v-if="storeAttrInfo.storeAttribute == 1">标准版</block>
						<block v-if="storeAttrInfo.storeAttribute == 2">个性版</block>
					</view>
				</block>
			</view>
			<view class="name-input">
				<view class="name-left">店铺类型</view>
				<!-- <block v-if="addState"> -->
				<view @click="openStoreType">{{storeType}}</view>
				<!-- </block> -->
				<!-- <block v-else>
					<view>
						<block v-if="storeInfo.storeType == 1">展示型</block>
						<block v-if="storeInfo.storeType == 2">交易型</block>
					</view>
				</block> -->
			</view>
			<view class="name-input">
				<view>开始经营年份</view>
				<view class="select-time" @click="openDateYearShow">
					<!-- <picker mode="date" :value="dateYear" start="2012" :end="endYear" @change="bindDateChange"
						fields="year">
						<view class="add-title" v-if="dateYear === ''">请选择营业执照日期</view>
						<view class="add-value" v-else>{{dateYear}}年</view>
					</picker> -->
					<view class="add-title" v-if="dateYear === ''">请选择营业执照日期</view>
					<view class="add-value" v-else>{{dateYear}}年</view>
					<!-- <input placeholder="请选择营业执照日期" v-model="dateYear" :placeholder-style="style" :disabled="true" /> -->
					<image src="../../static/store/calendar.png" mode=""></image>
				</view>
			</view>
			<view class="name-input">
				<view class="name-left">初始老板</view>
				<block v-if="addState">
					<input placeholder="请输入初始老板名称" v-model="name" :placeholder-style="style" />
				</block>
				<block v-else>
					<view>{{storeAttrInfo.storeStaffName}}</view>
				</block>
			</view>
			<view class="name-input">
				<view class="name-left">手机号</view>
				<block v-if="addState">
					<input placeholder="与微信手机号相同" v-model="phone" placeholder-style="color: #999; font-size: 28rpx;"
						:maxlength="11" />
				</block>
				<block v-else>
					<view>{{storeAttrInfo.phone}}</view>
				</block>
			</view>
			<view class="name-input">
				<view>特约商户号</view>
				<input placeholder="非必填" v-model="specialStoreNum" :placeholder-style="style" />
			</view>
		</view>
		<block v-if="!addState">
			<view class="store-set">
				<view class="store-set-tip">店铺设置</view>
				<view class="name-input">
					<view>店铺隐藏</view>
					<u-switch v-model="storeHideState" @change="changeStoreHideState"></u-switch>
				</view>
				<view class="name-input">
					<view>禁止下单</view>
					<u-switch v-model="disabledOrderState" @change="changeDisabledOrderState"></u-switch>
				</view>
			</view>
			<view class="store-set">
				<view class="store-set-tip">营业执照</view>
				<block v-if="businessLicense !== ''">
					<view class="goods-img-box">
						<image :src="businessLicense" class="store-qrcode" mode="widthFix" />
						<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
							@click="deletePic('businessLicense')">
						</image>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('businessLicense')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
						<view>点击上传营业执照</view>
					</view>
				</block>
			</view>
			<view class="store-set">
				<view class="store-set-tip">其他行政材料</view>
				<block v-if="otherData !== ''">
					<view class="goods-img-box">
						<image :src="otherData" class="store-qrcode" mode="widthFix" />
						<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
							@click="deletePic('otherData')">
						</image>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('otherData')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
		</block>
		<view class="add-btn" @click="openAddStore" v-if="addState">创建店铺</view>
		<view class="add-btn" @click="editStoreInfo" v-else>保存信息</view>

		<u-popup :show="addConfirmShow" @close="closeConfirm" mode="center">
			<view>
				<view class="confirm-tip">
					<image class="add-store-icon" src="../../static/store/addStoreIcon.png"></image>
					<view>正在创建新店铺，请确认...</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">店铺编码</view>
					<view class="add-value">{{storeCode}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">店铺名称</view>
					<view class="add-value">{{storeName}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">店铺地址</view>
					<view class="add-value">{{areaValue}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">详细地址</view>
					<view class="add-value">{{address}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">店铺属性</view>
					<view class="add-value">{{storeAttribute}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">店铺类型</view>
					<view class="add-value">{{storeType}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">开始经营年份</view>
					<view class="add-value">{{dateYear}}年</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">初始老板</view>
					<view class="add-value">{{name}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">手机号</view>
					<view class="add-value">{{phone}}</view>
				</view>
				<view class="add-confirm-box">
					<view class="add-title">特约商户号</view>
					<view class="add-value">{{specialStoreNum}}</view>
				</view>
				<view class="confirm-btn-box">
					<view @click="closeConfirm">取消</view>
					<view class="confirm-btn" @click="addStore">确定</view>
				</view>
			</view>
		</u-popup>

		<!-- 分享 -->
		<u-popup :show="shareShow" :round="10" mode="bottom" @close="shareShow = false">
			<button class="share-box" open-type="share">
				<image :src="imgUrl + 'wx.png'"></image>
				<view class="share-tip">分享给好友</view>
			</button>
		</u-popup>

		<!-- 店铺属性 -->
		<!-- <u-picker :show="storeAttributeShow" :columns="storeAttributeList" keyName="name" :closeOnClickOverlay="true"
			@confirm="selectAttr" @cancel="closeStoreAttribute"></u-picker> -->

		<!-- 店铺类型 -->
		<u-picker :show="storeTypeShow" :columns="storeTypeList" keyName="name" :closeOnClickOverlay="true"
			@confirm="selectType" @cancel="closeStoreType" @close="closeStoreType"></u-picker>

		<!-- 开始经营年份 -->
		<u-popup :show="dateYearShow" @close="closeDateYearShow" :closeable="true">
			<view class="date-title">开始经营年份</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="dateYear" @change="changeDateYear"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in dateYearList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow">自定义</view>
				<view @click="confirmDateYear">确定</view>
			</view>
		</u-popup>

		<!-- 自定义输入框 -->
		<u-popup :show="definitionShow" @close="closeDefinitionShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<input type="text" v-model="definitionValue" placeholder="请输入自定义"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="closeDefinitionShow">取消</view>
					<view class="confirm-btn" @click="confirmDefinition">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				style: 'color: #ccc; font-size: 28rpx;',
				storeCode: '', // 店铺编码
				storeName: '', // 店铺名称
				name: '', // 老板姓名
				phone: '', // 手机号
				defaultValue: '',
				dateYear: '',
				addConfirmShow: false,
				shareShow: false,
				userInfo: {}, // 用户信息
				endYear: 0,
				storeId: '',
				storeAttribute: '标准版', // 店铺属性
				storeAttributeValue: 1,
				// storeAttributeList: [
				// 	[{
				// 		name: '标准版',
				// 		value: 1
				// 	}, {
				// 		name: '个性版',
				// 		value: 2
				// 	}]
				// ],
				// storeAttributeShow: false,
				addState: false, // 是否为新建店铺
				storeInfo: {},
				storeAttrInfo: {}, // 店铺初始信息
				storeInfoName: '',
				specialStoreNum: '', // 特约商户号
				areaValue: '', // 省市区
				address: '', //详细地址
				latitude: '', // 经度
				longitude: '', // 纬度
				country: '', // 国家
				province: '', // 省
				city: '', // 市
				district: '', // 区
				street: '', // 街道
				dateYearShow: false,
				definitionShow: false,
				indicatorStyle: `height: 70rpx;`,
				dateYearList: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
				dateYearIdx: 0,
				definitionValue: '',
				storeType: '',
				storeTypeValue: 1,
				storeTypeList: [
					[{
						name: '展示版',
						value: 1
					}, {
						name: '预定版',
						value: 3
					}, {
						name: '交易版',
						value: 4
					}, {
						name: '旗舰版',
						value: 2
					}]
				],
				storeTypeShow: false,
				storeHideState: false,
				disabledOrderState: false,
				applyId: '',
				businessLicense: '',
				qiniuToken: '',
				otherData: '',
				shareState: false
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			if (options.storeId === '') {
				// 新建店铺
				this.addState = true
				var myDate = new Date()
				this.endYear = myDate.getFullYear()
				this.getStoreCode() // 获取店铺编码
				// this.storeAttribute = this.storeAttributeList[0][0].name
				this.storeType = this.storeTypeList[0][0].name
			} else {
				uni.setNavigationBarTitle({
					title: '修改店铺'
				})
				// 查看店铺详情
				this.addState = false
				this.storeId = options.storeId
				this.getStoreDetail() // 获取店铺初始创建信息
				this.getStoreInfo() // 获取店铺详细信息
			}
			this.getQiniuToken()
		},
		onHide() {
			if (this.shareState) {
				uni.navigateBack()
			}
		},
		onShareAppMessage(res) {
			this.shareShow = false
			this.shareState = true
			console.log('门店id', this.storeId)
			return {
				title: `"${this.storeName}"邀请您成为店铺初始老板`,
				imageUrl: '../../static/store/shareBg.png',
				path: '/store/basicInfo/basicInfo?storeId=' + this.storeId
			}
		},
		methods: {
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			bindDateChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.dateYear = e.detail.value
			},
			/* 获取店铺编码 */
			getStoreCode() {
				let that = this
				let token = uni.getStorageSync('token')
				if (token === '') {
					// 请登录
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../pages/startUp/login/login'
								})
							}
						}
					})
				} else {
					that.request({
						url: that.config.storeCode
					}).then(res => {
						console.log('店铺编码', res)
						that.storeCode = res.data.data
					})
				}
			},
			/* 创建店铺 */
			addStore() {
				let that = this
				that.request({
					url: that.config.stores,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.storeName,
						businessLicenseDate: that.dateYear,
						staffName: that.name,
						staffPhone: that.phone,
						storeAttribute: that.storeAttributeValue,
						specialStoreNum: that.specialStoreNum,
						state: that.province,
						city: that.city,
						district: that.district,
						address: that.address,
						longitude: that.longitude,
						latitude: that.latitude,
						storeType: that.storeTypeValue,
						storeMaterialId: ''
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.storeId = res.data.data
						uni.showToast({
							title: '创建成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.addConfirmShow = false
							that.shareShow = true
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			openAddStore() {
				if (this.storeName === '') {
					uni.showToast({
						title: '请输入店铺名称',
						icon: 'none'
					})
				} else if (this.dateYear === '') {
					uni.showToast({
						title: '请选择营业执照日期',
						icon: 'none'
					})
				} else if (this.name === '') {
					uni.showToast({
						title: '请输入初始老板名称',
						icon: 'none'
					})
				} else if (this.phone === '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
				} else if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					uni.showToast({
						title: '联系电话格式不正确',
						icon: 'none'
					})
				} else {
					this.addConfirmShow = true
				}
			},
			closeConfirm() {
				this.addConfirmShow = false
			},
			openSelectDate() {
				this.dateShow = true
			},
			closeSelectDate() {
				this.dateShow = false
			},
			// openStoreAttribute() {
			// 	this.storeAttributeShow = true
			// },
			/* 选择店铺属性 */
			// selectAttr(e) {
			// 	console.log(e)
			// 	this.storeAttribute = e.value[0].name
			// 	this.storeAttributeValue = e.value[0].value
			// 	this.storeAttributeShow = false
			// },
			// closeStoreAttribute() {
			// 	this.storeAttributeShow = false
			// },
			/* 获取店铺初始创建信息 */
			getStoreDetail() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}/storeEstablishInfo`
				}).then(res => {
					console.log('店铺初始创建信息', res)
					const data = res.data.data
					that.storeAttrInfo = data
					that.dateYear = data.businessLicenseDate
					that.specialStoreNum = data.specialStoreNum
					uni.getImageInfo({
						src: data.businessLicensePicture,
						success: (image) => {
							console.log(image)
							that.businessLicense = image.path
						},
						fail: (err) => {
							uni.hideLoading()
						}
					})
					uni.getImageInfo({
						src: data.otherData,
						success: (image) => {
							console.log(image)
							that.otherData = image.path
						},
						fail: (err) => {
							uni.hideLoading()
						}
					})
				})
			},
			/* 获取店铺信息 */
			getStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`
				}).then(res => {
					const data = res.data.data
					that.storeInfo = data
					that.province = data.state
					that.city = data.city
					that.district = data.district
					that.areaValue = data.state + data.city + data.district
					that.address = data.address
					that.longitude = data.longitude
					that.latitude = data.latitude
					that.storeTypeValue = data.storeType
					if (data.storeType == 3) {
						// 预定版
						that.storeTypeList = [
							[{
								name: '预定版',
								value: 3
							}, {
								name: '交易版',
								value: 4
							}, {
								name: '旗舰版',
								value: 2
							}]
						]
					} else if (data.storeType == 2 || data.storeType == 4) {
						// 交易版 || 旗舰版
						that.storeTypeList = [
							[{
								name: '交易版',
								value: 4
							}, {
								name: '旗舰版',
								value: 2
							}]
						]
					}
					if (data.storeType == 1) {
						// 展示型
						that.storeType = '展示版'
					} else if (data.storeType == 2) {
						// 交易型
						that.storeType = '旗舰版'
					} else if (data.storeType == 3) {
						// 交易型
						that.storeType = '预定版'
					} else if (data.storeType == 4) {
						// 交易型
						that.storeType = '交易版'
					}
					that.storeHideState = !data.publish
					that.disabledOrderState = !data.storeTransaction
				})
			},
			/* 修改店铺信息 */
			editStoreInfo() {
				// if (this.storeInfo.storeType != this.storeTypeValue) {
				// 	this.updateStoreType() // 升级店铺类型
				// }
				// if (this.storeInfo.storeType == 1) {
				// 	if (this.storeTypeValue == 2 || this.storeTypeValue == 4 || this.storeTypeValue == 3) {
				// 		// 展示版 升级成 交易版 || 旗舰版 || 预定版
				// 		this.updateStoreType() // 升级店铺类型
				// 	}
				// } else if (this.storeInfo.storeType == 3) {
				// 	if (this.storeTypeValue == 2 || this.storeTypeValue == 4) {
				// 		// 预定版 升级成 交易版 || 旗舰版
				// 		this.updateStoreType() // 升级店铺类型
				// 	}
				// }
				let that = this
				that.request({
					url: `${that.config.stores}/${that.storeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						businessLicenseDate: that.dateYear,
						specialStoreNum: that.specialStoreNum,
						state: that.province,
						city: that.city,
						district: that.district,
						address: that.address,
						longitude: that.longitude,
						latitude: that.latitude,
						publish: !that.storeHideState,
						storeTransaction: !that.disabledOrderState,
						storeType: that.storeTypeValue,
						businessLicense: that.businessLicense,
						otherData: that.otherData
					}
				}).then(res => {
					console.log('修改店铺信息', res)
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
			/* 手动选择位置定位 */
			selectLocation() {
				let that = this
				uni.chooseLocation({
					success: function(res) {
						console.log('手动选择位置', res)
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
						var address = that.address.replace(reg, "");
						that.address = address
						console.log('切换地址', that.address)
					}
				})
			},
			/* 选择开始经营年份 */
			openDateYearShow() {
				this.dateYearShow = true
			},
			closeDateYearShow() {
				this.dateYearShow = false
			},
			changeDateYear(e) {
				console.log(e)
				let index = e.detail.value[0]
				this.dateYearIdx = index
			},
			confirmDateYear() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.dateYear = this.dateYearList[this.dateYearIdx]
					this.dateYearShow = false
				}, 1000)
			},
			/* 自定义输入框 */
			openDefinitionShow() {
				this.dateYearShow = false
				this.definitionShow = true
				this.definitionValue = ''
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				this.definitionShow = false
				this.dateYear = this.definitionValue
			},
			/* 选择店铺类型 */
			openStoreType() {
				this.storeTypeShow = true
			},
			selectType(e) {
				console.log(e)
				this.storeType = e.value[0].name
				this.storeTypeValue = e.value[0].value
				this.storeTypeShow = false
			},
			closeStoreType() {
				this.storeTypeShow = false
			},
			/* 店铺升级 */
			// updateStoreType() {
			// 	let that = this
			// 	that.request({
			// 		url: `${that.config.stores}/${that.storeId}/storeTypeLevelUp`,
			// 		method: 'PUT',
			// 		header: {
			// 			'Content-Type': 'application/json',
			// 			'Transaction-No': new Date().getTime()
			// 		}
			// 	}).then(res => {
			// 		console.log('店铺升级', res)
			// 		if (res.data.code == '200000') {
			// 			uni.showToast({
			// 				title: '保存成功',
			// 				icon: 'none'
			// 			})
			// 		} else {
			// 			uni.showToast({
			// 				title: res.data.detail,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// },
			/* 店铺隐藏开关 */
			changeStoreHideState(e) {
				console.log(e)
				this.storeHideState = e
			},
			/* 禁止下单开关 */
			changeDisabledOrderState(e) {
				this.disabledOrderState = e
			},
			/* 选择图片 */
			chooseImage(type) {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						that.uploadFilePromise(res.tempFilePaths[0], type)
					}
				})
			},
			uploadFilePromise(url, type) {
				let that = this
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: url,
						header: {
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							let pic = 'https://qiaokun.yuepong.com/' + data.key
							if (type == 'businessLicense') {
								// 营业执照
								that.businessLicense = pic
							} else if (type == 'otherData') {
								// 其他材料
								that.otherData = pic
							}
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
				})
			},
			/* 删除照片 */
			deletePic(type) {
				if (type == 'businessLicense') {
					// 营业执照
					this.businessLicense = ''
				} else if (type == 'otherData') {
					// 其他材料
					this.otherData = ''
				}
			}
		}
	}
</script>

<style scoped>
	.add-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
	}

	.name-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		margin: 0 20rpx;
		border-bottom: 1rpx solid #F4F4F4;
		font-size: 28rpx;
	}

	.name-input input {
		text-align: right;
		width: 500rpx;
	}

	.name-input:last-child {
		border-bottom: 0;
	}

	.name-left {
		min-width: 120rpx;
	}

	.add-btn {
		background-color: #F2AB99;
		color: #fff;
		border-radius: 50rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx 24rpx;
		font-size: 28rpx;
	}

	.select-time {
		display: flex;
		align-items: center;
	}

	.select-time>>>.placeholder {
		color: #ccc;
		font-size: 28rpx;
	}

	.select-time image {
		width: 26rpx;
		height: 26rpx;
		margin-left: 20rpx;
	}

	.confirm-tip {
		display: flex;
		align-items: flex-end;
		color: #F2AB99;
		font-size: 28rpx;
		padding: 52rpx 60rpx 36rpx;
	}

	.confirm-tip image {
		width: 76rpx;
		height: 76rpx;
	}

	.add-confirm-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		margin: 0 40rpx;
		padding: 26rpx 0;
		border-bottom: 2rpx solid #F4F4F4;
	}

	.add-confirm-box:nth-child(11) {
		border-bottom: 0;
	}

	.add-title {
		color: #999;
	}

	.add-value {
		color: #333;
	}

	.confirm-btn-box {
		margin: 12rpx 40rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.confirm-btn-box view {
		width: 210rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 28rpx;
		color: #fff;
		border-radius: 50rpx;
		background-color: #999;
	}

	.confirm-btn-box view.confirm-btn {
		background-color: #F2AB99;
		margin-left: 20rpx;
	}

	.share-box {
		background-color: #fff;
		text-align: center;
		margin: 80rpx 0;
		line-height: unset;
	}

	.share-box::after {
		border: none;
	}

	.share-box image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.share-tip {
		font-size: 28rpx;
		color: #999;
		text-align: center;
		padding-top: 10rpx;
	}

	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
	}

	.item {
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.select-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.date-title {
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

	.store-set {
		margin: 20rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 24rpx;
	}

	.store-set-tip {
		padding: 20rpx 0;
		border-bottom: 2rpx solid #F4F4F4;
	}
	
	.goods-img-box {
		position: relative;
	}
	
	.goods-img {
		width: 240rpx;
		height: 240rpx;
		background-color: #fff;
		border-radius: 50%;
	}
	
	.delete-goods-img {
		position: absolute;
		right: -15rpx;
		top: -15rpx;
		width: 30rpx;
		height: 30rpx;
	}
	
	.upload-qrcode {
		height: 400rpx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}
	
	.store-qrcode {
		width: 100%;
		height: auto;
	}
</style>
