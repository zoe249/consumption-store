<template>
	<view>
		<view class="add-goods-box">
			<view class="name-input">
				<input type="text" placeholder="商品主名" :placeholder-style="style" v-model="name" />
			</view>
			<view class="name-input">
				<input type="text" placeholder="商品副名" :placeholder-style="style" v-model="enName" />
			</view>
			<view class="select-label">
				<yp-dropdown :filterData="labelList" :addGoods="true" ref="dropdown" :defaultIndex="labelIdx"
					@onSelected="selectLabel">
				</yp-dropdown>
			</view>
			<view class="upload-cont">
				<block v-if="goodsPath === ''">
					<view class="upload-btn" @click="selectImg">
						<image src="../../static/goods/uploadIcon.png"></image>
					</view>
				</block>
				<block v-else>
					<view class="goods-img-box">
						<image :src="goodsPath" class="goods-img" mode="widthFix" />
						<image src="../../static/goods/closeIcon.png" class="delete-goods-img" @click="deletePic">
						</image>
					</view>
				</block>
				<yp-cropper mode="fixed" :width="2000" :height="2000" :maxWidth="2000" :maxHeight="2000" :url="goodsImg"
					@cancel="oncancel" @ok="onok"></yp-cropper>
			</view>
			<view class="price-box">
				<view>￥</view>
				<view class="price-input">
					<input type="digit" placeholder="请输入金额" v-model="marketPrice" :placeholder-style="style" />
				</view>
			</view>
			<view class="weight-input-box">
				<view class="weight-input">
					<view>重量约</view>
					<input type="number" placeholder="请输入商品重量" v-model="weight" :placeholder-style="style">
					<view>g</view>
				</view>
				<view class="cal-input">|</view>
				<view class="weight-input">
					<view>热量</view>
					<input type="number" placeholder="请输入商品热量" v-model="calorie" :placeholder-style="style">
					<view>cal</view>
				</view>
			</view>
			<view class="element-desc-box" v-if="productClass == '0101'">
				<view class="select-element-box">
					<view v-for="(item, index) in elementDesc" :key="index" class="bake-type"
						:class="elementDescIdx == index ? 'bake-active' : ''" @click="changeElementDesc(index)">
						{{item.name}}
					</view>
				</view>
				<view class="goods-element-box" :class="elementDescIdx == 0 ? 'select-element' : ''">
					<block v-if="elementDescIdx == 0">
						<view v-for="(item, idx) in selectElementList" :key="idx" class="selected-element">{{item}}
						</view>
					</block>
					<block v-if="elementDescIdx == 1">
						<textarea v-model="featureDescribe" placeholder="请输入商品特色描述" :placeholder-style="style" />
					</block>
				</view>
			</view>
			<view class="element-desc-box" v-if="productClass != '0101'">
				<view class="select-desc">商品特色</view>
				<view class="goods-element-box">
					<textarea v-model="featureDescribe" placeholder="请输入商品特色描述" :placeholder-style="style" />
				</view>
			</view>
		</view>
		<view class="bake-way-box" v-if="productClass == '0101'">
			<view class="bake-type-box">
				<view v-for="(item, index) in bakeWayList" :key="index" class="bake-type"
					:class="bakeType == item.value ? 'bake-active' : ''" @click="changeBakeTime(item)">{{item.name}}
				</view>
			</view>
			<view class="bake-time-box">
				<block v-if="bakeType == 1">
					<view class="bake-hour-tip">烘焙时间</view>
					<view class="select-bake-time" @click="openBakeTimeShow">
						<view>{{bakeTime}}</view>
						<image src="../../static/store/downArrow.png" mode="widthFix"></image>
					</view>
					<!-- <view class="bake-time select-bake-time">
						<view class="select-bake-time-img" :class="disabledReduceTime ? 'disabled-time' : ''">-</view>
						<input type="digit" v-model="bakeTime" />
						<view class="select-bake-time-img" :class="disabledAddTime ? 'disabled-time' : ''">+</view>
					</view> -->
				</block>
				<block v-if="bakeType == 2">
					<view class="bake-hour-tip">商品出炉时间</view>
					<picker mode="time" :value="bakeTimeEnd" @change="changeBakeTimeEnd">
						<view class="bake-time bake-time-end">
							<view class="uni-input">{{bakeTimeEnd}}</view>
							<image src="../../static/goods/bakeTime.png" class="bake-time-img"></image>
						</view>
					</picker>
					<!-- <view>{{bakeTimeEnd}}</view> -->
				</block>
			</view>
		</view>
		<!-- <view class="bake-hour" v-if="bakeType == 1 && productClass == '1'">
			<view>出炉时段</view>
			<view class="time-box">
				<view v-for="(item, index) in timeList" :key="index" class="finish-time"
					:class="item.select ? 'finish-active' : ''" @click="changeFinishTime(item)">{{item.time}}</view>
			</view>
		</view> -->
		<view class="bake-hour" @click="goEditFullDeac">
			<view>图文详情(选填)</view>
			<view class="desc-box">
				<image src="../../static/store/setArrow.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- <image :src="verificationCode" mode="widthFix"></image> -->
		<button class="add-btn" @tap="$u.throttle(verifyGoodsInfo, 500)">创建</button>
		<view style="height: 20rpx;"></view>

		<!-- 原料选择 -->
		<u-popup :show="elementShow" mode="bottom" :closeable="true" @close="closeElement">
			<view class="element-title">选择原料</view>
			<scroll-view scroll-y="true" class="element-cont">
				<view class="select-element-cont">
					<view class="element-head">
						<view class="element-tip">主料</view>
						<view class="add-element-icon" @click="openAddElement('1')">
							<u-icon name="plus" color="#fff" size="18"></u-icon>
						</view>
					</view>
					<view class="element-box">
						<block v-for="(item, index) in mainElementList" :key="index">
							<view class="element" :class="item.select ? 'element-active' : ''"
								@click="selectMainElement(item)" @longpress="openDeleteElement">{{item.name}}
								<image src="../../static/goods/closeIcon.png" class="delete-element" v-if="deleteShow"
									@click.stop="deleteMainElement(index, item)"></image>
							</view>
						</block>
					</view>
				</view>
				<view class="select-element-cont">
					<view class="element-head">
						<view class="element-tip">配料</view>
						<view class="add-element-icon" @click="openAddElement('2')">
							<u-icon name="plus" color="#fff" size="18"></u-icon>
						</view>
					</view>
					<view class="element-box">
						<block v-for="(item, idx) in elementList" :key="idx">
							<view class="element" :class="item.select ? 'element-active' : ''"
								@click="selectMainElement(item)" @longpress="openDeleteElement">{{item.name}}
								<image src="../../static/goods/closeIcon.png" class="delete-element" v-if="deleteShow"
									@click.stop="deleteSecElement(idx, item)"></image>
							</view>
						</block>
					</view>
				</view>
			</scroll-view>
			<view class="element-btn" @click="saveDeleteElement" v-if="deleteShow">保存</view>
		</u-popup>

		<!-- 添加原料 -->
		<u-modal :show="addElementShow" @confirm="addElement" @cancel="cancelAddElement" :showCancelButton="true"
			confirmColor="#F2AB99">
			<u-input v-model="elementName" placeholder="请输入主料/配料" placeholderStyle="text-align: center; color: #ccc;">
			</u-input>
		</u-modal>

		<!-- 海报分享 -->
		<qrcode-poster ref="poster" :goodsInfo="goodsInfo" :canvasMenu="false" @canvasGoodsPic="canvasGoodsPic">
		</qrcode-poster>

		<!-- 选择烘焙时间 -->
		<u-popup :show="bakeTimeShow" @close="closeBakeTimeShow">
			<picker-view :indicator-style="indicatorStyle" :value="bakeTimeValue" @change="selectBakeTime"
				class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item, index) in hours" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item, index) in minutes" :key="index">{{item}}分</view>
				</picker-view-column>
			</picker-view>
		</u-popup>

		<!-- 选择时间 -->
		<!-- <u-datetime-picker :show="timeShow" v-model="bakeTimeEnd" mode="time" :closeOnClickOverlay="true"
			@confirm="confirmBakeTime" @cancel="cancleBakeTime"></u-datetime-picker> -->
	</view>
