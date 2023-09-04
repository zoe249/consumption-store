<template>
	<view class="submit-order-cont">
		<u-sticky>
			<yp-nav title="提交订单"></yp-nav>
		</u-sticky>
		<view class="store-box">
			<view class="store-info" :class="receivingWay == 2 ? 'address-box' : ''">
				<image :src="storeInfo.logo" mode=""></image>
				<view>{{storeInfo.name}}</view>
			</view>
			<block v-if="receivingWay == 1">
				<!-- 自提订单 -->
				<view class="order-info order-delivery">
					<view>取货方式</view>
					<view class="pickup-way">
						<view class="order-tip order-way" v-for="(item, index) in pickupWayList" :key="index"
							:class="receivingWay == item.value ? 'active-way' : ''" @click="changePickupWay(item)">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="order-info">
					<view class="order-tip">取餐时间</view>
					<view>{{deliveryTime}} 之后</view>
				</view>
				<view class="order-info">
					<view class="order-tip">自提点</view>
					<view class="store-address">
						<view>{{storeInfo.city}}{{storeInfo.district}}{{storeInfo.address}}</view>
						<image src="../../static/custome/storeShare.png" @click="location"></image>
					</view>
				</view>
				<view class="order-info">
					<view class="order-tip">手机</view>
					<view>{{userInfo.phone}}</view>
				</view>
			</block>
			<block v-if="receivingWay == 2">
				<!-- 配送订单 -->
				<view class="order-info order-delivery">
					<view class="order-left">取货方式</view>
					<view class="pickup-way">
						<view class="order-tip order-way" v-for="(item, index) in pickupWayList" :key="index"
							:class="receivingWay == item.value ? 'active-way' : ''" @click="changePickupWay(item)">
							{{item.name}}
						</view>
					</view>
				</view>
				<block v-if="addressInfo.address != null">
					<view class="order-info">
						<view class="order-left">配送地址</view>
						<view class="receive-tip">{{addressInfo.address}}</view>
					</view>
					<view class="order-info">
						<view class="phone-box">
							<view>联系人</view>
							<view class="receive-tip">{{addressInfo.consignee}}
								<block v-if="addressInfo.gender == 1">先生</block>
								<block v-if="addressInfo.gender == 2">女士</block>
							</view>
						</view>
						<view class="symbol">|</view>
						<view class="phone-box">
							<view>手机</view>
							<view class="phone-icon">
								<image :src="imgUrl + 'orderPhone.png'" mode=""></image>
								<view class="receive-tip">{{addressInfo.contact}}</view>
							</view>
						</view>
					</view>
					<!-- <view class="order-info">
						<view>配送时间</view>
						<view class="receive-tip">{{storeDeliveryAttr.deliveryTime}}</view>
					</view> -->
					<view v-if="!deliveryState" class="order-address-tip">
						<image :src="imgUrl + 'addressTip.png'" mode="widthFix"></image>
						<view>温馨提示：您当前收货地址超出商家配送范围</view>
					</view>
				</block>
				<view class="edit-address" @click="chooseAddress">
					<view v-if="addressInfo.address == null">添加地址</view>
					<view v-else>切换地址</view>
				</view>
			</block>
		</view>
		<view class="goods-info">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-box">
				<view class="goods-img">
					<image :src="item.picture"></image>
					<view class="goods-name">{{item.name}}</view>
				</view>
				<view class="price-num">
					<view class="goods-price">￥{{item.marketPrice}}</view>
					<view>x{{item.num}}</view>
				</view>
			</view>
			<view class="total-price-box">
				<view>小计</view>
				<view class="total-price">￥{{totalPrice}}</view>
			</view>
		</view>
		<view class="delivery-box" v-if="receivingWay == 2">
			<view class="order-info">
				<view>开始配送时间</view>
				<view class="receive-tip">{{storeDeliveryAttr.deliveryTime}}</view>
			</view>
			<view class="order-info">
				<view>预计送达时间</view>
				<view class="receive-tip">{{serveTime}}</view>
			</view>
			<view class="order-info">
				<view>配送费</view>
				<view class="receive-tip">￥{{deliveryFee}}</view>
			</view>
		</view>
		<view class="rule-box" v-if="amountCount != 0">
			<image :src="imgUrl + 'rule.png'" mode="widthFix"></image>
			<view class="rule-desc">
				<block v-if="cardNum == 0">订单商品金额每满<text class="total-price">{{amountCount}}</text>元可获得卡片一张</block>
				<block v-else>您当前订单已满<text class="total-price">{{amountCount}}</text>元，订单完成后可获得<text
						class="total-price">{{cardNum}}</text>张卡片</block>
			</view>
		</view>
		<view class="select-pay-way">
			<!-- <view class="pay-box" v-for="(pay, payIdx) in payWayList" :key="payIdx" @click="selectPayWay(pay)">
				<view class="pay-way">
					<image :src="pay.img" mode=""></image>
					<view>{{pay.way}}</view>
				</view>
				<view class="select-way selected-way" v-if="pay.select"></view>
				<view class="select-way" v-if="!pay.select"></view>
			</view> -->
			<view class="pay-box">
				<view class="pay-way">
					<image :src="imgUrl + 'weChatPay.png'"></image>
					<view>微信支付</view>
				</view>
				<view class="select-way selected-way"></view>
			</view>
		</view>
		<view class="packet-box">
			<view class="packet-left">
				<image :src="imgUrl + 'accountPacket.png'"></image>
				<view class="order-packet">
					<view class="packet-account">可用消费红包抵扣<text class="total-price">{{userAccount}}</text>元</view>
					<view class="packet-tip">参与店铺红包活动可积累更多红包</view>
					<view class="packet-tip">订单退款红包不退回</view>
				</view>
			</view>
			<view class="select-way" :class="isPacket ? 'selected-way' : ''" @click="selectPacket"></view>
		</view>
		<view style="height: 150rpx"></view>
		<view class="submit-order-box">
			<view>
				<text>合计:</text>
				<text class="total-price">￥{{orderPrice}}</text>
			</view>
			<view class="submit-order" @click="wxPay" :class="orderState ? '' : 'disabled'">{{orderTip}}</view>
		</view>

		<!-- 输入储值卡号 -->
		<!-- <u-popup :show="cardCodeShow" @close="" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-tip">请输入储值卡绑定的手机号</view>
				<view class="definition-input">
					<input type="text" v-model="valueCardCode" placeholder="请输入储值卡绑定手机号"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="cancleCardCode">取消</view>
					<view class="confirm-btn" @click="submitCardCode">确认</view>
				</view>
			</view>
		</u-popup> -->

		<!-- 收款码 -->
		<u-popup :show="payQrcodeShow" @close="closePayQrcodeShow" mode="center">
			<view>
				<image :src="payQrcode" mode="widthFix" :show-menu-by-longpress="true"></image>
				<view class="pay-code-tip">长按保存图片，用微信扫一扫识别并付款</view>
			</view>
		</u-popup>

		<!-- 微信支付确认 -->
		<u-popup :show="wxPayShow" @close="closeWxPayShow" mode="center">
			<view class="definition-box">
				<view class="definition-tip">请确认是否已向商家付款</view>
				<view class="pay-tip">如商家核实您未成功支付，此订单将被关闭</view>
				<view class="definition-btn-box">
					<view @click="closeWxPayShow">未支付</view>
					<view class="confirm-btn" @click="submitCloseWxPayShow">支付成功</view>
				</view>
			</view>
		</u-popup>

		<!-- 海报分享 -->
		<qrcode-poster ref="poster" :goodsList="goodsList" :storeInfo="storeInfo" :userInfo="userInfo"
			:reserveOrder="reserveOrder" :orderPosterInfo="orderPosterInfo" @canvasState="canvasState"
			@canvasGoodsPic="canvasGoodsPic" @closePoster="closePoster"></qrcode-poster>

		<yp-qrcode :text="qrcodeCont" ref="orderQrcode" :size="size" :quality="quality" @canvasQrcode="canvasQrcode"
			v-if="qrcodeShow"></yp-qrcode>
	</view>
