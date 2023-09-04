<template>
	<view>
		<u-popup :show="isShow" @close="closePoster" mode="center">
			<scroll-view scroll-y="true" :style="{ 'max-height': screenHeight + 'px'}">
				<canvas :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="my-canvas"
					class="qrcode-poster"></canvas>
			</scroll-view>
		</u-popup>
		<u-popup :show="saveShow" mode="center">
			<image :src="memuPicture" mode="widthFix" class="canvas-img"></image>
		</u-popup>
		<u-popup :show="saveShow" mode="bottom" round="10" :closeOnClickOverlay="true">
			<view class="save-img-box">
				<view @click="saveImage">
					<view class="save-img">
						<image src="../../static/goods/saveIcon.png" mode="widthFix"></image>
					</view>
					<view class="save-btn">保存到相册</view>
				</view>
				<view class="cancle-save" @click="cancleSave">取消</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			canvasMenu: Boolean, // 是否是合成菜单
			goodsInfo: Object, // 商品信息
			goodsList: Array, // 商品信息列表
			otherGoodList: Array, // 其他分类商品列表
			drinkList: Array, // 饮品商品列表
			storeInfo: Object, // 店铺信息
			date: String, // 日期
			menuWeather: String, // 天气
			userInfo: Object,
			reserveOrder: {
				type: Boolean,
				default: false
			},
			orderPosterInfo: Object
		},
		data() {
			return {
				canvasW: 0,
				canvasH: 0,
				ctx: null,
				isShow: false,
				qiniuToken: '', // 七牛云token
				memuPicture: '', // 菜单图片
				weatherPath: '',
				sunny: 'https://qiaokun.yuepong.com/sunny.png',
				snow: 'https://qiaokun.yuepong.com/snow.png',
				rain: 'https://qiaokun.yuepong.com/rain.png',
				cloudy: 'https://qiaokun.yuepong.com/cloudy.png',
				screenHeight: 0,
				newGood: 'https://qiaokun.yuepong.com/newGood.png',
				hotGood: 'https://qiaokun.yuepong.com/hotGood.png',
				no1Good: 'https://qiaokun.yuepong.com/no1.png',
				labelPath: '',
				posterBottom: 'https://qiaokun.yuepong.com/posterBottom.png',
				posterTop: 'https://qiaokun.yuepong.com/posterTop.png',
				posterOrderBg: 'https://qiaokun.yuepong.com/order-bg.png', // 预定版订单背景图
				saveShow: false,
				brand: this.config.imgUrl + 'brand.png',
				otherBrand: this.config.imgUrl + 'other.png',
				drinkImg: this.config.imgUrl + 'other.png'
			}
		},
		mounted() {
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					that.screenHeight = res.screenHeight
				}
			})
			if (this.menuWeather == '晴') {
				this.weatherPath = this.sunny
			} else if (this.menuWeather == '阴') {
				this.weatherPath = this.cloudy
			} else if (this.menuWeather == '雨') {
				this.weatherPath = this.rain
			} else if (this.menuWeather == '雪') {
				this.weatherPath = this.snow
			}
		},
		watch: {
			menuWeather() {
				if (this.menuWeather == '晴') {
					this.weatherPath = this.sunny
				} else if (this.menuWeather == '阴') {
					this.weatherPath = this.cloudy
				} else if (this.menuWeather == '雨') {
					this.weatherPath = this.rain
				} else if (this.menuWeather == '雪') {
					this.weatherPath = this.snow
				}
			}
		},
		methods: {
			async showCanvas() {
				this.isShow = true
				// uni.showLoading({
				// 	title: '海报生成中',
				// 	mask: true
				// })
				this.getQiniuToken()
				if (this.reserveOrder) {
					// 预定版
					this.canvasOrderPic()
				} else {
					if (this.canvasMenu) {
						let pic = await this.canvasMenuPic()
						return pic
					} else {
						if (this.goodsInfo.label == 1) {
							// 新品
							this.labelPath = this.newGood
						} else if (this.goodsInfo.label == 2) {
							// 人气
							this.labelPath = this.hotGood
						} else if (this.goodsInfo.label == 3) {
							// No.1
							this.labelPath = this.no1Good
						}
						this.canvasGoods()
					}
				}
			},
			/* 生成单个商品海报 */
			// async canvasGoods() {
			// 	this.ctx = uni.createCanvasContext('my-canvas', this)
			// 	this.canvasW = uni.upx2px(600); // 画布宽度
			// 	this.canvasH = uni.upx2px(1000); // 画布高度
			// 	//设置画布背景透明
			// 	this.ctx.setFillStyle('#fff')
			// 	//设置画布大小
			// 	this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
			// 	//绘制圆角背景
			// 	this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18),
			// 		'rgba(255, 255, 255, 0)')

			// 	// 绘制商品名
			// 	this.ctx.font = "30rpx iconfont";
			// 	this.ctx.setFontSize(28); //设置标题字体大小
			// 	this.ctx.setFillStyle('#333'); //设置标题文本颜色
			// 	let nameWidth = this.ctx.measureText(this.goodsInfo.name).width // 名称宽度
			// 	console.log('nameWidth', nameWidth)
			// 	let nameSize = uni.upx2px((600 - Math.floor(nameWidth) * 2) / 2)
			// 	this.ctx.fillText(this.goodsInfo.name, nameSize, (uni.upx2px(80)))
			// 	// 绘制商品英文名
			// 	this.ctx.font = "30rpx sans-serif";
			// 	this.ctx.setFontSize(24);
			// 	this.ctx.setFillStyle('#999');
			// 	let enameWidth = this.ctx.measureText(this.goodsInfo.ename).width
			// 	console.log('enameWidth', enameWidth)
			// 	let enameSize = uni.upx2px((600 - Math.floor(enameWidth) * 2) / 2)
			// 	let nameW
			// 	if (enameSize < uni.upx2px(50)) {
			// 		nameW = uni.upx2px(50)
			// 	} else {
			// 		nameW = enameSize
			// 	}
			// 	this.drawText(this.ctx, this.goodsInfo.ename, nameW, uni.upx2px(150), 0, uni.upx2px(500),
			// 		30); // 调用行文本换行函数
			// 	let lineNum = this.drawText(this.ctx, this.goodsInfo.ename, nameW, uni.upx2px(150), 0, uni.upx2px(500),
			// 		30); // 商品英文名总行数
			// 	// 绘制标签
			// 	if (this.labelPath !== '') {
			// 		let labelPath = await this.getImageInfo(this.labelPath)
			// 		let hW = uni.upx2px(126);
			// 		let hH = uni.upx2px(101);
			// 		this.drawRoundImg(this.ctx, labelPath.path, uni.upx2px(480), uni.upx2px(10), hW,
			// 			hH, 0)
			// 	}
			// 	// 绘制商品主图
			// 	let headerImg = await this.getImageInfo(this.goodsInfo.picture)
			// 	this.drawRoundImg(this.ctx, headerImg.path, uni.upx2px(50), uni.upx2px(180 + lineNum * 30), uni.upx2px(
			// 			500),
			// 		uni.upx2px(500), uni.upx2px(10))
			// 	// 绘制商品价格
			// 	this.ctx.setFontSize(40);
			// 	this.ctx.setFillStyle('#F2AB99');
			// 	let price = this.goodsInfo.marketPrice
			// 	let priceWidth = this.ctx.measureText(price).width
			// 	let priceSize = uni.upx2px((600 - Math.floor(priceWidth) * 2) / 2)
			// 	this.ctx.fillText(price, priceSize, uni.upx2px(770 + lineNum * 30))
			// 	this.ctx.setFontSize(26);
			// 	let dollar = '￥'
			// 	let dollarWidth = this.ctx.measureText(dollar).width
			// 	this.ctx.fillText(dollar, priceSize - dollarWidth * 2, uni.upx2px(770 + lineNum * 30))

			// 	// 绘制商品原料
			// 	this.ctx.setFontSize(20);
			// 	this.ctx.setFillStyle('#999');
			// 	let elementWidth = this.ctx.measureText(this.goodsInfo.element).width
			// 	let elementSize = uni.upx2px((600 - Math.floor(elementWidth) * 2) / 2)
			// 	let elementW
			// 	if (elementSize < uni.upx2px(50)) {
			// 		elementW = uni.upx2px(50)
			// 	} else {
			// 		elementW = elementSize
			// 	}
			// 	this.drawText(this.ctx, this.goodsInfo.element, elementW, uni.upx2px(830 + lineNum * 30), 0, uni
			// 		.upx2px(500),
			// 		30); // 调用行文本换行函数

			// 	//延迟渲染
			// 	setTimeout(() => {
			// 		this.ctx.draw(true, () => {
			// 			// uni.hideLoading()
			// 		})
			// 	}, 500)
			// 	// 渲染画布时延迟了500毫秒，上传七牛云存储图片也需要延迟，否则会还未渲染就上传七牛云，保存空白图片
			// 	setTimeout(() => {
			// 		this.savePic()
			// 	}, 1000)
			// },
			/* 绘制菜单 */
			async canvasMenuPic() {
				this.ctx = uni.createCanvasContext('my-canvas', this)
				this.canvasW = uni.upx2px(640); // 画布宽度
				this.canvasH = uni.upx2px(1000); // 画布高度
				//设置画布背景透明
				this.ctx.setFillStyle('#F7F7F7')
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18),
					'rgba(255, 255, 255, 0)')
				// 重新绘制海报高度
				// 面包
				if (this.goodsList.length > 3) {
					this.canvasH = uni.upx2px(1000 + Math.ceil((this.goodsList.length - 3) / 3) * 334)
				}
				// 饮品
				if (this.drinkList.length > 0 && this.drinkList.length < 4 && this.goodsList.length > 0) {
					this.canvasH += uni.upx2px(450)
				} else if (this.drinkList.length > 3 && this.goodsList.length > 0) {
					this.canvasH += uni.upx2px(Math.ceil((this.drinkList.length) / 3) * 334)
				}
				// 其他
				if (this.otherGoodList.length > 0 && this.otherGoodList.length < 4) {
					this.canvasH += uni.upx2px(450)
				} else if (this.otherGoodList.length > 3) {
					this.canvasH += uni.upx2px(Math.ceil((this.otherGoodList.length) / 3) * 334)
				}

				//设置画布背景透明
				this.ctx.setFillStyle('#F7F7F7')
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18),
					'rgba(255, 255, 255, 0)')

				// 绘制店铺名
				this.ctx.setFontSize(12); //设置标题字体大小
				this.ctx.setFillStyle('#333'); //设置标题文本颜色
				// this.ctx.fillText(this.storeInfo.name, uni.upx2px(130), uni.upx2px(250))
				let lineStoreName = this.drawText(this.ctx, this.storeInfo.name, uni.upx2px(130), uni.upx2px(250), 0, uni.upx2px(160),
					18, 'store')
				// 绘制日期
				this.ctx.setFontSize(14); //设置标题字体大小
				this.ctx.setFillStyle('#333'); //设置标题文本颜色
				this.ctx.fillText(this.date + '菜单', uni.upx2px(130), uni.upx2px(250 + lineStoreName * 40))

				// 绘制小程序码
				let weChatStoreQRCode = await this.getImageInfo(this.storeInfo.smallCode)
				this.drawRoundImg(this.ctx, weChatStoreQRCode.path, uni.upx2px(302), uni.upx2px(223), uni.upx2px(150),
					uni.upx2px(150), 0) // this.ctx,图片路径,x位置,y位置,宽,高

				// 绘制店主微信二维码
				let weChatQRCode = await this.getImageInfo(this.storeInfo.weChatQRCode)
				this.drawRoundImg(this.ctx, weChatQRCode.path, uni.upx2px(472), uni.upx2px(223), uni.upx2px(150),
					uni.upx2px(150), 0) // this.ctx,图片路径,x位置,y位置,宽,高

				// 二维码名称
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle('#999999');
				this.ctx.fillText('店铺', uni.upx2px(352), uni.upx2px(408))
				this.ctx.fillText('店主微信', uni.upx2px(493), uni.upx2px(408))

				// 绘制店铺底部背景
				let posterBottombg = await this.getImageInfo(this.posterBottom)
				let bottomH = this.canvasH - uni.upx2px(310)
				this.drawRoundImg(this.ctx, posterBottombg.path, 0, bottomH, uni.upx2px(640),
					uni.upx2px(310), 0)
				// 绘制店铺地址
				this.ctx.setFontSize(12)
				this.ctx.setFillStyle('#333')
				let address = '门店地址：' + this.storeInfo.district + this.storeInfo.address
				let addressHeight = this.canvasH - uni.upx2px(188)
				// this.drawText(this.ctx, address, uni.upx2px(20), addressHeight, 0, uni.upx2px(600),
				// 	18); // 调用行文本换行函数
				let storeLineNum = this.drawText(this.ctx, address, uni.upx2px(20), addressHeight, 0, uni.upx2px(600),
					18, 'store'); // 店铺地址总行数
				// 绘制营业时间
				this.ctx.setFontSize(12)
				this.ctx.setFillStyle('#333')
				let time = '营业时间：' + this.storeInfo.openingTime + '-' + this.storeInfo.closingTime
				let timeHeight = this.canvasH - uni.upx2px(160 - storeLineNum * 20)
				this.ctx.fillText(time, uni.upx2px(20), timeHeight)
				// 绘制店铺顶部背景
				let posterTopbg = await this.getImageInfo(this.posterTop)
				this.drawRoundImg(this.ctx, posterTopbg.path, 0, 0, uni.upx2px(640),
					uni.upx2px(226), 0)
				// 绘制店铺头像
				let storeLogo = await this.getImageInfo(this.storeInfo.logo)
				this.drawRoundImg(this.ctx, storeLogo.path, uni.upx2px(30), uni.upx2px(226), uni.upx2px(80),
					uni.upx2px(80), 0)
				// 绘制天气
				let weatherPath = await this.getImageInfo(this.weatherPath)
				this.drawRoundImg(this.ctx, weatherPath.path, uni.upx2px(494), uni.upx2px(74), uni.upx2px(110),
					uni.upx2px(110), 0) // this.ctx,图片路径,x位置,y位置,宽,高
				// 绘制商品分类
				if (this.goodsList.length > 0) {
					this.ctx.setFontSize(12)
					let brandPath = await this.getImageInfo(this.brand)
					this.drawRoundImg(this.ctx, brandPath.path, uni.upx2px(30), uni.upx2px(392), uni.upx2px(40),
						uni.upx2px(40), 0) // this.ctx,图片路径,x位置,y位置,宽,高
					this.ctx.setFillStyle('#333')
					this.ctx.fillText('面包', uni.upx2px(80), uni.upx2px(422))
					this.ctx.setFillStyle('#999')
					this.ctx.fillText('Bread', uni.upx2px(140), uni.upx2px(422))

				}

				// 绘制商品主图
				// 不要和forEach一起使用await，而是使用for循环,await 与函数一起使用，函数前需加 async
				var a = 0
				for (let i = 0; i < Math.ceil(this.goodsList.length / 3); i++) {
					for (var j = 0; j < 3; j++) {
						if (a < this.goodsList.length) {
							try {
								let picture = await this.getImageInfo(this.goodsList[a].cardPicture)
								let hW = uni.upx2px(190);
								let hH = uni.upx2px(314);
								this.drawRoundImg(this.ctx, picture.path, uni.upx2px(15 + j * 210), uni.upx2px(460 +
										i * 334),
									hW, hH, uni.upx2px(10))
							} catch (error) {
								console.log(error)
							}
						}
						a++
					}
				}
				console.log('111111111111', Math.ceil(this.goodsList.length / 3))
				var drinkHeight = 380
				if (this.goodsList.length > 0) {
					drinkHeight = 460 + Math.ceil(this.goodsList.length / 3) * 334
				}
				let otherHeight = drinkHeight + Math.ceil(this.drinkList.length / 3) * 334
				console.log('最后一个商品的高度', uni.upx2px(otherHeight))

				if (this.drinkList.length != 0) {
					// 绘制饮品分类
					this.ctx.setFontSize(12)
					let drinkPath = await this.getImageInfo(this.drinkImg)
					this.drawRoundImg(this.ctx, drinkPath.path, uni.upx2px(30), uni.upx2px(drinkHeight), uni
						.upx2px(40),
						uni.upx2px(40), 0) // this.ctx,图片路径,x位置,y位置,宽,高
					this.ctx.setFillStyle('#333')
					this.ctx.fillText('饮品', uni.upx2px(80), uni.upx2px(drinkHeight + 30))
					this.ctx.setFillStyle('#999')
					this.ctx.fillText('Drink', uni.upx2px(140), uni.upx2px(drinkHeight + 30))

					var b = 0
					for (let q = 0; q < Math.ceil(this.drinkList.length / 3); q++) {
						for (var w = 0; w < 3; w++) {
							if (b < this.drinkList.length) {
								try {
									let picture = await this.getImageInfo(this.drinkList[b].cardPicture)
									let hW = uni.upx2px(190);
									let hH = uni.upx2px(314);
									this.drawRoundImg(this.ctx, picture.path, uni.upx2px(15 + w * 210), uni.upx2px(
											drinkHeight + 60 +
											q * 334),
										hW, hH, uni.upx2px(10))
								} catch (error) {
									console.log(error)
								}
							}
							b++
						}
					}
				}

				if (this.otherGoodList.length != 0) {
					// 绘制商品分类
					this.ctx.setFontSize(12)
					let otherBrandPath = await this.getImageInfo(this.otherBrand)
					this.drawRoundImg(this.ctx, otherBrandPath.path, uni.upx2px(30), uni.upx2px(otherHeight + 50), uni
						.upx2px(40),
						uni.upx2px(40), 0) // this.ctx,图片路径,x位置,y位置,宽,高
					this.ctx.setFillStyle('#333')
					this.ctx.fillText('其他', uni.upx2px(80), uni.upx2px(otherHeight + 80))
					this.ctx.setFillStyle('#999')
					this.ctx.fillText('Other', uni.upx2px(140), uni.upx2px(otherHeight + 80))

					var b = 0
					for (let q = 0; q < Math.ceil(this.otherGoodList.length / 3); q++) {
						for (var w = 0; w < 3; w++) {
							if (b < this.otherGoodList.length) {
								try {
									let picture = await this.getImageInfo(this.otherGoodList[b].cardPicture)
									let hW = uni.upx2px(190);
									let hH = uni.upx2px(314);
									this.drawRoundImg(this.ctx, picture.path, uni.upx2px(15 + w * 210), uni.upx2px(
											otherHeight + 110 +
											q * 334),
										hW, hH, uni.upx2px(10))
								} catch (error) {
									console.log(error)
								}
							}
							b++
						}
					}
				}

				//延迟渲染
				setTimeout(() => {
					this.ctx.draw(true, () => {
						// uni.hideLoading()
					})
				}, 500)

				// 渲染画布时延迟了500毫秒，上传七牛云存储图片也需要延迟，否则会还未渲染就上传七牛云，保存空白图片
				// setTimeout(() => {
				// 	this.savePic()
				// }, 1500)
				var promise = new Promise((resolve, reject) => {
					setTimeout(() => {
						let pic = this.savePic()
						resolve(pic)
					}, 1500)
				})
				return promise
			},

			/* 绘制订单预定图 */
			async canvasOrderPic() {
				uni.showLoading({
					title: '订单生成中'
				})
				this.ctx = uni.createCanvasContext('my-canvas', this)
				this.canvasW = uni.upx2px(640); // 画布宽度
				this.canvasH = uni.upx2px(1000); // 画布高度
				//设置画布背景透明
				this.ctx.setFillStyle('#F7F7F7')
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18),
					'rgba(255, 255, 255, 0)')
				// 重新绘制海报高度
				if (this.orderPosterInfo.goodsList.length > 3) {
					this.canvasH = uni.upx2px(1000 + Math.ceil((this.orderPosterInfo.goodsList.length - 3) / 3) * 334)
				}

				//设置画布背景透明
				this.ctx.setFillStyle('#F7F7F7')
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18),
					'rgba(255, 255, 255, 0)')
				// 绘制背景图片 https://qiaokun.yuepong.com/order-bg.png
				let picture = await this.getImageInfo(this.posterOrderBg)
				await this.drawRoundImg(this.ctx, picture.path, 0, 0, uni.upx2px(640), this.canvasH, 0)
				// 绘制店铺名
				this.ctx.setFontSize(12); //设置标题字体大小
				this.ctx.setFillStyle('#333'); //设置标题文本颜色
				this.ctx.fillText(this.orderPosterInfo.storeName, uni.upx2px(300), uni.upx2px(60))

				// 绘制店铺头像
				let storeLogo = await this.getImageInfo(this.orderPosterInfo.logo)
				this.drawRoundImg(this.ctx, storeLogo.path, uni.upx2px(200), uni.upx2px(20), uni.upx2px(80),
					uni.upx2px(80), uni.upx2px(40))

				//设置画布背景透明
				let rectWidth = uni.upx2px(206 * 3)
				let rectHeight = uni.upx2px(Math.ceil((this.orderPosterInfo.goodsList.length) / 3) * 354) + uni.upx2px(
					180)
				// this.orderPosterInfo.userAccount = '29.9'
				if (this.orderPosterInfo.userAccount != 0) {
					rectHeight = rectHeight + uni.upx2px(50)
				}
				//绘制圆角背景
				this.roundRect(this.ctx, uni.upx2px(10), uni.upx2px(130), rectWidth, rectHeight, uni.upx2px(18),
					'rgba(255, 255, 255, 0.5)')

				// 绘制用户头像
				let userLogo = await this.getImageInfo(this.orderPosterInfo.avatar)
				this.drawRoundImg(this.ctx, userLogo.path, uni.upx2px(30), uni.upx2px(150), uni.upx2px(80),
					uni.upx2px(80), uni.upx2px(40))

				// 绘制用户昵称
				this.ctx.setFontSize(12); //设置标题字体大小
				this.ctx.setFillStyle('#333'); //设置标题文本颜色
				this.ctx.fillText(this.orderPosterInfo.nickName, uni.upx2px(130), uni.upx2px(200))
				this.ctx.fillText(this.orderPosterInfo.receivingWay, uni.upx2px(500), uni.upx2px(200))
				
				let addressHeight = rectHeight + uni.upx2px(100)
				let totalHeight = addressHeight + uni.upx2px(50)
				// 绘制消费红包抵扣
				if (this.orderPosterInfo.userAccount != 0) {
					addressHeight = rectHeight + uni.upx2px(50)
					totalHeight = addressHeight + uni.upx2px(50)
					this.ctx.setFontSize(12)
					this.ctx.setFillStyle('#333')
					this.ctx.fillText('消费红包抵扣', uni.upx2px(20), addressHeight)
					this.ctx.fillText('￥-' + this.orderPosterInfo.userAccount, this.canvasW - uni.upx2px(16 * this.orderPosterInfo.userAccount.length + 35), addressHeight)
					let amountReceived = '￥' + (this.orderPosterInfo.amountReceived - this.orderPosterInfo.userAccount)
						.toFixed(2)
					this.ctx.fillText('合计 ' + amountReceived, this.canvasW - uni.upx2px(16 * amountReceived.length + 65), totalHeight)
				} else {
					let amountReceived = '￥' + this.orderPosterInfo.amountReceived.toFixed(2)
					totalHeight = addressHeight
					this.ctx.fillText('合计 ' + amountReceived, this.canvasW - uni.upx2px(16 * amountReceived.length + 65), totalHeight)			
				}
				// 绘制取餐时间
				// let dateHeight = this.canvasH - uni.upx2px(250)
				let dateHeight = totalHeight + uni.upx2px(100)
				let allowTakeTime = this.orderPosterInfo.allowTakeTime
				// 绘制透明背景
				this.roundRect(this.ctx, uni.upx2px(10), dateHeight - uni.upx2px(35), rectWidth, uni.upx2px(50), uni
					.upx2px(10),
					'rgba(255, 255, 255, 0.5)')
				this.ctx.fillText('取餐时间', uni.upx2px(20), dateHeight)
				this.ctx.fillText(allowTakeTime + '之后', this.canvasW - uni.upx2px(15 * allowTakeTime.length + 20),
					dateHeight)
				let codeHeight = dateHeight + uni.upx2px(80)
				const text = '温馨提示：商家接收订单后，可在“我的-订单”中查看订单信息'
				this.drawText(this.ctx, text, uni.upx2px(20), codeHeight, 0, uni.upx2px(450),
					18, 'store');

				// 绘制订单二维码
				let orderQrcode = await this.getImageInfo(this.orderPosterInfo.orderQrcode)
				this.drawRoundImg(this.ctx, orderQrcode.path, this.canvasW - uni.upx2px(100), codeHeight, uni.upx2px(
						80),
					uni.upx2px(80), 0)

				// 绘制商品主图
				// 不要和forEach一起使用await，而是使用for循环,await 与函数一起使用，函数前需加 async
				var a = 0
				for (let i = 0; i < Math.ceil(this.orderPosterInfo.goodsList.length / 3); i++) {
					for (var j = 0; j < 3; j++) {
						if (a < this.orderPosterInfo.goodsList.length) {
							try {
								let picture = await this.getImageInfo(this.orderPosterInfo.goodsList[a].cardPicture)
								let hW = uni.upx2px(190);
								let hH = uni.upx2px(300);
								// 绘制背景
								this.roundRect(this.ctx, uni.upx2px(15 + j * 210), uni.upx2px(170 + (i + 1) * 354), hW, uni.upx2px(60), uni.upx2px(10), '#fff')

								await this.drawRoundImg(this.ctx, picture.path, uni.upx2px(15 + j * 210), uni.upx2px(
										250 + i * 354),	hW, hH, uni.upx2px(10))
								// 绘制商品数量
								this.ctx.setFontSize(8); //设置标题字体大小
								this.ctx.setFillStyle('#333'); //设置标题文本颜色
								this.ctx.fillText('   数量', uni.upx2px(15 + j * 210), uni.upx2px(210 + (i + 1) * 354))
								this.ctx.setFillStyle('#F2AB99'); //设置标题文本颜色
								this.ctx.fillText('x' + this.orderPosterInfo.goodsList[a].num, uni.upx2px((j + 1) *
									210 - 30), uni.upx2px(210 +
									(i + 1) * 354))
							} catch (error) {
								console.log(error)
							}
						}
						a++
					}
				}
				let otherHeight = 400 + Math.ceil(this.orderPosterInfo.goodsList.length / 3) * 334

				//延迟渲染
				setTimeout(() => {
					this.ctx.draw(true, () => {
						uni.hideLoading()
					})
				}, 500)

				var promise = new Promise((resolve, reject) => {
					setTimeout(() => {
						let pic = this.savePic()
						resolve(pic)
					}, 1500)
				})
				return promise
			},
			/**
			 * 
			 * @param {CanvasContext} ctx canvas上下文
			 * @param {number} x 圆角矩形选区的左上角 x坐标
			 * @param {number} y 圆角矩形选区的左上角 y坐标
			 * @param {number} width 圆角矩形选区的宽度
			 * @param {number} height 圆角矩形选区的高度
			 * @param {number} radius 圆角的半径
			 * @param {number} color 圆角的半径
			 */
			roundRect(ctx, x, y, width, height, radius, color) {
				ctx.beginPath()
				ctx.save()
				ctx.setLineWidth(1)
				ctx.setFillStyle(color);
				ctx.setStrokeStyle(color)
				// 左上角
				ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
				// 右上角
				ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
				// 右下角
				ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
				// 左下角
				ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)

				ctx.stroke()
				ctx.clip()
				ctx.fillRect(x, y, width, height)
				ctx.restore()
			},

			/* 行文本换行 */
			drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, fontSize, attribute) {
				let lineWidth = 0;
				let lineNum = 0; // 几行文本
				let lastSubStrIndex = 0; //每次开始截取的字符串的索引
				for (let i = 0; i < str.length; i++) {
					lineWidth += ctx.measureText(str[i]).width;
					if (lineWidth > canvasWidth) {
						lineNum++
						let strsWidth = this.ctx.measureText(str.substring(lastSubStrIndex, i)).width // 原料宽度
						let strsSize = uni.upx2px((600 - Math.floor(strsWidth) * 2) / 2)
						if (attribute == 'store') {
							ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
						} else {
							ctx.fillText(str.substring(lastSubStrIndex, i), strsSize, initHeight); //绘制截取部分
						}
						initHeight += fontSize;
						lineWidth = 0;
						lastSubStrIndex = i;
					}
					if (i == str.length - 1) { //绘制剩余部分
						let strWidth = this.ctx.measureText(str.substring(lastSubStrIndex, i + 1)).width // 原料宽度
						let strSize = uni.upx2px((600 - Math.floor(strWidth) * 2) / 2)
						if (attribute == 'store') {
							ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
						} else {
							ctx.fillText(str.substring(lastSubStrIndex, i + 1), strSize, initHeight);
						}
					}
				}
				lineNum = lineNum + 1;
				return lineNum;
			},

			//带圆角图片
			drawRoundImg(ctx, img, x, y, width, height, radius) {
				ctx.beginPath()
				ctx.save()
				// 左上角
				ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
				// 右上角
				ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
				// 右下角
				ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
				// 左下角
				ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)
				ctx.stroke()
				ctx.clip()
				ctx.drawImage(img, x, y, width, height);
				ctx.restore()
				ctx.closePath()
			},
			//圆角矩形
			drawRoundRect(ctx, x, y, width, height, radius, color) {
				ctx.save();
				ctx.beginPath();
				ctx.setFillStyle(color);
				ctx.setStrokeStyle(color)
				ctx.setLineJoin('round'); //交点设置成圆角
				ctx.setLineWidth(radius);
				ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius);
				ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
			},
			//获取图片
			getImageInfo(imgSrc) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: (image) => {
							resolve(image);
						},
						fail: (err) => {
							reject(err);
							this.$emit('closeLoad')
							// uni.hideLoading()
							this.isShow = false
						}
					});
				});
			},
			// 判断是否有相册权限
			saveImage() {
				let that = this
				uni.showLoading({
					title: '保存中'
				})
				uni.getSetting({
					success(res) {
						if (Object.keys(res.authSetting).length > 0) {
							if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
								// 未授权相册权限时，授权提示
								uni.authorize({
									scope: 'scope.writePhotosAlbum',
									success() {
										that.savePic()
									}
								})
							} else if (res.authSetting['scope.writePhotosAlbum']) {
								// 相册授权直接保存
								that.savePic()
							} else {
								// 已授权相册，但是关闭授权后，重新打开设置权限打开相册权限
								uni.openSetting({
									success(res) {
										console.log('设置权限', res.authSetting)
									}
								})
							}
						}
					}
				})
			},
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					console.log(res)
					that.qiniuToken = res.data.data.qiNiuToken
					// that.savePic()
				})
			},
			/* 保存海报到相册 */
			async savePic() {
				var that = this
				var promise = new Promise((resolve, reject) => {
					uni.canvasToTempFilePath({
						canvasId: 'my-canvas',
						quality: 1,
						complete: (res) => {
							console.log('图片地址', res.tempFilePath)
							if (that.saveShow) {
								uni.getImageInfo({
									src: that.memuPicture,
									success: function(image) {
										console.log(image);
										uni.saveImageToPhotosAlbum({
											filePath: image.path,
											success(res) {
												uni.showToast({
													title: '已保存到相册',
													icon: 'success',
													duration: 2000
												})
												setTimeout(() => {
													that.saveShow =
														false
													that.isShow = false
													that.$emit(
														'closePoster',
														false)
												}, 2000)
											},
											complete() {
												uni.hideLoading()
											}
										})
									}
								})
							} else {
								let pic = that.uploadQiniu(res.tempFilePath)
								resolve(pic)
							}
						}
					}, this);
				})
				return promise
			},
			/* 上传七牛云 */
			async uploadQiniu(imgPath) {
				let that = this
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				var promise = new Promise((resolve, reject) => {
					wx.uploadFile({
						url: that.config.uploadUrl,
						name: 'file',
						filePath: imgPath,
						header: {
							"Content-Type": "multipart/form-data"
						},
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: function(res) {
							console.log('上传成功', res)
							// 图片上传成功之后，返回画布渲染完成状态
							let pic = 'https://qiaokun.yuepong.com/' + JSON.parse(res.data).key
							that.memuPicture = pic
							console.log('生成海报完成', pic)
							that.$emit('canvasGoodsPic', pic)
							resolve(pic)
							if (!that.reserveOrder) {
								// 非预定
								// that.isShow = false
								if (that.storeInfo.storeAttribute == '2') {
									// 个性版
									that.saveShow = false
								}
							}
							that.shareFriend()
							uni.hideLoading()
						},
						fail: function(err) {
							console.log('上传失败', err)
							uni.showToast({
								title: '图片上传失败，请重新操作',
								icon: 'none'
							})
							that.isShow = false
						}
					})
				})
				return promise
			},
			/* 保存弹窗 */
			saveImgShow() {
				this.isShow = false
				this.saveShow = true
			},
			cancleSave() {
				this.saveShow = false
				this.$emit('closePoster', false)
			},
			closePoster() {
				this.isShow = false
				this.$emit('closePoster', false)
			},
			/* 发送给微信好友 */
			shareFriend() {
				let that = this
				that.isShow = false
				wx.downloadFile({
					url: that.memuPicture,
					success: (res) => {
						wx.showShareImageMenu({
							path: res.tempFilePath,
							complete() {
								that.$emit('closePoster', false)
								that.$emit('closeLoad')
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 999;

		.save-btn {
			margin-top: 35rpx;
			color: #FFFFFF;
			background: linear-gradient(to right, #FE726B, #FE956B);
			padding: 15rpx 40rpx;
			border-radius: 50rpx;
		}
	}

	.poster-img {
		max-height: 1000rpx;
	}

	.poster-img image {
		width: 100%;
		height: auto;
	}

	.shadow-canvas {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.save-img-box {
		background-color: #ededed;
		color: #999;
		font-size: 28rpx;
		text-align: center;
		position: relative;
		z-index: 23;
	}

	.save-img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 40rpx auto 20rpx;
	}

	.save-img image {
		width: 48rpx;
		height: auto;
	}

	.cancle-save {
		background-color: #fff;
		text-align: center;
		color: #333;
		padding: 20rpx 0;
		margin-top: 60rpx;
	}

	.canvas-img {
		height: auto;
		width: 650rpx;
	}

	// .qrcode-poster {
	// 	position: fixed;
	// 	left: 100%;
	// }
</style>