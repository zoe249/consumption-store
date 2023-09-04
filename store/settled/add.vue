<template>
	<view>
		<u-sticky>
			<view class="step-box">
				<view v-for="(item, index) in stepList" :key="index" class="step-cont"
					:class="stepIdx < index ? '' : 'active-step'">
					<view class="step-img">
						<image :src="item.img" mode="widthFix" v-if="stepIdx < index"></image>
						<image :src="item.activeImg" mode="widthFix" v-else></image>
					</view>
					<view>{{item.name}}</view>
				</view>
			</view>
		</u-sticky>
		<!-- 添加店铺 -->
		<block v-if="stepIdx == 0">
			<view class="apply-box">
				<view class="apply-tip">店铺名称（必填）</view>
				<view class="base-info">
					<input type="text" placeholder="请输入和门脸照片一致的名称" v-model="name" :placeholder-style="style">
				</view>
			</view>
			<view class="apply-box">
				<view class="verify-phone-box">
					<view class="apply-tip">手机号认证（必填）</view>
					<view v-if="phoneState">验证通过</view>
				</view>
				<view class="base-info">经营者微信手机号</view>
				<view class="verification-code-box">{{phone}}</view>
			</view>
			<view class="apply-box">
				<view class="apply-tip">店铺位置（必填）</view>
				<view class="base-info">位置有误会影响顾客到店，请仔细确认</view>
				<view class="apply-address" @click="selectLocation">
					<input type="text" placeholder="省市区" :disabled="true" class="input-right" :placeholder-style="style"
						v-model="areaValue">
					<u-icon name="arrow-right" color="#666" size="12"></u-icon>
				</view>
				<view class="base-info">
					<input type="text" placeholder="详细地址" class="input-address" :placeholder-style="style"
						v-model="address">
				</view>
			</view>
			<view class="apply-box">
				<view class="apply-tip">门脸照片（必填）</view>
				<view class="base-info">建议现场拍照上传清晰的门脸照片，更易审核通过</view>
				<block v-if="doorImg !== ''">
					<view class="goods-img-box">
						<image :src="doorImg" class="store-qrcode" mode="widthFix" />
						<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
							@click="deletePic('doorImg')">
						</image>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('doorImg')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
		</block>

		<!-- 资质认证 -->
		<block v-if="stepIdx == 1">
			<view>
				<view class="apply-box">
					<view class="apply-tip">上传身份证</view>
					<view class="base-info">请上传经营者身份证</view>
					<block v-if="identityCardFront !== ''">
						<view class="goods-img-box">
							<image :src="identityCardFront" class="store-qrcode" mode="widthFix" />
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click="deletePic('identityCardFront')">
							</image>
						</view>
					</block>
					<block v-else>
						<view class="upload-qrcode" @click="chooseImage('identityCardFront')">
							<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
							<view>请上传身份证正面</view>
						</view>
					</block>
					<block v-if="identityCardBack !== ''">
						<view class="goods-img-box">
							<image :src="identityCardBack" class="store-qrcode" mode="widthFix" />
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click="deletePic('identityCardBack')">
							</image>
						</view>
					</block>
					<block v-else>
						<view class="upload-qrcode" @click="chooseImage('identityCardBack')">
							<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
							<view>请上传身份证反面</view>
						</view>
					</block>
					<view class="input-box">
						<view>姓名</view>
						<input type="text" placeholder="姓名" v-model="idName">
					</view>
					<view class="input-box">
						<view>身份证件号码</view>
						<input type="text" placeholder="身份证件号码" v-model="idNumber">
					</view>
					<view class="input-box" @click="openIdPeriodShow">
						<view>证件生效期</view>
						<view class="identity-box">
							<view>
								<block v-if="idPeriod === ''">年/月/日</block>
								<block v-else>{{idPeriod}}</block>
							</view>
							<view>
								<u-icon name="arrow-right" color="#666" size="12"></u-icon>
							</view>
						</view>
					</view>
					<view class="input-box" @click="openIdExpiryDateShow">
						<view>证件失效期</view>
						<view class="identity-box">
							<view>
								<block v-if="idExpiryDate === ''">年/月/日</block>
								<block v-else>{{idExpiryDate}}</block>
							</view>
							<view>
								<u-icon name="arrow-right" color="#666" size="12"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="apply-box">
					<view class="apply-tip">上传营业执照</view>
					<view class="base-info">请上传上传营业执照正面照</view>
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
						</view>
					</block>
					<view class="input-box">
						<view>经营者姓名</view>
						<input type="text" placeholder="经营者姓名" v-model="operatorName">
					</view>
					<view class="input-box">
						<view>类型</view>
						<input type="text" placeholder="类型" v-model="licenseType">
					</view>
					<view class="input-box">
						<view>商户名称</view>
						<input type="text" placeholder="商户名称" v-model="storeName">
					</view>
					<view class="input-box">
						<view>注册号</view>
						<input type="text" placeholder="注册号" v-model="registrationNumber">
					</view>
					<view class="input-box">
						<view>注册地址</view>
						<input type="text" placeholder="注册地址" v-model="registeredAddress">
					</view>
					<view class="input-box" @click="openLicencePeriodShow">
						<view>执照生效期</view>
						<view class="identity-box">
							<view>
								<block v-if="licencePeriod === ''">年/月/日</block>
								<block v-else>{{licencePeriod}}</block>
							</view>
							<view>
								<u-icon name="arrow-right" color="#666" size="12"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="apply-box">
					<view class="apply-tip">其他行政材料（可选）</view>
					<view class="base-info">建议上传食品经营许可证等其他材料</view>
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
			</view>
		</block>
		<u-datetime-picker :show="idPeriodShow" v-model="idPeriodDate" mode="date" :closeOnClickOverlay="true"
			@cancel="closeIdPeriodShow" @close="closeIdPeriodShow" @confirm="confirmIdPeriod"></u-datetime-picker>
		<u-datetime-picker :show="idExpiryDateShow" v-model="idExpiryDateValue" mode="date" :closeOnClickOverlay="true"
			@cancel="closeIdExpiryDateShow" @close="closeIdExpiryDateShow" @confirm="confirmIdExpiryDate">
		</u-datetime-picker>
		<u-datetime-picker :show="licencePeriodShow" v-model="licencePeriodValue" mode="date"
			:closeOnClickOverlay="true" @cancel="closeLicencePeriodShow" @close="closeLicencePeriodShow"
			@confirm="confirmLicencePeriod"></u-datetime-picker>

		<!-- 申请状态 -->
		<block v-if="stepIdx == 2">
			<!-- 审核通过 -->
			<view v-if="auditStatus == 1" class="state-box">
				<view class="state-tip">店铺入驻申请通过</view>
				<image :src="imgUrl + 'pendOrder.png'" mode="widthFix"></image>
				<view>您可以继续完善店铺信息或跳过进入到店铺管理端</view>
			</view>
			<!-- 待审核 -->
			<view v-if="auditStatus == 2 || auditStatus == 4" class="state-box">
				<view class="state-tip">店铺入驻申请已提交，等待平台审核</view>
				<image :src="imgUrl + 'pendOrder.png'" mode="widthFix"></image>
				<view>店铺入驻申请将于1-3个工作日内审核完毕，审核结果讲以微信服务通知方式发送给您</view>
			</view>
			<!-- 审核打回 -->
			<view v-if="auditStatus == 3" class="state-box">
				<view class="state-tip">店铺入驻申请未通过，请根据审核提示重新提交材料</view>
				<image :src="imgUrl + 'pendOrder.png'" mode="widthFix"></image>
				<view>请于3个工作日内重新提交材料，如未及时提交，需重新申请</view>
			</view>
		</block>
		<view style="height: 170rpx;"></view>
		<view class="submit-btn">
			<block v-if="stepIdx == 0">
				<view @click="nextStep" class="next-step">信息无误，下一步</view>
			</block>
			<block v-if="stepIdx == 1">
				<view class="last-step" @click="lastStep">上一步</view>
				<view @click="submitApplyInfo" class="next-step">信息无误，提交申请</view>
			</block>
			<block v-if="stepIdx == 2">
				<block v-if="auditStatus == 1">
					<view class="next-step" @click="enterStore">进入店铺</view>
					<view class="next-step back-btn" @click="goCustomHomeAddApply">返回首页</view>
				</block>
				<view class="next-step" v-if="auditStatus == 2 || auditStatus == 4" @click="goCustomHome">返回首页</view>
				<view class="next-step" v-if="auditStatus == 3" @click="editApplyDetail">修改材料</view>
			</block>
		</view>
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				statusBarHeight: 0,
				imgUrl: this.config.imgUrl,
				stepList: [{
					activeImg: this.config.imgUrl + 'avatar.png',
					img: '',
					name: '添加店铺'
				}, {
					activeImg: this.config.imgUrl + 'baseinfoFill.png',
					img: this.config.imgUrl + 'baseinfo.png',
					name: '资质认证'
				}, {
					activeImg: this.config.imgUrl + 'signFill.png',
					img: this.config.imgUrl + 'sign.png',
					name: '申请状态'
				}],
				stepIdx: 0,
				doorImg: '',
				idName: '',
				idNumber: '',
				identityCardFront: '',
				identityCardBack: '',
				idPeriodShow: false,
				idPeriod: '',
				idPeriodDate: 0,
				idExpiryDateShow: false,
				idExpiryDate: '',
				idExpiryDateValue: 0,
				businessLicense: '',
				licencePeriodShow: false,
				licencePeriod: '',
				otherData: '',
				storeType: '',
				qiniuToken: '',
				style: 'color: #999; font-size: 28rpx;',
				phone: '',
				areaValue: '',
				address: '',
				state: '',
				city: '',
				district: '',
				longitude: '',
				latitude: '',
				storeId: '',
				storeInfo: {},
				name: '',
				storeName: '',
				operatorName: '',
				licenseType: '',
				licencePeriodValue: 0,
				registrationNumber: '',
				registeredAddress: '',
				auditStatus: '', // 店铺审核状态
				phoneState: false,
				scrollTop: 0,
				applyId: ''
			}
		},
		onLoad(options) {
			this.storeInfo = uni.getStorageSync('storeInfo')
			this.storeId = options.storeId == undefined ? uni.getStorageSync('storeInfo').id == undefined ? '' : uni
				.getStorageSync('storeInfo').id : options.storeId
			this.storeType = options.storeType == undefined ? '' : options.storeType
			this.phone = options.phone == undefined ? '' : options.phone
			this.phoneState = options.phoneState == 'true' ? true : false
			this.auditStatus = options.auditResult == undefined ? '' : options.auditResult
			this.applyId = options.applyId == undefined ? '' : options.applyId
			if (this.auditStatus === '') {
				// 无审核状态，新建审核
				this.stepIdx = 0
			} else {
				this.stepIdx = 2
			}
			this.getQiniuToken()
		},
		onShow() {
			this.getApplyDetailByUser()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
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
			/* 选择图片 */
			chooseImage(type) {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						if (type == 'identityCardBack' || type ==
							'identityCardFront') {
							// 上传身份证
							uni.showLoading({
								title: '识别中'
							})
							const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								url: `${that.config.protocol}${that.config.host}store-service/api/v1.0/OCRs/idCard`,
								header: {
									'Content-Type': 'multipart/form-data',
									'Authorization': 'Bearer ' + uni.getStorageSync('token'),
									'Transaction-No': new Date().getTime()
								},
								method: 'POST',
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									file: tempFilePaths[0],
									storeId: that.storeId
								},
								success: (uploadFileRes) => {
									uni.hideLoading()
									console.log(JSON.parse(uploadFileRes.data))
									const data = JSON.parse(uploadFileRes.data)
									let info = JSON.parse(data.data)
									console.log('身份证信息', info)
									if (data.code == '200000') {
										if (info.type == 'Front') {
											// 身份证正面
											that.idName = info.name
											that.idNumber = info.id
										} else if (info.type == 'Back') {
											// 身份证背面
											that.idPeriod =
												`${info.valid_date.slice(0, 4)}-${info.valid_date.slice(4, 6)}-${info.valid_date.slice(6, 8)}`
											that.idExpiryDate =
												`${info.valid_date.slice(9, 13)}-${info.valid_date.slice(13, 15)}-${info.valid_date.slice(15, 17)}`
										}
									} else {
										uni.showToast({
											title: data.detail,
											icon: 'none'
										})
									}
								},
								fail(err) {
									console.log('上传失败', err)
								}
							})
						} else if (type == 'businessLicense') {
							// 营业执照
							uni.showLoading({
								title: '识别中'
							})
							const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								url: `${that.config.protocol}${that.config.host}store-service/api/v1.0/OCRs/businessLicense`,
								header: {
									'Content-Type': 'multipart/form-data',
									'Authorization': 'Bearer ' + uni.getStorageSync('token'),
									'Transaction-No': new Date().getTime()
								},
								method: 'POST',
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									file: tempFilePaths[0],
									storeId: that.storeId
								},
								success: (uploadFileRes) => {
									uni.hideLoading()
									console.log(JSON.parse(uploadFileRes.data))
									const data = JSON.parse(uploadFileRes.data)
									let info = JSON.parse(data.data)
									console.log('营业执照信息', info)
									if (data.code == '200000') {
										that.operatorName = info.legal_representative
										that.licenseType = info.type_of_enterprise
										that.storeName = info.enterprise_name
										that.registrationNumber = info.reg_num
										that.registeredAddress = info.address
										that.licencePeriod =
											`${info.registered_date.slice(0, 4)}-${info.registered_date.slice(5, 7)}-${info.registered_date.slice(8, 10)}`
									} else {
										uni.showToast({
											title: data.detail,
											icon: 'none'
										})
									}
								},
								fail(err) {
									console.log('上传失败', err)
								}
							})
						}
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
							if (type == 'doorImg') {
								// 门脸照片
								that.doorImg = pic
							} else if (type == 'identityCardFront') {
								// 身份证正面
								that.identityCardFront = pic
							} else if (type == 'identityCardBack') {
								// 身份证反面
								that.identityCardBack = pic
							} else if (type == 'businessLicense') {
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
					});
				})
			},
			/* 删除照片 */
			deletePic(type) {
				if (type == 'doorImg') {
					// 门脸照片
					this.doorImg = ''
				} else if (type == 'identityCardFront') {
					// 身份证正面
					this.identityCardFront = ''
				} else if (type == 'identityCardBack') {
					// 身份证反面
					this.identityCardBack = ''
				} else if (type == 'businessLicense') {
					// 营业执照
					this.businessLicense = ''
				} else if (type == 'otherData') {
					// 其他材料
					this.otherData = ''
				}
			},
			/* 下一步 */
			nextStep() {
				if (this.name === '') {
					uni.showToast({
						title: '请输入店铺名称',
						icon: 'none'
					})
				} else if (this.address === '') {
					uni.showToast({
						title: '请输入店铺位置',
						icon: 'none'
					})
				} else if (this.doorImg === '') {
					uni.showToast({
						title: '请选择门脸照片',
						icon: 'none'
					})
				} else {
					this.stepIdx++
					uni.pageScrollTo({
						scrollTop: 0, //滚动到页面的目标位置
						duration: 300
					})
				}
			},
			/* 上一步 */
			lastStep() {
				uni.pageScrollTo({
					scrollTop: 0, //滚动到页面的目标位置
					duration: 300
				})
				this.stepIdx--
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
			/* 提交审核 */
			submitApplyInfo() {
				let that = this
				let nameReview = {
					name: that.name
				}
				let addressReview = {
					state: that.state,
					city: that.city,
					district: that.district,
					address: that.address,
					longitude: that.longitude,
					latitude: that.latitude
				}
				let doorFaceReview = {
					doorFace: that.doorImg
				}
				let phoneReview = {
					phone: that.phone
				}
				let identityCardReview = {
					identityCardFront: that.identityCardFront,
					identityCardBack: that.identityCardBack,
					idName: that.idName,
					idNumber: uni.$u.trim(that.idNumber),
					idPeriod: that.idPeriod,
					idExpiryDate: that.idExpiryDate
				}
				let businessLicenseReview = {
					businessLicense: that.businessLicense,
					operatorName: that.operatorName,
					licenseType: that.licenseType,
					storeName: that.storeName,
					registrationNumber: uni.$u.trim(that.registrationNumber),
					registeredAddress: that.registeredAddress,
					licencePeriod: that.licencePeriod
				}
				let otherMaterialReview = {
					otherData: that.otherData
				}
				if (that.otherData === '') {
					// 其他材料审核为空
					otherMaterialReview = {}
				}
				that.request({
					url: that.config.storeMaterials,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeType: that.storeType,
						nameReview: nameReview,
						addressReview: addressReview,
						doorFaceReview: doorFaceReview,
						phoneReview: phoneReview,
						identityCardReview: identityCardReview,
						businessLicenseReview: businessLicenseReview,
						otherMaterialReview: otherMaterialReview
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
						uni.setStorageSync('addState', false)
						that.auditStatus = 2
						that.stepIdx++
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 证件生效期 */
			openIdPeriodShow() {
				this.idPeriodShow = true
			},
			closeIdPeriodShow() {
				this.idPeriodShow = false
			},
			confirmIdPeriod(e) {
				console.log(e)
				this.idPeriod = date.parseTime(Number(e.value), "{y}-{m}-{d}")
				this.idPeriodDate = e.value
				this.idPeriodShow = false
			},
			/* 证件失效期 */
			openIdExpiryDateShow() {
				this.idExpiryDateShow = true
			},
			closeIdExpiryDateShow() {
				this.idExpiryDateShow = false
			},
			confirmIdExpiryDate(e) {
				console.log(e)
				this.idExpiryDate = date.parseTime(Number(e.value), "{y}-{m}-{d}")
				this.idExpiryDateValue = e.value
				this.idExpiryDateShow = false
			},
			/* 执照生效期 */
			openLicencePeriodShow() {
				this.licencePeriodShow = true
			},
			closeLicencePeriodShow() {
				this.licencePeriodShow = false
			},
			confirmLicencePeriod(e) {
				console.log(e)
				this.licencePeriod = date.parseTime(Number(e.value), "{y}-{m}-{d}")
				this.licencePeriodValue = e.value
				this.licencePeriodShow = false
			},
			/* 进入店铺 */
			enterStore() {
				uni.setStorageSync('addState', true)
				uni.navigateTo({
					url: '../basicInfo/basicInfo?applyId=' + this.applyId
				})
			},
			/* 返回顾客主页 */
			goCustomHome() {
				uni.navigateTo({
					url: '/custom/home/index/index?storeId=' + this.storeId
				})
			},
			/* 修改店铺材料 */
			editApplyDetail() {
				uni.navigateTo({
					url: './edit?storeId=' + this.storeId + '&applyId=' + this.applyId
				})
			},
			/* 审核通过返回主页 */
			goCustomHomeAddApply() {
				uni.setStorageSync('addState', true)
				uni.navigateTo({
					url: '/custom/home/index/index?storeId=' + this.storeId
				})
			},
			/* 根据账户获取审核详情 */
			getApplyDetailByUser() {
				let that = this
				that.request({
					url: that.config.userStoreMaterials
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						// 已申请过审核
						const data = res.data.data
						that.auditStatus = data.auditResult
						that.applyId = data.id
					}
				})
			}
		}
	}
</script>

<style scoped>
	.step-box {
		background-color: #fff;
		padding: 40rpx 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #CCCCCC;
	}

	.step-cont {
		text-align: center;
		position: relative;
		width: 112rpx;
	}

	.active-step {
		color: #F2AB99;
	}

	.active-step .step-img {
		background-color: #F2AB99;
	}

	.step-img {
		background-color: #eee;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 30rpx;
	}

	.step-img image {
		width: 30rpx;
		height: auto;
	}

	.step-cont:nth-child(n+2):after {
		content: '';
		height: 2rpx;
		width: 150rpx;
		background: #eee;
		position: absolute;
		right: 110%;
		top: 30rpx;
	}

	.step-cont.active-step:nth-child(n+2):after {
		background: #F2AB99;
	}

	.apply-box {
		margin: 20rpx 24rpx;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.apply-tip {
		font-weight: 600;
		font-size: 32rpx;
		color: #333;
	}

	.verification-code-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.upload-avatar-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.upload-tip {
		color: #333;
		font-size: 32rpx;
		padding: 40rpx 0;
		text-align: center;
	}

	.upload-avatar {
		width: 240rpx;
		height: 240rpx;
		background-color: #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}

	.submit-btn {
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #F4F4F4;
		padding: 40rpx 24rpx;
		z-index: 9999;
	}

	.submit-btn view {
		height: 80rpx;
		line-height: 80rpx;
		width: 342rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
	}

	.submit-btn view.last-step {
		background-color: transparent;
		color: #F2AB99;
		margin-right: 14rpx;
	}

	.submit-btn view.next-step {
		width: 100%;
	}

	.submit-btn view.back-btn {
		background-color: #F4F4F4;
		color: #F2AB99;
		margin-left: 14rpx;
	}

	.store-base-info {
		margin: 0 24rpx;
		padding: 0 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.apply-address {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
		color: #333;
		font-size: 28rpx;
	}

	.base-info {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
		color: #333;
		font-size: 28rpx;
	}

	.input-address {
		width: 100%;
	}

	.input-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.identity-box {
		display: flex;
		align-items: center;
	}

	.input-box input {
		text-align: right;
		min-width: 400rpx;
	}

	.upload-sign {
		background-color: #fff;
		border-radius: 10rpx;
		width: 700rpx;
		height: 340rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-qrcode {
		/* width: 700rpx; */
		height: 400rpx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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

	.delivery-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 22rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 20rpx 24rpx;
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

	.store-sign {
		width: 700rpx;
		height: auto;
	}

	.store-qrcode {
		width: 100%;
		height: auto;
	}

	.store-address {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.verify-phone-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.state-box {
		text-align: center;
		margin: 0 100rpx;
	}

	.state-box image {
		width: 108rpx;
		height: auto;
		display: block;
		margin: 100rpx auto 50rpx;
	}

	.state-tip {
		font-weight: 600;
		font-size: 32rpx;
		margin-top: 40rpx;
	}
</style>
