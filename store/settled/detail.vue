<template>
	<view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">店铺名称（必填）</view>
				<view v-if="nameMaterialReview == 1" class="agree-state">审核通过</view>
			</view>
			<view class="apply-store-name">{{applyInfo.nameReview.name}}</view>
			<block v-if="nameMaterialReview != 1">
				<view class="select-apply">
					<view>审核结果</view>
					<view class="select-apply-result">
						<block v-for="(item, index) in applyResult" :key="index">
							<view class="select-apply-box" @click="changeApplyResult('materialReview', item)">
								<view class="select-goods"
									:class="applyInfo.nameReview.materialReview == item.value ? 'isSelect-goods' : ''">
									<block v-if="applyInfo.nameReview.materialReview == item.value">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<textarea placeholder="审核意见" v-if="applyInfo.nameReview.materialReview == 0"
					v-model="applyInfo.nameReview.auditOpinion" :disable-default-padding="true"></textarea>
			</block>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">店铺位置（必填）</view>
				<view v-if="addressMaterialReview == 1" class="agree-state">审核通过</view>
			</view>
			<view class="address-apply-tip">位置有误会影响顾客到店，请仔细确认</view>
			<view class="select-address">
				<view>
					{{applyInfo.addressReview.state}}{{applyInfo.addressReview.city}}{{applyInfo.addressReview.district}}
				</view>
				<u-icon name="map-fill" color="#333" size="20"></u-icon>
			</view>
			<view class="select-address">{{applyInfo.addressReview.address}}</view>
			<block v-if="addressMaterialReview != 1">
				<view class="select-apply">
					<view>审核结果</view>
					<view class="select-apply-result">
						<block v-for="(item, index) in applyResult" :key="index">
							<view class="select-apply-box" @click="changeApplyResult('addressReview', item)">
								<view class="select-goods"
									:class="applyInfo.addressReview.materialReview == item.value ? 'isSelect-goods' : ''">
									<block v-if="applyInfo.addressReview.materialReview == item.value">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<textarea placeholder="审核意见" v-if="applyInfo.addressReview.materialReview == 0"
					v-model="applyInfo.addressReview.auditOpinion" :disable-default-padding="true"></textarea>
			</block>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">门脸照片（必填）</view>
				<view v-if="doorFaceMaterialReview == 1" class="agree-state">审核通过</view>
			</view>
			<view class="other-info-tip">建议现场拍照上传清晰的门脸照片，更易审核通过</view>
			<view class="apply-img" @click="previewApplyImg(applyInfo.doorFaceReview.doorFace)">
				<image :src="applyInfo.doorFaceReview.doorFace" mode="widthFix"></image>
			</view>
			<block v-if="doorFaceMaterialReview != 1">
				<view class="select-apply">
					<view>审核结果</view>
					<view class="select-apply-result">
						<block v-for="(item, index) in applyResult" :key="index">
							<view class="select-apply-box" @click="changeApplyResult('doorFaceReview', item)">
								<view class="select-goods"
									:class="applyInfo.doorFaceReview.materialReview == item.value ? 'isSelect-goods' : ''">
									<block v-if="applyInfo.doorFaceReview.materialReview == item.value">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<textarea placeholder="审核意见" v-if="applyInfo.doorFaceReview.materialReview == 0"
					v-model="applyInfo.doorFaceReview.auditOpinion" :disable-default-padding="true"></textarea>
			</block>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">手机号认证（必填）</view>
				<view class="agree-state">审核通过</view>
			</view>
			<view class="other-info-tip">请填写经营者微信手机号并认证</view>
			<view class="apply-phone">{{applyInfo.phoneReview.phone}}</view>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">上传身份证</view>
				<view v-if="identityMaterialReview == 1" class="agree-state">审核通过</view>
			</view>
			<view class="other-info-tip">请上传经营者身份证</view>
			<view class="apply-img">
				<image :src="applyInfo.identityCardReview.identityCardFront" mode="widthFix"
					@click="previewApplyImg(applyInfo.identityCardReview.identityCardFront)"
					class="identity-card-front"></image>
				<image :src="applyInfo.identityCardReview.identityCardBack" mode="widthFix"
					@click="previewApplyImg(applyInfo.identityCardReview.identityCardBack)"></image>
			</view>
			<view>
				<view class="input-box">
					<view>姓名</view>
					<view>{{applyInfo.identityCardReview.idName}}</view>
				</view>
				<view class="input-box">
					<view>身份证件号码</view>
					<view>{{applyInfo.identityCardReview.idNumber}}</view>
				</view>
				<view class="input-box">
					<view>证件生效期</view>
					<view>{{applyInfo.identityCardReview.idPeriod}}</view>
				</view>
				<view class="input-box">
					<view>证件失效期</view>
					<view>{{applyInfo.identityCardReview.idExpiryDate}}</view>
				</view>
			</view>
			<block v-if="identityMaterialReview != 1">
				<view class="select-apply">
					<view>审核结果</view>
					<view class="select-apply-result">
						<block v-for="(item, index) in applyResult" :key="index">
							<view class="select-apply-box" @click="changeApplyResult('identityCardReview', item)">
								<view class="select-goods"
									:class="applyInfo.identityCardReview.materialReview == item.value ? 'isSelect-goods' : ''">
									<block v-if="applyInfo.identityCardReview.materialReview == item.value">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<textarea placeholder="审核意见" v-if="applyInfo.identityCardReview.materialReview == 0"
					v-model="applyInfo.identityCardReview.auditOpinion" :disable-default-padding="true"></textarea>
			</block>
		</view>
		<view class="apply-box">
			<view class="apply-result">
				<view class="apply-info-tip">上传营业执照</view>
				<view v-if="businessMaterialReview == 1" class="agree-state">审核通过</view>
			</view>
			<view class="other-info-tip">请上传营业执照正面照</view>
			<view class="apply-img" @click="previewApplyImg(applyInfo.businessLicenseReview.businessLicense)">
				<image :src="applyInfo.businessLicenseReview.businessLicense" mode="widthFix"></image>
			</view>
			<view>
				<view class="input-box">
					<view>经营者姓名</view>
					<view>{{applyInfo.businessLicenseReview.operatorName}}</view>
				</view>
				<view class="input-box">
					<view>类型</view>
					<view>{{applyInfo.businessLicenseReview.licenseType}}</view>
				</view>
				<view class="input-box">
					<view>商户名称</view>
					<view>{{applyInfo.businessLicenseReview.storeName }}</view>
				</view>
				<view class="input-box">
					<view>注册号</view>
					<view>{{applyInfo.businessLicenseReview.registrationNumber}}</view>
				</view>
				<view class="input-box">
					<view>注册地址</view>
					<view>{{applyInfo.businessLicenseReview.registeredAddress}}</view>
				</view>
				<view class="input-box">
					<view>执照生效期</view>
					<view>{{applyInfo.businessLicenseReview.licencePeriod}}</view>
				</view>
			</view>
			<block v-if="businessMaterialReview != 1">
				<view class="select-apply">
					<view>审核结果</view>
					<view class="select-apply-result">
						<block v-for="(item, index) in applyResult" :key="index">
							<view class="select-apply-box" @click="changeApplyResult('businessLicenseReview', item)">
								<view class="select-goods"
									:class="applyInfo.businessLicenseReview.materialReview == item.value ? 'isSelect-goods' : ''">
									<block v-if="applyInfo.businessLicenseReview.materialReview == item.value">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<textarea placeholder="审核意见" v-if="applyInfo.businessLicenseReview.materialReview == 0"
					v-model="applyInfo.businessLicenseReview.auditOpinion" :disable-default-padding="true"></textarea>
			</block>
		</view>
		<view class="apply-box" v-if="applyInfo.otherMaterialReview != undefined">
			<view class="apply-result">
				<view class="apply-info-tip">其他行政材料（可选）</view>
				<view v-if="otherMaterialReview == 1" class="agree-state">审核通过</view>
			</view>
			<view class="other-info-tip">建议上传商品经营许可证等其他材料</view>
			<view class="apply-img" @click="previewApplyImg(applyInfo.otherMaterialReview.otherData)">
				<image :src="applyInfo.otherMaterialReview.otherData" mode="widthFix"></image>
			</view>
			<block v-if="otherMaterialReview != 1">
				<view class="select-apply">
					<view>审核结果</view>
					<view class="select-apply-result">
						<block v-for="(item, index) in applyResult" :key="index">
							<view class="select-apply-box" @click="changeApplyResult('otherMaterialReview', item)">
								<view class="select-goods"
									:class="applyInfo.otherMaterialReview.materialReview == item.value ? 'isSelect-goods' : ''">
									<block v-if="applyInfo.otherMaterialReview.materialReview == item.value">
										<image src="../../static/store/check.png" mode=""></image>
									</block>
								</view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<textarea placeholder="审核意见" v-if="applyInfo.otherMaterialReview.materialReview == 0"
					v-model="applyInfo.otherMaterialReview.auditOpinion" :disable-default-padding="true"></textarea>
			</block>
		</view>
		<view class="save-btn disagree-btn" v-if="auditResult == 1 || auditResult == 5 || auditResult == 3"
			@click="goBack">返回</view>
		<block v-else>
			<view class="save-btn" v-if="agreeState" @click="disagreeApply">审核通过，创建店铺</view>
			<view class="save-btn disagree-btn" v-else @click="saveDisagreeApply">打回</view>
		</block>
		<view style="height: 1rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				applyId: '',
				applyResult: [{
					name: '通过',
					value: 1
				}, {
					name: '不通过',
					value: 0
				}],
				applyInfo: {},
				agreeState: false,
				nameMaterialReview: 0,
				addressMaterialReview: 1,
				doorFaceMaterialReview: 0,
				phoneMaterialReview: 0,
				identityMaterialReview: 1,
				businessMaterialReview: 0,
				otherMaterialReview: 0,
				auditResult: '',
				storeId: '',
				storeType: ''
			}
		},
		onLoad(options) {
			this.applyId = options.applyId == undefined ? '' : options.applyId
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getApplyDetail()
		},
		methods: {
			/* 获取审核详情 */
			getApplyDetail() {
				let that = this
				that.request({
					url: `${that.config.storeMaterials}/${that.applyId}`
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.auditResult = data.auditResult
						that.storeType = data.storeType
						data.nameReview.materialReview = data.nameReview.materialReview == null ? 0 : data
							.nameReview.materialReview ? 1 : 0
						data.addressReview.materialReview = data.addressReview.materialReview == null ? 0 : data
							.addressReview.materialReview ? 1 : 0
						data.doorFaceReview.materialReview = data.doorFaceReview.materialReview == null ? 0 : data
							.doorFaceReview.materialReview ? 1 : 0
						data.identityCardReview.materialReview = data.identityCardReview.materialReview == null ?
							0 : data.identityCardReview.materialReview ? 1 : 0
						data.businessLicenseReview.materialReview = data.businessLicenseReview.materialReview ==
							null ? 0 : data.businessLicenseReview.materialReview ? 1 : 0

						if (data.otherMaterialReview == null) {
							// 未上传其他材料，默认通过
							// data.otherMaterialReview.materialReview = 1
							that.otherMaterialReview = 1
						} else {
							data.otherMaterialReview.materialReview = data.otherMaterialReview.materialReview ==
								null ?
								0 : data.otherMaterialReview.materialReview ? 1 : 0
							that.otherMaterialReview = data.otherMaterialReview.materialReview
						}
						that.nameMaterialReview = data.nameReview.materialReview
						that.addressMaterialReview = data.addressReview.materialReview
						that.doorFaceMaterialReview = data.doorFaceReview.materialReview
						that.identityMaterialReview = data.identityCardReview.materialReview
						that.businessMaterialReview = data.businessLicenseReview.materialReview
						that.applyInfo = data
						that.computedAgreeState()
					}
				})
			},
			computedAgreeState() {
				let otherMaterialReview
				this.agreeState = true
				if (this.applyInfo.otherMaterialReview == null) {
					otherMaterialReview = 1
				} else {
					otherMaterialReview = this.applyInfo.otherMaterialReview.materialReview
				}
				if (this.applyInfo.nameReview.materialReview == 0 || this.applyInfo.addressReview.materialReview == 0 ||
					this.applyInfo.doorFaceReview.materialReview == 0 ||
					this.applyInfo.identityCardReview.materialReview == 0 || this.applyInfo.businessLicenseReview
					.materialReview ==
					0 || otherMaterialReview == 0) {
					// 不通过
					this.agreeState = false
				}
			},
			changeApplyResult(type, item) {
				if (this.auditResult == 2 || this.auditResult == 4) {
					this.agreeState = true
					if (type == 'materialReview') {
						// 店铺名称
						this.applyInfo.nameReview.materialReview = item.value
					} else if (type == 'addressReview') {
						// 店铺位置
						this.applyInfo.addressReview.materialReview = item.value
					} else if (type == 'doorFaceReview') {
						// 门脸照片
						this.applyInfo.doorFaceReview.materialReview = item.value
					} else if (type == 'identityCardReview') {
						// 身份证
						this.applyInfo.identityCardReview.materialReview = item.value
					} else if (type == 'businessLicenseReview') {
						// 营业执照
						this.applyInfo.businessLicenseReview.materialReview = item.value
					} else if (type == 'otherMaterialReview') {
						// 其他材料
						this.applyInfo.otherMaterialReview.materialReview = item.value
					}
					this.computedAgreeState()
				}
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
			/* 打回申请 */
			saveDisagreeApply() {
				let that = this
				let phoneReview = {
					materialReview: 1
				}
				let nameReview = {
					materialReview: that.applyInfo.nameReview.materialReview,
					auditOpinion: that.applyInfo.nameReview.auditOpinion == null ? '' : that.applyInfo.nameReview
						.auditOpinion
				}
				let addressReview = {
					materialReview: that.applyInfo.addressReview.materialReview,
					auditOpinion: that.applyInfo.addressReview.auditOpinion == null ? '' : that.applyInfo.addressReview
						.auditOpinion
				}
				let doorFaceReview = {
					materialReview: that.applyInfo.doorFaceReview.materialReview,
					auditOpinion: that.applyInfo.doorFaceReview.auditOpinion == null ? '' : that.applyInfo
						.doorFaceReview.auditOpinion
				}
				let identityCardReview = {
					materialReview: that.applyInfo.identityCardReview.materialReview,
					auditOpinion: that.applyInfo.identityCardReview.auditOpinion == null ? '' : that.applyInfo
						.identityCardReview.auditOpinion
				}
				let businessLicenseReview = {
					materialReview: that.applyInfo.businessLicenseReview.materialReview,
					auditOpinion: that.applyInfo.businessLicenseReview.auditOpinion == null ? '' : that.applyInfo
						.businessLicenseReview.auditOpinion
				}
				let otherMaterialReview
				if (that.applyInfo.otherMaterialReview == null) {
					// 其他材料审核为空
					otherMaterialReview = {}
				} else {
					otherMaterialReview = {
						materialReview: that.applyInfo.otherMaterialReview.materialReview,
						auditOpinion: that.applyInfo.otherMaterialReview.auditOpinion == null ? '' : that.applyInfo
							.otherMaterialReview.auditOpinion
					}
				}
				if ((nameReview.materialReview == 0 && nameReview.auditOpinion === '') || (addressReview.materialReview ==
						0 && addressReview.auditOpinion === '') || (doorFaceReview.materialReview == 0 && doorFaceReview
						.auditOpinion ===
						'') || (identityCardReview.materialReview ==
						0 && identityCardReview.auditOpinion === '') || (businessLicenseReview.materialReview == 0 &&
						businessLicenseReview
						.auditOpinion === '') || (otherMaterialReview.materialReview == 0 && otherMaterialReview
						.auditOpinion === '')) {
					uni.showToast({
						title: '请输入审核意见',
						icon: 'none'
					})
				} else {
					that.request({
						url: `${that.config.storeMaterials}/${that.applyId}:review`,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json',
							'Transaction-No': new Date().getTime()
						},
						data: {
							nameReview: nameReview,
							addressReview: addressReview,
							doorFaceReview: doorFaceReview,
							phoneReview: phoneReview,
							identityCardReview: identityCardReview,
							businessLicenseReview: businessLicenseReview,
							otherMaterialReview: otherMaterialReview
						}
					}).then(res => {
						console.log(res)
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
			},
			/* 通过申请 */
			disagreeApply() {
				uni.navigateTo({
					url: './addStore?applyInfo=' + JSON.stringify(this.applyInfo) + '&applyId=' +
						this.applyId
				})
			},
			/* 返回 */
			goBack() {
				uni.navigateBack()
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

	.apply-img image {
		width: 100%;
		height: auto;
		display: block;
	}

	.apply-img image.identity-card-front {
		margin-bottom: 14rpx;
	}

	.save-btn {
		margin: 40rpx 24rpx;
		border: 2rpx solid #F2AB99;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.disagree-btn {
		border: 2rpx solid #F2AB99;
		background-color: transparent;
		color: #F2AB99;
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
</style>
