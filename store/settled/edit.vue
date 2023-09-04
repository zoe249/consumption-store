<template>
	<view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">店铺名称（必填）</view>
				<view v-if="applyInfo.nameReview.materialReview" class="agree-tip">审核通过</view>
				<view v-else class="disagree-tip">审核不通过</view>
			</view>
			<view v-if="!applyInfo.nameReview.materialReview" class="disagree-tip">
				审核意见：{{applyInfo.nameReview.auditOpinion}}</view>
			<view class="apply-store-name">
				<input type="text" placeholder="请输入和门脸照片一致的名称" v-model="applyInfo.nameReview.name"
					:placeholder-style="style" :disabled="applyInfo.nameReview.materialReview">
			</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">店铺位置（必填）</view>
				<view v-if="applyInfo.addressReview.materialReview" class="agree-tip">审核通过</view>
				<view v-else class="disagree-tip">审核不通过</view>
			</view>
			<view v-if="!applyInfo.addressReview.materialReview" class="disagree-tip">
				审核意见：{{applyInfo.addressReview.auditOpinion}}</view>
			<view class="address-apply-tip">位置有误会影响顾客到店，请仔细确认</view>
			<view @click="selectLocation" class="select-address">
				<view>{{areaValue}}</view>
				<block v-if="!applyInfo.addressReview.materialReview">
					<u-icon name="arrow-right" color="#666" size="12"></u-icon>
				</block>
			</view>
			<view class="select-address">
				<input type="text" placeholder="详细地址" v-model="applyInfo.addressReview.address"
					:placeholder-style="style" :disabled="applyInfo.addressReview.materialReview">
			</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">门脸照片（必填）</view>
				<view v-if="applyInfo.doorFaceReview.materialReview" class="agree-tip">审核通过</view>
				<view v-else class="disagree-tip">审核不通过</view>
			</view>
			<view v-if="!applyInfo.doorFaceReview.materialReview" class="disagree-tip">
				审核意见：{{applyInfo.doorFaceReview.auditOpinion}}</view>
			<view class="other-info-tip">建议现场拍照上传清晰的门脸照片，更易审核通过</view>
			<view class="apply-img">
				<block v-if="doorImg !== ''">
					<view class="goods-img-box" @click="previewApplyImg(doorImg)">
						<image :src="doorImg" mode="widthFix" class="identity-card-front" />
						<block v-if="!applyInfo.doorFaceReview.materialReview">
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click.stop="deletePic('doorImg')" />
						</block>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('doorImg')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">手机号认证（必填）</view>
				<view class="agree-tip">审核通过</view>
			</view>
			<view class="other-info-tip">请填写经营者微信手机号并认证</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">上传身份证</view>
				<view v-if="applyInfo.identityCardReview.materialReview" class="agree-tip">审核通过</view>
				<view v-else class="disagree-tip">审核不通过</view>
			</view>
			<view v-if="!applyInfo.identityCardReview.materialReview" class="disagree-tip">
				审核意见：{{applyInfo.identityCardReview.auditOpinion}}</view>
			<view class="other-info-tip">请上传经营者身份证</view>
			<view class="apply-img">
				<block v-if="identityCardFront !== ''">
					<view class="goods-img-box" @click="previewApplyImg(identityCardFront)">
						<image :src="identityCardFront" class="identity-card-front" mode="widthFix" />
						<block v-if="!applyInfo.identityCardReview.materialReview">
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click.stop="deletePic('identityCardFront')" />
						</block>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('identityCardFront')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
			<view class="apply-img">
				<block v-if="identityCardBack !== ''">
					<view class="goods-img-box" @click="previewApplyImg(identityCardBack)">
						<image :src="identityCardBack" mode="widthFix" />
						<block v-if="!applyInfo.identityCardReview.materialReview">
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click.stop="deletePic('identityCardBack')" />
						</block>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('identityCardBack')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
			<view>
				<view class="input-box">
					<view>姓名</view>
					<input type="text" placeholder="请输入姓名" v-model="applyInfo.identityCardReview.idName"
						:placeholder-style="style" :disabled="applyInfo.identityCardReview.materialReview">
				</view>
				<view class="input-box">
					<view>身份证件号码</view>
					<input type="text" placeholder="请输入身份证件号码" v-model="applyInfo.identityCardReview.idNumber"
						:placeholder-style="style" :disabled="applyInfo.identityCardReview.materialReview">
				</view>
				<view class="input-box" @click="openIdPeriodShow">
					<view>证件生效期</view>
					<view class="identity-box">
						<block v-if="idPeriod === ''">年/月/日</block>
						<block v-else>{{idPeriod}}</block>
					</view>
				</view>
				<view class="input-box" @click="openIdExpiryDateShow">
					<view>证件失效期</view>
					<view class="identity-box">
						<block v-if="idExpiryDate === ''">年/月/日</block>
						<block v-else>{{idExpiryDate}}</block>
					</view>
				</view>
			</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">上传营业执照</view>
				<view v-if="applyInfo.businessLicenseReview.materialReview" class="agree-tip">审核通过</view>
				<view v-else class="disagree-tip">审核不通过</view>
			</view>
			<view v-if="!applyInfo.businessLicenseReview.materialReview" class="disagree-tip">
				审核意见：{{applyInfo.businessLicenseReview.auditOpinion}}</view>
			<view class="other-info-tip">请上传营业执照正面照</view>
			<view class="apply-img">
				<block v-if="businessLicense !== ''">
					<view class="goods-img-box" @click="previewApplyImg(businessLicense)">
						<image :src="businessLicense" mode="widthFix" />
						<block v-if="!applyInfo.businessLicenseReview.materialReview">
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click.stop="deletePic('businessLicense')" />
						</block>
					</view>
				</block>
				<block v-else>
					<view class="upload-qrcode" @click="chooseImage('businessLicense')">
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
			<view>
				<view class="input-box">
					<view>经营者姓名</view>
					<input type="text" placeholder="请输入经营者姓名" v-model="applyInfo.businessLicenseReview.operatorName"
						:placeholder-style="style" :disabled="applyInfo.businessLicenseReview.materialReview">
				</view>
				<view class="input-box">
					<view>类型</view>
					<input type="text" placeholder="请输入类型" v-model="applyInfo.businessLicenseReview.licenseType"
						:placeholder-style="style" :disabled="applyInfo.businessLicenseReview.materialReview">
				</view>
				<view class="input-box">
					<view>商户名称</view>
					<input type="text" placeholder="请输入商户名称" v-model="applyInfo.businessLicenseReview.storeName"
						:placeholder-style="style" :disabled="applyInfo.businessLicenseReview.materialReview">
				</view>
				<view class="input-box">
					<view>注册号</view>
					<input type="text" placeholder="请输入注册号" v-model="applyInfo.businessLicenseReview.registrationNumber"
						:placeholder-style="style" :disabled="applyInfo.businessLicenseReview.materialReview">
				</view>
				<view class="input-box">
					<view>注册地址</view>
					<input type="text" placeholder="请输入注册地址" v-model="applyInfo.businessLicenseReview.registeredAddress"
						:placeholder-style="style" :disabled="applyInfo.businessLicenseReview.materialReview">
				</view>
				<view class="input-box" @click="openLicencePeriodShow">
					<view>执照生效期</view>
					<view class="identity-box">
						<block v-if="licencePeriod === ''">年/月/日</block>
						<block v-else>{{licencePeriod}}</block>
					</view>
				</view>
			</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">其他行政材料（可选）</view>
				<view v-if="otherMaterialReview" class="agree-tip">审核通过</view>
				<view v-else class="disagree-tip">审核不通过</view>
			</view>
			<view v-if="!otherMaterialReview" class="disagree-tip">审核意见：{{applyInfo.otherMaterialReview.auditOpinion}}
			</view>
			<view class="other-info-tip">建议上传商品经营许可证等其他材料</view>
			<view class="apply-img">
				<block v-if="otherData !== '' && otherData != null">
					<view class="goods-img-box" @click="previewApplyImg(otherData)">
						<image :src="otherData" mode="widthFix" />
						<block v-if="!otherMaterialReview">
							<image src="../../static/goods/closeIcon.png" class="delete-goods-img"
								@click.stop="deletePic('otherData')" />
						</block>
					</view>
				</block>
				<block v-else>
					<view v-if="otherMaterialReview">未上传材料</view>
					<view class="upload-qrcode" @click="chooseImage('otherData')" v-else>
						<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
					</view>
				</block>
			</view>
		</view>
		<view class="save-btn">
			<view class="cancle-btn" @click="cancleApply">取消申请</view>
			<view @click="againSubmit">重新提交</view>
		</view>

		<u-datetime-picker :show="idPeriodShow" v-model="idPeriodDate" mode="date" :closeOnClickOverlay="true"
			@cancel="closeIdPeriodShow" @close="closeIdPeriodShow" @confirm="confirmIdPeriod"></u-datetime-picker>
		<u-datetime-picker :show="idExpiryDateShow" v-model="idExpiryDateValue" mode="date" :closeOnClickOverlay="true"
			@cancel="closeIdExpiryDateShow" @close="closeIdExpiryDateShow" @confirm="confirmIdExpiryDate">
		</u-datetime-picker>
		<u-datetime-picker :show="licencePeriodShow" v-model="licencePeriodValue" mode="date"
			:closeOnClickOverlay="true" @cancel="closeLicencePeriodShow" @close="closeLicencePeriodShow"
			@confirm="confirmLicencePeriod"></u-datetime-picker>
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				style: 'color: #999; font-size: 28rpx;',
				applyInfo: {},
				agreeState: false,
				address: '',
				latitude: '',
				longitude: '',
				state: '',
				city: '',
				district: '',
				areaValue: '',
				doorImg: '',
				identityCardFront: '',
				identityCardBack: '',
				businessLicense: '',
				otherData: '',
				idPeriod: '',
				idExpiryDate: '',
				idPeriodShow: false,
				idPeriod: '',
				idPeriodDate: 0,
				idExpiryDateShow: false,
				idExpiryDate: '',
				idExpiryDateValue: 0,
				licencePeriodShow: false,
				licencePeriod: '',
				licencePeriodValue: 0,
				applyId: '',
				otherMaterialReview: false
			}
		},
		onLoad(options) {
			this.applyId = options.applyId == undefined ? '' : options.applyId
			this.getApplyDetail()
			this.getQiniuToken()
		},
		methods: {
			/* 获取审核详情 */
			getApplyDetail() {
				let that = this
				that.request({
					url: `${that.config.storeMaterials}/${that.applyId}`
				}).then(res => {
					const data = res.data.data
					that.storeType = data.storeType
					that.areaValue = data.addressReview.state + data.addressReview.city + data.addressReview
						.district
					that.doorImg = data.doorFaceReview.doorFace
					that.identityCardFront = data.identityCardReview.identityCardFront
					that.identityCardBack = data.identityCardReview.identityCardBack
					that.businessLicense = data.businessLicenseReview.businessLicense
					if (data.otherMaterialReview != null) {
						that.otherMaterialReview = data.otherMaterialReview.materialReview
						that.otherData = data.otherMaterialReview.otherData
					} else {
						// 未上传材料
						that.otherMaterialReview = true
					}
					that.idPeriod = data.identityCardReview.idPeriod
					that.idExpiryDate = data.identityCardReview.idExpiryDate
					that.licencePeriod = data.businessLicenseReview.licencePeriod
					that.applyInfo = data
				})
			},
			/* 预览图片 */
			previewApplyImg(item) {
				let arr = []
				arr.push(item)
				uni.previewImage({
					urls: arr,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				})
			},
			/* 手动选择位置定位 */
			selectLocation() {
				// 审核不通过
				if (!this.applyInfo.addressReview.materialReview) {
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
				}
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
						that.applyInfo.addressReview.address = address
					}
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
			/* 选择图片 */
			chooseImage(type) {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						if (type == 'identityCardBack' || type == 'identityCardFront') {
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
											that.applyInfo.identityCardReview.idName = info.name
											that.applyInfo.identityCardReview.idNumber = info.id
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
										that.applyInfo.businessLicenseReview.operatorName = info
											.legal_representative
										that.applyInfo.businessLicenseReview.licenseType = info
											.type_of_enterprise
										that.applyInfo.businessLicenseReview.storeName = info
											.enterprise_name
										that.applyInfo.businessLicenseReview.registrationNumber =
											info.reg_num
										that.applyInfo.businessLicenseReview.registeredAddress =
											info.address
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
			/* 证件生效期 */
			openIdPeriodShow() {
				if (!this.applyInfo.identityCardReview.materialReview) {
					this.idPeriodShow = true
				}
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
				if (!this.applyInfo.identityCardReview.materialReview) {
					this.idExpiryDateShow = true
				}
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
				if (!this.applyInfo.businessLicenseReview.materialReview) {
					this.licencePeriodShow = true
				}
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
			/* 取消申请 */
			cancleApply() {
				let that = this
				that.request({
					url: `${that.config.storeMaterials}/${that.applyId}:cancelReview`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '取消成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: './tip'
							})
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 重新提交 */
			againSubmit() {
				let that = this
				let nameReview = {
					name: that.applyInfo.nameReview.name
				}
				let addressReview = {
					state: that.applyInfo.addressReview.state,
					city: that.applyInfo.addressReview.city,
					district: that.applyInfo.addressReview.district,
					address: that.applyInfo.addressReview.address,
					longitude: that.applyInfo.addressReview.longitude,
					latitude: that.applyInfo.addressReview.latitude
				}
				let doorFaceReview = {
					doorFace: that.applyInfo.doorFaceReview.doorFace
				}
				let phoneReview = {
					phone: that.applyInfo.phoneReview.phone
				}
				let identityCardReview = {
					identityCardFront: that.applyInfo.identityCardReview.identityCardFront,
					identityCardBack: that.applyInfo.identityCardReview.identityCardBack,
					idName: that.applyInfo.identityCardReview.idName,
					idNumber: that.applyInfo.identityCardReview.idNumber,
					idPeriod: that.applyInfo.identityCardReview.idPeriod,
					idExpiryDate: that.applyInfo.identityCardReview.idExpiryDate
				}
				let businessLicenseReview = {
					businessLicense: that.applyInfo.businessLicenseReview.businessLicense,
					operatorName: that.applyInfo.businessLicenseReview.operatorName,
					licenseType: that.applyInfo.businessLicenseReview.licenseType,
					storeName: that.applyInfo.businessLicenseReview.storeName,
					registrationNumber: that.applyInfo.businessLicenseReview.registrationNumber,
					registeredAddress: that.applyInfo.businessLicenseReview.registeredAddress,
					licencePeriod: that.applyInfo.businessLicenseReview.licencePeriod
				}
				let otherMaterialReview
				if (that.applyInfo.otherMaterialReview == null) {
					// 其他材料审核为空
					otherMaterialReview = {}
				} else {
					otherMaterialReview = {
						otherData: that.applyInfo.otherMaterialReview.otherData
					}
				}
				that.request({
					url: `${that.config.storeMaterials}/${that.applyId}`,
					method: 'PUT',
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
</script>

<style scoped>
	.apply-box {
		background-color: #fff;
		margin: 22rpx 24rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		color: #333;
		font-size: 28rpx;
	}

	.apply-result {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.select-apply {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		padding: 26rpx 0;
		color: #F2AB99;
	}

	.apply-info-tip {
		color: #333;
		font-size: 32rpx;
		font-weight: 600;
		padding: 26rpx 0;
	}

	.apply-store-name {
		padding: 14rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.select-apply-result {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
	}

	.select-apply-box {
		display: flex;
		align-items: center;
		margin-left: 80rpx;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #E5E5E5;
		border-radius: 50%;
		width: 40rpx;
		height: 40rpx;
		text-align: center;
		margin-right: 8rpx;
	}

	.select-goods image {
		width: 18rpx;
		height: 12rpx;
	}

	.isSelect-goods {
		background: linear-gradient(#FFB184, #FF8E73);
		box-shadow: 10rpx 10rpx 10rpx rgba(234, 153, 155, 0.48);
		border: 1rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.input-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 14rpx;
		border-bottom: 2rpx solid #eee;
	}

	.input-box input {
		text-align: right;
	}

	.apply-img image {
		width: 100%;
		height: auto;
		display: block;
	}

	.apply-img image.identity-card-front {
		padding-bottom: 14rpx;
	}

	.save-btn {
		margin: 40rpx 24rpx;
		display: flex;
		align-items: center;
	}

	.save-btn view {
		width: 344rpx;
		border: 2rpx solid #F2AB99;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.save-btn view.cancle-btn {
		background-color: transparent;
		color: #F2AB99;
		margin-right: 14rpx;
	}

	.agree-tip {
		color: #62B279;
		font-size: 24rpx;
	}

	.disagree-tip {
		color: #f00;
		font-size: 24rpx;
		margin-bottom: 20rpx;
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
		/* width: 700rpx; */
		height: 400rpx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}

	.other-info-tip {
		font-size: 24rpx;
		color: #999;
		padding-bottom: 20rpx;
	}

	.apply-phone {
		padding-bottom: 20rpx;
	}

	.agree-state {
		color: #62B279;
		font-size: 28rpx;
	}
	
	.address-apply-tip {
		font-size: 24rpx;
		color: #999;
		padding-bottom: 6rpx;
	}
	
	.select-address {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		padding: 30rpx 0 14rpx;
		border-bottom: 2rpx solid #eee;
	}
</style>