</template>

<script>
	import qrcodePoster from '@/components/qrcode-poster/qrcode-poster.vue' // 海报
	import ypCropper from '@/components/yp-cropper/yp-cropper.vue'
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		data() {
			return {
				style: 'color: #ccc; font-size: 28rpx; line-height: 60rpx;',
				storeId: '',
				userInfo: {}, // 用户信息
				src: '',
				fileList1: [],
				qiniuToken: '', //七牛云token
				key: '', //上传文件的key值
				marketPrice: '', //金额
				name: '', //名称
				enName: '', // 英文名称
				element: '', //原料
				bakeTime: '30分钟', //烘烤用时
				// bakedEnd: '', //出炉时间
				elementShow: false, // 原料选择弹出
				mainElementList: [], // 主料列表
				elementList: [], // 配料列表
				addElementShow: false,
				elementName: '',
				elementType: '', // 原料类型
				selectElement: false, // 是否有已选中的原料
				selectElementList: [],
				selectElementIdList: [],
				fullDescription: '', // 图文详情
				timeList: [{
					time: '上午',
					select: true
				}, {
					time: '下午',
					select: false
				}],
				labelList: [
					[{
						text: '无',
						value: 0
					}, {
						text: '新品',
						value: 1
					}, {
						text: '人气',
						value: 2
					}, {
						text: 'NO.1',
						value: 3
					}]
				],
				labelIdx: [0],
				label: '', // 标签
				goodsInfo: {},
				goodsImg: '', // 商品图片
				goodsPath: '', // 商品图片路径
				cardPicture: '',
				bakeWayList: [{
					value: 1,
					name: '手动烘焙'
				}, {
					value: 2,
					name: '自动烘焙'
				}],
				bakeType: 1, // 烘焙形式
				// timeShow: false,
				bakeTimeEnd: '', // 预计出炉时间
				elementDesc: [{
					value: 1,
					name: '原料选择'
				}, {
					value: 2,
					name: '商品特色'
				}],
				elementDescIdx: 1,
				featureDescribe: '', // 商品特色
				deleteShow: false,
				deleteElementList: [], // 删除的原料列表
				disabledReduceTime: false,
				disabledAddTime: false,
				productClass: '',
				storeInfo: {},
				verificationCode: '',
				hours: ['00', '01', '02', '03', '04', '05', '06'],
				minutes: ['00', '10', '20', '30', '40', '50'],
				bakeTimeShow: false,
				indicatorStyle: `height: 100rpx;`,
				bakeTimeValue: [0],
				weight: '',
				calorie: ''
			}
		},
		components: {
			qrcodePoster,
			ypCropper
		},
		watch: {
			featureDescribe() {
				if (this.featureDescribe.length > 50) {
					uni.showToast({
						title: '商品特色描述不可超过50个字',
						icon: 'none'
					})
					setTimeout(() => {
						this.featureDescribe = this.featureDescribe.substring(0, 50)
					}, 10)
				}
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.label = this.labelList[0][0].value
			this.userInfo = uni.getStorageSync('userInfo')
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = this.storeInfo.id
			uni.setStorageSync('fullDescription', '')
			this.getQiniuToken()
			this.bakeTimeEnd = this.storeInfo.openingTime
			this.productClass = options.productClass
		},
		onShow() {
			this.fullDescription = uni.getStorageSync('fullDescription')
		},
		methods: {
			getStores() {
				let that = this
				that.request({
					url: that.config.stores + `/${that.storeId}`,
				}).then(res => {
					let data = res.data.data
					that.store = data
				})
			},
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			/* 上传图片 */
			verifyGoodsInfo() {
				let that = this
				// if (that.timeList[0].select && (!that.timeList[1].select)) {
				// 	// 只选择上午
				// 	that.bakedEnd = '1'
				// } else if ((!that.timeList[0].select) && that.timeList[1].select) {
				// 	// 只选择下午
				// 	that.bakedEnd = '2'
				// } else if (that.timeList[0].select && that.timeList[1].select) {
				// 	// 上午下午都选择
				// 	that.bakedEnd = '3'
				// }
				if (that.selectElementList.length != 0) {
					// 原料选择
					let arr = []
					that.mainElementList.forEach(item => {
						if (item.select) {
							arr.push(item.name)
						}
					})
					that.elementList.forEach(item => {
						if (item.select) {
							arr.push(item.name)
						}
					})
					that.element = arr.join(' | ') // 拼接原料
					// that.featureDescribe = '' // 清空商品特色
					// that.bakeTimeEnd = '' // 预计出炉时间
				}
				if (that.bakeType == 2) {
					// 自动烘焙,出炉时段为全天
					// that.bakedEnd = '3'
					that.bakeTime = '' // 清空烘烤用时
				} else if (that.bakeType == 1) {
					// 手动烘焙
					that.bakeTimeEnd = '' // 预计出炉时间
				}
				if (that.productClass != '0101') {
					// 其他分类商品
					that.bakeTime = ''
					// that.bakedEnd = ''
					that.element = ''
					that.bakeType = ''
					that.bakeTimeEnd = ''
				}
				if (that.name.length > 10) {
					uni.showToast({
						title: '商品名称不得超过10个字',
						icon: 'none'
					})
				} else if (that.name === '') {
					uni.showToast({
						title: '请输入商品名称',
						icon: 'none'
					})
				} else if (that.label === '') {
					uni.showToast({
						title: '请选择商品标签',
						icon: 'none'
					})
				} else if (that.marketPrice === '') {
					uni.showToast({
						title: '请输入商品价格',
						icon: 'none'
					})
				// } else if (that.bakedEnd === '' && that.productClass == '1') {
				// 	uni.showToast({
				// 		title: '请选择出炉时间',
				// 		icon: 'none'
				// 	})
				} else if (that.goodsPath === '') {
					uni.showToast({
						title: '请上传商品图片',
						icon: 'none'
					})
				} else if (that.featureDescribe.length > 50) {
					uni.showToast({
						title: '商品特色不得超过50个字',
						icon: 'none'
					})
				} else {
					that.uploadFilePromise()
				}
			},
			/* 上传图片 */
			uploadFilePromise() {
				let that = this
				uni.showToast({
					title: '创建中',
					icon: 'loading'
				})
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				console.log('上传七牛云地址', that.verificationCode)
				let filePath
				if (that.verificationCode === '') {
					// 上传商品主图
					filePath = that.goodsPath
				} else {
					// 上传商品卡片图
					filePath = that.verificationCode
				}
				console.log('上传图片', filePath)
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: filePath,
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
							if (that.verificationCode === '') {
								// 上传商品主图
								that.key = data.key
								that.getProductImg() // 获取商品卡片图
							} else {
								// 上传商品卡片图
								that.cardPicture = 'https://qiaokun.yuepong.com/' + data.key
								that.addProdcut() // 保存商品
							}
							// setTimeout(() => {
							// 	resolve(res.data.data)
							// }, 1000)
							// that.canvasGoodsPoster() // 绘制商品海报
							// that.cardPicture = 'https://qiaokun.yuepong.com/' + data.key
							// that.addProdcut() // 保存商品
						},
						fail(err) {
							console.log('上传失败', err)
						}
					});
				})
			},
			/* 删除商品图片 */
			deletePic() {
				this.goodsImg = ''
				this.goodsPath = ''
			},
			/* 绘制商品海报 */
			// canvasGoodsPoster() {
			// 	let that = this
			// 	that.goodsInfo.name = that.name
			// 	that.goodsInfo.ename = that.enName
			// 	that.goodsInfo.label = that.label
			// 	that.goodsInfo.picture = 'https://qiaokun.yuepong.com/' + that.key
			// 	that.goodsInfo.marketPrice = that.marketPrice
			// 	if (that.elementDescIdx == 0) {
			// 		// 无原料
			// 		that.goodsInfo.element = that.element
			// 	} else {
			// 		that.goodsInfo.element = that.featureDescribe
			// 	}
			// 	that.goodsInfo.bakeTime = that.bakeTime
			// 	that.goodsInfo.bakedEnd = that.bakedEnd
			// 	console.log('传入的商品信息', that.goodsInfo)
			// 	setTimeout(() => {
			// 		that.$refs.poster.showCanvas()
			// 	}, 1000)
			// },
			/* 创建商品 */
			addProdcut() {
				let that = this
				let bakeTime
				if (that.bakeTime.indexOf('分钟') > -1) {
					// 烘焙时间小于1小时
					bakeTime = (parseInt(that.bakeTime) / 60).toFixed(2)
				} else {
					bakeTime = parseFloat(that.bakeTime)
				}
				console.log('烘焙时间', bakeTime)
				let picture = 'https://qiaokun.yuepong.com/' + that.key
				console.log('传入接口的主图地址', picture)
				that.request({
					url: that.config.products,
					method: 'POST',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						unionId: that.userInfo.uid,
						picture: picture,
						marketPrice: that.marketPrice,
						name: that.name,
						bakeTime: bakeTime,
						bakedEnd: '3',
						element: that.element,
						fullDescription: that.fullDescription,
						enable: true,
						ename: that.enName, // 英文名
						label: that.label, // 标签
						cardPicture: that.cardPicture,
						bakeType: that.bakeType,
						bakeTimeEnd: that.bakeTimeEnd,
						featureDescribe: that.featureDescribe,
						productClass: that.productClass,
						weight: that.weight,
						calorie: that.calorie,
						topProduct: false
					}
				}).then(res => {
					let data = res.data
					if (data.code == 200000) {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取原料列表 */
			getElementList() {
				let that = this
				that.mainElementList = []
				that.elementList = []
				that.request({
					url: that.config.elementList + '/' + that.storeId
				}).then(res => {
					console.log('原料', res)
					console.log('选择的原料', that.selectElementIdList)
					res.data.data.forEach(item => {
						item.select = false
						if (item.type == 1) {
							// 主料
							that.mainElementList.push(item)
						} else if (item.type == 2) {
							that.elementList.push(item)
						}
						that.selectElementList.forEach(id => {
							if (id == item.name) {
								item.select = true
							}
						})
					})
				})
			},
			openElement() {
				// if (!this.selectElement) {
				this.getElementList()
				// }
				this.elementShow = true
				this.deleteShow = false
			},
			closeElement() {
				this.selectElementList = []
				this.selectElementIdList = []
				this.mainElementList.forEach(item => {
					if (item.select) {
						// 有已选中的原料
						this.selectElement = true
						this.selectElementList.push(item.name)
						this.selectElementIdList.push(item.id)
					}
				})
				this.elementList.forEach(item => {
					if (item.select) {
						// 有已选中的原料
						this.selectElement = true
						this.selectElementList.push(item.name)
						this.selectElementIdList.push(item.id)
					}
				})
				this.elementShow = false
			},
			/* 选择主料 */
			selectMainElement(item) {
				console.log(item)
				item.select = !item.select
			},
			/* 打开新增原料弹窗 */
			openAddElement(type) {
				this.elementName = ''
				this.elementType = type
				this.closeElement()
				// this.elementShow = false
				this.addElementShow = true
			},
			/* 关闭新增原料弹窗 */
			cancelAddElement() {
				// this.elementShow = true
				this.addElementShow = false
			},
			/* 添加主料/配料 */
			addElement() {
				uni.$u.throttle(this.saveAddElement, 500)
			},
			saveAddElement() {
				let that = this
				that.request({
					url: that.config.elementList,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer' + ' ' + uni.getStorageSync('token'),
						'Transaction-No': new Date().getTime()
					},
					data: {
						type: that.elementType,
						name: that.elementName,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 200000) {
						that.addElementShow = false
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						})
						that.selectElementList.push(that.elementName)
						that.getElementList()
						that.elementShow = true
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 切换出炉时间 */
			// changeFinishTime(item) {
			// 	item.select = !item.select
			// },
			goEditFullDeac() {
				let fullDesc = uni.getStorageSync('fullDescription')
				uni.navigateTo({
					url: '../goods/detail?fullDesc=' + fullDesc + '&editGood=true'
				})
			},
			/* 选择标签 */
			selectLabel(res) {
				this.label = res[0][0].value
			},
			/* 选择商品主图 */
			selectImg() {
				let that = this
				uni.chooseImage({
					count: 1,
					success: (rst) => {
						if (that.storeInfo.storeAttribute == '1') {
							// 标准版
							that.goodsImg = ''
							that.goodsPath = rst.tempFilePaths[0]
						} else {
							// 设置url的值，显示控件
							that.goodsImg = rst.tempFilePaths[0]
							console.log('goodsImg', that.goodsImg)
						}
					}
				})
			},
			onok(ev) {
				console.log('ev', ev)
				this.goodsImg = ''
				this.goodsPath = ev.path
			},
			oncancel() {
				// url设置为空，隐藏控件
				this.goodsImg = ''
			},
			/* 海报绘制完成 */
			canvasGoodsPic(e) {
				console.log('完成', e)
				this.cardPicture = e
				this.addProdcut()
			},
			/* 切换烘焙形式 */
			changeBakeTime(item) {
				this.bakeType = item.value
			},
			/* 选择商品出炉时间 */
			// selectBakeTime() {
			// 	this.timeShow = true
			// },
			// cancleBakeTime() {
			// 	this.timeShow = false
			// },
			// confirmBakeTime(e) {
			// 	console.log('出炉时间', e)
			// 	this.bakeTimeEnd = e.value
			// 	this.timeShow = false
			// },
			/* 切换原料、商品特色 */
			changeElementDesc(index) {
				this.elementDescIdx = index
				if (index == 0) {
					// 原料选择
					this.openElement()
				}
			},
			openDeleteElement() {
				this.deleteShow = true
				this.deleteElementList = []
			},
			/* 删除主料 */
			deleteMainElement(index, item) {
				this.mainElementList.splice(index, 1)
				this.deleteElementList.push(item.id)
			},
			/* 删除配料 */
			deleteSecElement(index, item) {
				this.elementList.splice(index, 1)
				this.deleteElementList.push(item.id)
			},
			/* 保存删除原料 */
			saveDeleteElement() {
				let that = this
				console.log('删除原料列表', this.deleteElementList)
				// let idArr = this.deleteElementList.join(',')
				// console.log('删除原料列表arr', idArr)
				that.request({
					url: that.config.deleteElement,
					method: 'DELETE',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						listId: that.deleteElementList
					}
				}).then(res => {
					console.log('删除原料', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						that.elementShow = false
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 增加出炉时段 */
			addBakeTime() {
				this.bakeTime = (parseFloat(this.bakeTime) + 0.1).toFixed(1)
				if (this.bakeTime > 24) {
					this.bakeTime = (parseFloat(this.bakeTime) - 0.1).toFixed(1)
					this.disabledAddTime = true
				} else if (this.bakeTime == 24) {
					this.disabledAddTime = true
				} else {
					this.disabledAddTime = false
					this.disabledReduceTime = false
				}
			},
			reduceBakeTime() {
				this.bakeTime = (parseFloat(this.bakeTime) - 0.1).toFixed(1)
				if (this.bakeTime < 0) {
					this.bakeTime = (parseFloat(this.bakeTime) + 0.1).toFixed(1)
					this.disabledReduceTime = true
				} else if (this.bakeTime == 0) {
					this.disabledReduceTime = true
				} else {
					this.disabledAddTime = false
					this.disabledReduceTime = false
				}
			},
			/* 选择商品出炉时间 */
			changeBakeTimeEnd(e) {
				console.log(e)
				this.bakeTimeEnd = e.detail.value
			},
			/* 获取商品海报 */
			getProductImg() {
				let that = this
				let bakeTime
				if (that.bakeTime.indexOf('分钟') > -1) {
					// 烘焙时间小于1小时
					bakeTime = (parseInt(that.bakeTime) / 60).toFixed(2)
				} else {
					bakeTime = parseFloat(that.bakeTime)
				}
				that.goodsPath = 'https://qiaokun.yuepong.com/' + that.key
				uni.request({
					url: that.config.protocol + that.config.host + that.config.productImg,
					method: 'POST',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime(),
						'Authorization': 'Bearer' + ' ' + uni.getStorageSync('token')
					},
					data: {
						storeId: that.storeId,
						unionId: that.userInfo.uid,
						picture: 'https://qiaokun.yuepong.com/' + that.key,
						marketPrice: that.marketPrice,
						name: that.name,
						bakeTime: bakeTime,
						bakedEnd: '3',
						element: that.element,
						fullDescription: that.fullDescription,
						enable: true,
						ename: that.enName, // 英文名
						label: that.label, // 标签
						// cardPicture: that.cardPicture,
						bakeType: that.bakeType,
						bakeTimeEnd: that.bakeTimeEnd,
						featureDescribe: that.featureDescribe,
						productClass: that.productClass
					},
					responseType: 'arraybuffer',
					success(res) {
						console.log('获取卡片图', res)
						if (res.statusCode == '200') {
							// 将后端返回的图片显示到前端
							let url = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data)
							// base64格式转换成临时图片路径
							base64ToPath(url)
								.then(path => {
									console.log('转换成功', path)
									that.verificationCode = path
									that.uploadFilePromise()
								})
								.catch(error => {
									console.error(error)
								})
						} else {
							uni.showToast({
								title: '生成失败',
								icon: 'none'
							})
						}
					}
				})
			},
			openBakeTimeShow() {
				this.bakeTimeShow = true
			},
			closeBakeTimeShow() {
				this.bakeTimeShow = false
			},
			/* 改变烘焙时间 */
			selectBakeTime(e) {
				console.log(e)
				let hourIdx = e.detail.value[0]
				let hour = parseFloat(this.hours[hourIdx])
				let minIdx = e.detail.value[1]
				let minute = parseFloat(this.minutes[minIdx])
				if (hour < 1) {
					// 小于一小时展示分钟
					this.bakeTime = minute + '分钟'
				} else {
					this.bakeTime = hour + parseFloat((minute / 60).toFixed(2)) + '小时'
				}

			}
		}
	}
</script>

<style scoped>
	.add-goods-box {
		background-color: #fff;
		padding: 20rpx 0 0;
		position: relative;
	}

	.upload-cont>>>.u-upload__wrap {
		margin: 0 auto;
	}

	.upload-cont {
		margin: 40rpx 0 0;
	}

	.name-input {
		width: 440rpx;
		height: 60rpx;
		border: 2rpx dashed #F2AB99;
		border-radius: 10rpx;
		text-align: center;
		margin: 0 auto 20rpx;
		font-size: 28rpx;
	}

	.name-input:last-child {
		margin: 0 auto;
	}

	.name-input input {
		height: 60rpx;
		line-height: 60rpx;
	}

	.select-label {
		position: absolute;
		right: 24rpx;
		top: 20rpx;
	}

	.upload-btn {
		width: 500rpx;
		height: 500rpx;
		background-color: rgba(0, 0, 0, 0.1);
		position: relative;
		margin: 0 auto;
	}

	.upload-btn image {
		position: absolute;
		left: 50%;
		margin-left: -30rpx;
		top: 50%;
		margin-top: -30rpx;
		width: 60rpx;
		height: 60rpx;
	}

	.goods-img-box {
		width: 500rpx;
		position: relative;
		margin: 0 auto;
	}

	.goods-img {
		width: 500rpx;
		height: auto;
	}

	.delete-goods-img {
		position: absolute;
		right: -15rpx;
		top: -15rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.price-box {
		text-align: center;
		color: #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 40rpx 0 0;
		font-size: 28rpx;
	}

	.price-input {
		width: 160rpx;
		margin-left: 16rpx;
	}

	.price-input input {
		height: 60rpx;
		line-height: 60rpx;
		border: 2rpx dashed #F2AB99;
		border-radius: 10rpx;
	}

	.element-desc-box {
		margin: 0 24rpx;
		padding: 40rpx 0 20rpx;
	}

	.select-element-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}

	.goods-element-box {
		border: 2rpx dashed #F2AB99;
		border-radius: 10rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.goods-element-box textarea {
		padding: 20rpx;
		width: 100%;
		height: 200rpx;
	}

	.goods-desc-box {
		border: 2rpx dashed #F2AB99;
		border-radius: 10rpx;
		min-height: 200rpx;
	}

	.select-element {
		padding: 20rpx 0 20rpx 20rpx;
	}

	.selected-element {
		background-color: #FCEEEB;
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
		padding: 0 24rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin: 0 30rpx 20rpx 0;
	}

	.select-desc {
		background-color: #FCEEEB;
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
		border-radius: 10rpx;
		font-size: 28rpx;
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.bake-way-box {
		background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx 24rpx;
		padding: 30rpx 20rpx;
	}

	.bake-type-box {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.bake-type {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #999;
		background-color: #ddd;
		text-align: center;
	}

	.bake-type:nth-child(1) {
		border-top-left-radius: 10rpx;
		border-bottom-left-radius: 10rpx;
	}

	.bake-type:nth-child(2) {
		border-top-right-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
	}

	.bake-active {
		background-color: #F2AB99;
		color: #fff;
	}

	.bake-time-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20rpx;
	}

	.bake-hour {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
	}

	.select-bake-time {
		display: flex;
		align-items: center;
	}

	.select-bake-time image {
		width: 20rpx;
		height: auto;
		margin-left: 10rpx;
	}

	/* .select-bake-time-img {
		border: 1rpx solid #ccc;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
	}

	.disabled-time {
		border-color: #eee;
	}

	.select-bake-time input {
		width: 100rpx;
		height: 60rpx;
		border: 1rpx solid #ccc;
		border-right: 0;
		border-left: 0;
		text-align: center;
		color: #F2AB99;
	} */

	.bake-time>>>.u-number-box__input {
		margin: 0;
		width: 100rpx !important;
		border: 1rpx solid #ccc;
	}

	.bake-time-end {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 260rpx;
		border: 1rpx solid #ccc;
		padding: 20rpx;
		color: #999;
		font-size: 28rpx;
		border-radius: 10rpx;
	}

	.bake-time-img {
		width: 28rpx;
		height: 28rpx;
	}

	.time-box {
		display: flex;
		align-items: center;
	}

	.finish-time {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #999;
		background-color: #EBEBEB;
		border: 1rpx solid #999;
		text-align: center;
		margin-right: 34rpx;
	}

	.finish-time:last-child {
		margin-right: 0;
	}

	.finish-active {
		color: #F2AB99;
		background-color: #FCEEEB;
		border: 1rpx solid #F2AB99;
	}

	.desc-box {
		display: flex;
		align-items: center;
	}

	.desc-box image {
		width: 10rpx;
		height: auto;
		margin-left: 14rpx;
	}

	.add-btn {
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		margin: 112rpx 24rpx 20rpx;
		border-radius: 50rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	/* 原料 */
	.element-title {
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		padding: 26rpx 0;
	}

	.element-cont {
		max-height: 600rpx;
		margin-bottom: 40rpx;
	}

	.select-element-cont {
		display: flex;
		align-items: flex-start;
		padding: 20rpx 0 0;
		margin: 0 24rpx;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.element-head {
		display: flex;
		align-items: center;
	}

	.element-tip {
		min-width: 50rpx;
		margin-right: 36rpx;
		font-size: 24rpx;
	}

	.add-element-icon {
		background-color: #F2AB99;
		padding: 12rpx;
		border-radius: 6rpx;
	}

	.element-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.element {
		min-width: 160rpx;
		background-color: #F4F4F4;
		color: #999;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 6rpx;
		margin: 0 0 20rpx 20rpx;
		text-align: center;
		font-size: 24rpx;
		border: 1rpx solid #D1DCE1;
		position: relative;
	}

	.delete-element {
		position: absolute;
		right: -15rpx;
		top: -15rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.element-active {
		background-color: #FCEEEB;
		color: #F2AB99;
		border: 1rpx solid #F2AB99;
	}

	.element-btn {
		margin: 20rpx 24rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background-color: #F2AB99;
		color: #fff;
		border-radius: 50rpx;
		font-size: 26rpx;
	}

	.picker-view {
		height: 600rpx;
	}

	.item {
		line-height: 68rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.weight-input-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 40rpx 26rpx 0;
	}

	.weight-input {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	.weight-input input {
		width: 224rpx;
		height: 60rpx;
		line-height: 60rpx;
		border: 2rpx solid #ccc;
		border-radius: 10rpx;
		text-align: center;
		margin: 0 10rpx;
	}
	
	.cal-input{
		color: #ccc;
	}
</style>
