<template>
	<view>
		<view>商家营业执照</view>
		<view @click="previewBusinessLicense" class="license-img">
			<image :src="businessLicense" mode="widthFix"></image>
			<image :src="otherMaterialReview" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: '',
				businessLicense: '',
				otherMaterialReview: ''
			}
		},
		onLoad() {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getStoreLicenseImg()
			this.getStoreOtherImg()
		},
		methods: {
			/* 预览图片 */
			previewBusinessLicense() {
				let arr = []
				arr.push(this.businessLicense)
				arr.push(this.otherMaterialReview)
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
				});
			},
			/* 获取营业执照 */
			getStoreLicenseImg() {
				let that = this
				uni.request({
					url: `${that.config.protocol}${that.config.host}store-service/api/v1.0/stores/${that.storeId}/material/businessLicenseReview`,
					responseType: 'arraybuffer',
					header: {
						Authorization: `Bearer ${uni.getStorageSync('token')}`
					},
					success(res) {
						console.log(res)
						if (res.statusCode == '200') {
							const data = res.data
							let url = 'data:image/png;base64,' + uni.arrayBufferToBase64(data)
							that.businessLicense = url
							console.log('businessLicense', url)
						} else {
							uni.showToast({
								title: '店铺未上传营业执照',
								icon: 'none'
							})
						}
					}
				})
			},
			/* 获取其他审核材料 */
			getStoreOtherImg() {
				let that = this
				uni.request({
					url: `${that.config.protocol}${that.config.host}store-service/api/v1.0/stores/${that.storeId}/material/otherMaterialReview`,
					responseType: 'arraybuffer',
					header: {
						Authorization: `Bearer ${uni.getStorageSync('token')}`
					},
					success(res) {
						if (res.statusCode == '200') {
							const data = res.data
							let url = 'data:image/png;base64,' + uni.arrayBufferToBase64(data)
							that.otherMaterialReview = url
							console.log('otherMaterialReview', url)
						} else {
							uni.showToast({
								title: '店铺未上传其他材料',
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.license-img image {
		width: 100%;
		height: auto;
	}
</style>