</template>

<script>
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	import date from '@/common/js/date.js'
	import qrcodePoster from '@/components/qrcode-poster/qrcode-poster.vue' // 海报
	import ypQrcode from "@/components/yp-qrcode/yp-qrcode.vue"
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				userInfo: {},
				storeInfo: {},
				goodsList: [],
				totalPrice: 0,
				deliveryTime: '',
				// payWayList: [{
				// 	img: this.config.imgUrl + 'card.png',
				// 	way: '储值卡支付',
				// 	select: false,
				// 	value: 1
				// }, {
				// 	img: this.config.imgUrl + 'weChatPay.png',
				// 	way: '微信支付',
				// 	select: false,
				// 	value: 2
				// }],
				paymentMethod: '',
				// cardCodeShow: false,
				// valueCardCode: '', // 储值卡号
				payQrcode: '',
				payQrcodeShow: false,
				wxPayShow: false,
				storeId: '',
				cardNum: 0,
				amountCount: 0,
				orderTip: '确认支付',
				orderState: true,
				receivingWay: '',
				addressInfo: {},
				storeDeliveryAttr: {},
				serveTime: '', // 送达时间
				deliveryFee: 0, // 配送费
				orderPrice: 0,
				orderId: '',
				isPay: false, // 是否开启微信支付
				paymentType: '', // 4-收款码支付 2微信支付
				isPacket: false,
				userAccount: 0,
				pickupWayList: [{
					name: '自己取单',
					value: 1
				}, {
					name: '给您送达',
					value: 2
				}],
				addressId: '',
				deliveryState: false,
				tomorrowStatus: false,
				orderSnapshot: '',
				reserveOrder: false,
				qrcodeCont: '',
				size: 180,
				quality: 'L',
				orderPosterInfo: {},
				orderQrcode: '',
				qrcodeShow: false,
				payTimer: false
			}
		},
		components: {
			ypNav
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.goodsList = uni.getStorageSync('goodsList')
			console.log('商品列表', this.goodsList)
			this.totalPrice = options.totalPrice
			this.deliveryTime = options.deliveryTime
			this.storeId = options.storeId
			this.getCurrentStoreInfo()
			this.userInfo = uni.getStorageSync('userInfo')
			this.getCardNum()
			this.receivingWay = options.receivingWay
			this.getIsStorePay() // 店铺是否开启微信支付
			this.tomorrowStatus = options.tomorrowStatus == undefined ? false : Boolean(options.tomorrowStatus)
		},
		onShow() {
			console.log('地址id', this.addressId)
			this.addressId = uni.getStorageSync('addressId')
			if (this.receivingWay == '2') {
				if (this.addressId === '') {
					// 未选择过地址
					// this.orderState = false
					// this.getAddressInfo() // 配送订单获取地址信息
				} else {
					this.getAddressById()
				}
			}
			this.getStoreAttr() // 获取店铺配送属性
		},
		computed: {
			/* 配送费 */
			orderInfo() {
				if (this.receivingWay == 2) {
					// 配送
					if (parseFloat(this.totalPrice) < this.storeDeliveryAttr.deliveryFree) {
						// 商品价格小于免配送费金额
						this.deliveryFee = this.storeDeliveryAttr.deliveryFee
					} else {
						this.deliveryFee = 0
					}
				} else {
					this.deliveryFee = 0
				}
				this.orderPrice = parseFloat(this.totalPrice) + this.deliveryFee
			}
		},
		methods: {
			/* 获取当前店铺信息 */
			getCurrentStoreInfo() {
				let that = this
				that.request({
					url: `${that.config.stores}/${this.storeId}`
				}).then((res) => {
					console.log(res.data)
					const data = res.data.data
					that.storeInfo = data
					that.payQrcode = data.payeeCode
					that.orderState = data.storeTransaction // 禁止下单
					if (!that.orderState) {
						that.orderTip = '暂不支持下单'
					}
					if (data.storeType == 3) {
						// 预定版
						that.orderTip = '生成订单'
					}
				})
			},
			// 定位
			location() {
				uni.getLocation({
					type: 'wgs84', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						console.log(res)
						const latitude = res.latitude
						const longitude = res.longitude
						uni.openLocation({
							latitude: latitude,
							longitude: longitude,
							success: function() {
								console.log('success')
							}
						})
					}
				})
			},
			/* 选择支付方式 */
			// selectPayWay(item) {
			// 	console.log(item)
			// 	item.select = true
			// 	this.paymentMethod = item.value
			// 	if (item.way == '储值卡支付') {
			// 		this.cardCodeShow = true
			// 	} else if (item.way == '微信支付') {
			// 		this.payQrcodeShow = true
			// 	}
			// },
			// cancleCardCode() {
			// 	this.valueCardCode = ''
			// 	this.paymentMethod = ''
			// 	this.payWayList[0].select = false
			// 	this.cardCodeShow = false
			// },
			// submitCardCode() {
			// 	if (this.valueCardCode === '') {
			// 		uni.showToast({
			// 			title: '请输入储值卡号',
			// 			icon: 'none'
			// 		})
			// 	} else if (!(/^1[3456789]\d{9}$/.test(this.valueCardCode))) {
			// 		uni.showToast({
			// 			title: '储值卡号格式不正确',
			// 			icon: 'none'
			// 		})
			// 	} else {
			// 		this.cardCodeShow = false
			// 	}
			// },
			async wxPay() {
				if(this.payTimer) return 
				this.payTimer = true
				// if (this.payQrcode === null) {
				// 	// 未设置收款码
				// 	uni.showToast({
				// 		title: '请先设置店铺收款码',
				// 		icon: 'none'
				// 	})
				// } else {
				// 	if (this.isPay) {
				// 		// 开启微信支付
				// 		this.paymentType = 2
				// 		this.orderTip = '提交中'
				// 		this.orderState = false
				// 		this.submitOrder()
				// 	} else {
				// 		this.paymentType = 1
				// 		this.payQrcodeShow = true
				// 	}
				// }

				if (this.storeInfo.storeType == 3) {
					// 预定版 直接提交订单，不支付，默认传参扫码支付
					this.paymentType = 1
					this.orderTip = '提交中'
					this.orderState = false
					this.reserveOrder = true
					let pic = await this.submitOrder()
					this.payTimer = false
				} else {
					if (this.isPay) {
						wx.requestSubscribeMessage({
							tmplIds: ['nX58DGMw6zSLY2A_RolgoFv1UAAYOvX_GK6Adn5WUGg',
								'SG8Mzezq5jvj154pKAFAD--pfKwB0AHqFZIrckUJPLE'
							],
							success(res) {
								console.log('订阅成功', res)
							},
							fail(err) {
								console.log('订阅失败', err)
							}
						})
						// 开启微信支付
						this.paymentType = 2
						this.orderTip = '提交中'
						this.orderState = false
						this.submitOrder()
					} else {
						// 未开启微信支付
						if (this.payQrcode === null) {
							// 未设置收款码
							uni.showToast({
								title: '请先设置店铺收款码',
								icon: 'none'
							})
						} else {
							wx.requestSubscribeMessage({
								tmplIds: ['nX58DGMw6zSLY2A_RolgoFv1UAAYOvX_GK6Adn5WUGg',
									'SG8Mzezq5jvj154pKAFAD--pfKwB0AHqFZIrckUJPLE'
								],
								success(res) {
									console.log('订阅成功', res)
								},
								fail(err) {
									console.log('订阅失败', err)
								}
							})
							// 设置收款码
							this.paymentType = 4
							if (this.orderPrice == 0) {
								// 直接提交订单
								this.orderTip = '提交中'
								this.orderState = false
								this.submitOrder()
							} else {
								this.payQrcodeShow = true
							}
						}
					}
					this.payTimer = false
				}
			},
			/* 创建订单 */
			async submitOrder() {
				let that = this
				// if (that.paymentMethod === '') {
				// 	uni.showToast({
				// 		title: '请选择支付方式',
				// 		icon: 'none'
				// 	})
				// } else {
				let arr = []
				that.goodsList.forEach(item => {
					arr.push({
						productId: item.productId,
						quantity: item.num
					})
				})
				let userAccount = 0
				that.request({
					url: that.config.orderOperation,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeInfo.id,
						orderItems: arr,
						paymentMethod: that.paymentType,
						receivingWay: that.receivingWay,
						district: that.addressInfo.district,
						address: that.addressInfo.address,
						consignee: that.addressInfo.consignee,
						gender: that.addressInfo.gender,
						contact: that.addressInfo.contact,
						addressLongitude: that.addressInfo.longitude,
						addressLatitude: that.addressInfo.latitude,
						// paymentType: that.paymentType,
						consumptionDeduction: that.isPacket,
						orderSnapshot: that.orderSnapshot,
						tomorrowStatus: that.tomorrowStatus
						// valueCardCode: that.valueCardCode
					}
				}).then(res => {
					console.log('创建订单', res)
					if (res.data.code == '200000') {
						that.orderId = res.data.data
						if (that.isPay && that.orderPrice != 0 && that.storeInfo.storeType != 3) {
							// 开启微信支付 || 非预定版店铺
							that.getPayParameters() // 获取支付参数
						} else {
							if (that.storeInfo.storeType == 3) {
								if (this.isPacket) {
									// 选择红包抵扣
									userAccount = this.userAccount
								}
								that.orderPosterInfo = {
									storeName: that.storeInfo.name,
									logo: that.storeInfo.logo,
									avatar: that.userInfo.avatar,
									nickName: that.userInfo.nickname,
									receivingWay: that.receivingWay == '1' ? '自己取单' : '给您送达',
									goodsList: that.goodsList,
									amountReceived: that.orderPrice,
									allowTakeTime: that.deliveryTime,
									userAccount: userAccount
								}
								if (that.tomorrowStatus) {
									// 明日订单
									const time = new Date().getTime() + 86400 * 1000
									that.orderPosterInfo.allowTakeTime = date.getDateTime(time).startDate + ' ' + that.deliveryTime
								} else {
									// 今日订单
									that.orderPosterInfo.allowTakeTime = date.getDateTime().startDate + ' ' + that.deliveryTime
								}
								that.qrcodeShow = true
								let orderInfo = {
									orderId: that.orderId
								}
								that.qrcodeCont = JSON.stringify(orderInfo)
							} else {
								uni.showToast({
									title: '创建成功',
									icon: 'none'
								})
								setTimeout(() => {
									uni.reLaunch({
										url: './paySucc'
									})
								}, 2000)
							}
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
				// }
			},
			closePayQrcodeShow() {
				this.payQrcodeShow = false
				this.wxPayShow = true
			},
			closeWxPayShow() {
				this.wxPayShow = false
				// this.paymentMethod = ''
				// this.payWayList[1].select = false
			},
			/* 微信支付成功 */
			submitCloseWxPayShow() {
				this.orderTip = '提交中'
				this.orderState = false
				this.wxPayShow = false
				// 微信支付成功后自动提交订单
				this.submitOrder()
			},
			/* 获取订单可获的卡片数量 */
			getCardNum() {
				let that = this
				that.request({
					url: that.config.estimateCardCount,
					data: {
						amount: that.totalPrice,
						storeId: that.storeId
					}
				}).then(res => {
					console.log('订单可获卡片数', res)
					const data = res.data.data
					that.cardNum = data.cardCount
					that.amountCount = data.amountCount
				})
			},
			/* 获取地址信息 */
			getAddressInfo() {
				let that = this
				that.request({
					url: that.config.shippingAddresses,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log('获取地址', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.addressInfo = data[0]
						that.isOutDeliveryRange() // 是否超出配送范围
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取店铺配送属性 */
			getStoreAttr() {
				let that = this
				that.request({
					url: `${that.config.storeDeliveries}/${that.storeId}`
				}).then(res => {
					console.log('店铺属性', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.storeDeliveryAttr = data
						let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
						let time = new Date(dateDay + ' ' + data.deliveryTime)
						let deliveryTime = time.getTime() + parseFloat(data.estimatedTime) *
							3600000 // 开始配送时间转换成时间戳  +  配送用时（毫秒）
						that.serveTime = date.parseTime(deliveryTime, "{h}:{i}")
						that.timeJudgment() // 当前时间与店铺配送时间判断
						that.getPacketUserInfo()
					} else {
						console.log('未开启配送')
						// 不支持配送
						// this.isDelivery = false
						this.pickupWayList = [{
							name: '自己取单',
							value: 1
						}]
					}
				})
			},
			/* 修改地址 */
			editAddress() {
				uni.navigateTo({
					url: '../address/address?id=' + this.addressInfo.id
				})
			},
			/* 是否超出配送范围 */
			isOutDeliveryRange() {
				let that = this
				that.request({
					url: that.config.deliveryRange,
					data: {
						storeId: that.storeId,
						addressLongitude: that.addressInfo.longitude,
						addressLatitude: that.addressInfo.latitude
					}
				}).then(res => {
					console.log('是否超出配送范围', res)
					if (!res.data.data) {
						// 超出配送范围
						that.orderTip = '超出配送范围'
						that.orderState = false
						that.deliveryState = false
					} else {
						// 未超出配送范围
						that.orderTip = '确认支付'
						that.orderState = true
						that.deliveryState = true
					}
				})
			},
			/* 获取微信支付参数 */
			getPayParameters() {
				let that = this
				that.request({
					url: `${that.config.wechatPay}/${that.orderId}/JSAPIPayParam`
				}).then(res => {
					console.log('微信支付参数', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						uni.requestPayment({
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: 'prepay_id=' + data.payId,
							signType: data.signType,
							paySign: data.paySign,
							success(res) {
								uni.showToast({
									title: '支付成功'
								})
								// uni.showToast({
								// 	title: '创建成功',
								// 	icon: 'none'
								// })
								setTimeout(() => {
									uni.reLaunch({
										url: './paySucc'
									})
								}, 2000)
							},
							fail() {
								setTimeout(() => {
									uni.reLaunch({
										url: './waitPay?orderId=' + that.orderId
									})
								}, 2000)
							}
						})
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取店铺是否开启微信支付 */
			getIsStorePay() {
				let that = this
				that.request({
					url: `${that.config.openJsApiPayStatus}/${that.storeId}`
				}).then(res => {
					console.log('店铺是否开启微信支付', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.isPay = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 使用红包 */
			selectPacket() {
				this.isPacket = !this.isPacket
				console.log('订单金额', this.orderPrice)
				console.log('红包金额', this.userAccount)
				if (this.isPacket) {
					// 选择红包抵扣
					this.orderPrice = parseFloat((this.orderPrice - parseFloat(this.userAccount)).toFixed(2))
				} else {
					this.orderPrice = parseFloat((this.orderPrice + parseFloat(this.userAccount)).toFixed(2))
				}
			},
			/* 获取用户店铺下的红包账户 */
			getPacketUserInfo() {
				let that = this
				that.request({
					url: `${that.config.bountyAccounts}?storeId=${that.storeId}&openId=${that.userInfo.openId}`
				}).then(res => {
					console.log('获取用户店铺下的红包账户', res)
					that.userAccount = res.data.data.presentBalance
					if (that.userAccount > that.orderPrice) {
						// 剩余红包金额大于订单总金额，红包显示订单金额
						that.userAccount = that.orderPrice
					}
				})
			},
			/* 切换取货方式 */
			changePickupWay(item) {
				this.receivingWay = item.value
				this.isPacket = false
				if (item.value == 1) {
					// 自己取单
					this.orderTip = '确认支付'
					this.orderState = true
					this.orderPrice = parseFloat(this.totalPrice)
					this.getCurrentStoreInfo()
					this.getCardNum()
					this.getIsStorePay() // 店铺是否开启微信支付
				} else if (item.value == 2) {
					// 给您送达
					if (this.addressId === '') {
						this.getAddressInfo() // 配送订单获取地址信息
					} else {
						this.getAddressById()
					}
				}
				this.getPacketUserInfo()
				this.getStoreAttr() // 获取店铺配送属性
			},
			/* 切换地址 */
			chooseAddress() {
				uni.navigateTo({
					url: '../address/choose?storeId=' + this.storeId + '&addressId=' + this.addressId
				})
			},
			/* 根据id获取地址详情 */
			getAddressById() {
				let that = this
				that.request({
					url: `${that.config.shippingAddresses}/${that.addressId}`
				}).then(res => {
					console.log('根据id获取地址', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.addressInfo = data
						that.isOutDeliveryRange() // 是否超出配送范围
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 时间判断 */
			timeJudgment() {
				if (this.storeDeliveryAttr.functionState == '1') {
					let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
					let time = new Date(dateDay + ' ' + this.storeDeliveryAttr.deliveryTime) // 店铺配送时间
					let deliveryTime = time.getTime() - 900000 // 店铺配送时间前15分钟
					let currentTime = new Date().getTime() // 当前时间
					if (currentTime > deliveryTime) {
						console.log('当前时间大于店铺开始配送时间')
						// 当前时间大于店铺开始配送时间
						// this.isDelivery = false
						this.pickupWayList = [{
							name: '自己取单',
							value: 1
						}]
					}
				} else {
					console.log('不支持配送')
					// 不支持配送
					// this.isDelivery = false
					this.pickupWayList = [{
						name: '自己取单',
						value: 1
					}]
				}
			},
			/* 生成海报 */
			async shareMenuPoster(res) {
				let pic = await this.sharePoster()
			},
			/* 分享海报 */
			async sharePoster() {
				var promise = new Promise((resolve, reject) => {
					setTimeout(() => {
						let pic = this.$refs.poster.showCanvas()
						resolve(pic)
					}, 100)
				})
				return promise
			},
			canvasGoodsPic(e) {
				console.log(e)
				this.orderSnapshot = e
				// this.submitOrder()
			},
			async canvasQrcode(e) {
				console.log('二维码地址', e)
				this.orderQrcode = e
				this.orderPosterInfo.orderQrcode = e
				this.shareMenuPoster()
			},
			/* 关闭订单图 */
			closePoster() {
				console.log('关闭订单图')
				uni.redirectTo({
					url: './tip',
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.store-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.store-info {
		text-align: center;
		font-size: 28rpx;
		color: #333;
		padding: 40rpx 0;
		position: relative;
	}

	.store-info image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-bottom: 10rpx;
	}

	.order-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #EEEEEE;
		font-size: 28rpx;
		color: #999;
	}

	.order-info.order-delivery {
		padding: 16rpx 0;
	}

	.order-left {
		min-width: 120rpx;
	}

	.pickup-way {
		display: flex;
		align-items: center;
	}

	.store-info.address-box:before {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 4rpx;
		background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
		background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
		background-size: 160rpx;
		content: '';
	}

	.order-tip {
		color: #333;
		min-width: 110rpx;
	}

	.order-way {
		width: 160rpx;
		height: 54rpx;
		line-height: 54rpx;
		color: #F2AB99;
		font-size: 28rpx;
		text-align: center;
		background-color: #fff;
		border: 2rpx solid #F2AB99;
	}

	.order-way:nth-child(1) {
		border-radius: 10rpx 0 0 10rpx;
	}

	.order-way:nth-child(2) {
		border-radius: 0 10rpx 10rpx 0;
	}

	.order-tip.active-way {
		color: #fff;
		background-color: #F2AB99;
	}

	.receive-tip {
		color: #333;
	}

	.phone-box {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.phone-icon {
		display: flex;
		align-items: center;
	}

	.phone-icon image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
	}

	.symbol {
		color: #ccc;
		padding: 0 14rpx;
	}

	.store-address {
		display: flex;
		align-items: center;
	}

	.store-address image {
		width: 36rpx;
		height: 36rpx;
		margin-left: 12rpx;
	}

	.goods-info {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 20rpx 20rpx 0 20rpx;
	}

	.goods-box {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.goods-img {
		display: flex;
	}

	.goods-img image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.goods-name {
		padding-top: 20rpx;
	}

	.price-num {
		text-align: right;
		padding-top: 20rpx;
	}

	.goods-price {
		color: #F2AB99;
		padding-bottom: 20rpx;
	}

	.total-price-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #999;
		border-top: 1rpx solid #EEEEEE;
		padding: 30rpx 0;
	}

	.total-price {
		color: #F2AB99;
	}

	.rule-box {
		margin: 14rpx 24rpx;
		padding: 30rpx 24rpx;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
	}

	.rule-box image {
		width: 24rpx;
		height: 24rpx;
		margin: 0 10rpx 0 0;
	}

	.card-num {
		color: #F2AB99;
	}

	.select-pay-way {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.pay-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.pay-box:last-child {
		border-bottom: 0;
	}

	.pay-way {
		display: flex;
		align-items: center;
	}

	.pay-box image {
		width: 28rpx;
		height: 22rpx;
		padding-right: 14rpx;
	}

	.select-way {
		border: 1rpx solid #333;
		width: 28rpx;
		height: 28rpx;
		border-radius: 50%;
	}

	.selected-way {
		background-color: #F2AB99;
	}

	.packet-box {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		font-size: 28rpx;
		color: #333;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.packet-left {
		display: flex;
	}

	.packet-left image {
		width: 28rpx;
		height: 22rpx;
		padding-right: 14rpx;
	}

	.order-packet {
		margin-top: -6rpx;
	}

	.packet-account {
		margin-bottom: 20rpx;
	}

	.packet-tip {
		color: #999;
		font-size: 28rpx;
		line-height: 44rpx;
	}

	.submit-order-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		padding: 20rpx;
		font-size: 28rpx;
		color: #999;
	}

	.submit-order {
		background-color: #F2AB99;
		color: #fff;
		width: 180rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 6rpx;
		text-align: center;
		margin-left: 48rpx;
	}

	.definition-box {
		margin: 40rpx;
		max-width: 480rpx;
	}

	.definition-input input {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.pay-tip {
		color: #999;
		font-size: 28rpx;
		line-height: 44rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.definition-btn-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.definition-tip {
		font-size: 28rpx;
		padding-bottom: 20rpx;
		text-align: center;
	}

	.definition-btn-box view {
		width: 180rpx;
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
		margin-left: 40rpx;
	}

	.pay-code-tip {
		font-size: 28rpx;
		color: #333;
		padding: 20rpx 0;
		text-align: center;
	}

	.disabled {
		pointer-events: none;
		background-color: #ccc;
	}

	.delivery-box {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 0 20rpx;
	}

	.order-address-tip {
		font-size: 28rpx;
		color: #F2AB99;
		padding: 20rpx 0 0;
		display: flex;
		align-items: center;
	}

	.order-address-tip image {
		width: 24rpx;
		height: 24rpx;
		margin-right: 20rpx;
	}

	.edit-address {
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
	}

	.edit-address view {
		background-color: #333;
		width: 140rpx;
		height: 54rpx;
		line-height: 54rpx;
	}

	.submit-order-cont>>>.qrcode,
	.submit-order-cont>>>.qrcode-poster{
		position: fixed;
		left: 100%;
	}
</style>