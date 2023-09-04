<template>
	<view>
		<view>
			<view class="personal-input">
				<view>头像</view>
				<button open-type="chooseAvatar" class="personal-avatar" @chooseavatar="onChooseAvatar">
					<image :src="avatarUploadUrl === '' ? defaultHead : avatarUploadUrl"></image>
					<u-icon name="arrow-right" size="10"></u-icon>
				</button>
			</view>
			<view class="personal-input">
				<view>昵称</view>
				<input type="nickname" placeholder="请输入昵称" v-model="nickname" @blur="changeNickname">
			</view>
			<view class="personal-input">
				<view>手机号</view>
				<view>{{phone}}</view>
			</view>
			<view class="personal-input">
				<view>生日</view>
				<view @click="calenderShow = true" class="gender-box">
					<view>{{birthday == '' ? '' : birthday}}</view>
					<u-icon name="arrow-right" color="#999" size="10"></u-icon>
				</view>
			</view>
			<view class="personal-input">
				<view>性别</view>
				<view @click="openSelectGender" class="gender-box">
					<view>{{genderName == '' ? '' : genderName}}</view>
					<u-icon name="arrow-right" color="#999" size="10"></u-icon>
				</view>
			</view>
			<view class="add-btn" @click="uploadFilePromise">保存设置</view>
		</view>

		<u-datetime-picker :show="calenderShow" v-model="birthdayValue" mode="date" :minDate="0" :maxDate="maxDate"
			:closeOnClickOverlay="true" @confirm="confirmBirthday" @close="closeCalender" @cancel="closeCalender">
		</u-datetime-picker>

		<u-action-sheet :actions="genderList" :show="genderShow" :closeOnClickOverlay="true" :closeOnClickAction="true"
			:safeAreaInsetBottom="true" @select="selectGender" @close="closeSelectGender"></u-action-sheet>
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				defaultHead: this.config.imgUrl + 'defaultHead.png',
				qiniuToken: '',
				storeId: '',
				phone: '',
				avatarUploadUrl: '',
				avatarUrl: '',
				nickname: '',
				birthday: '',
				birthdayValue: '',
				genderList: [{
					name: '男',
					value: 1
				}, {
					name: '女',
					value: 2
				}],
				genderShow: false,
				gender: 0,
				genderName: '',
				maxDate: 0,
				personalShow: true,
				calenderShow: false,
				userInfo: {}
			}
		},
		onLoad() {
			var dateTime = new Date()
			this.maxDate = Date.parse(dateTime)
			this.storeId = uni.getStorageSync('storeInfo').id
			this.userInfo = uni.getStorageSync('userInfo')
			this.getQiniuToken()
			this.getPersonalInfo()
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
			onChooseAvatar(e) {
				console.log('选择微信头像', e)
				this.avatarUploadUrl = e.detail.avatarUrl
			},
			closeCalender() {
				this.calenderShow = false
			},
			/* 选择生日 */
			confirmBirthday(e) {
				console.log('选择生日', e)
				this.birthdayValue = e.value
				this.birthday = date.parseTime(e.value, "{y}-{m}-{d}")
				this.calenderShow = false
			},
			openSelectGender() {
				this.genderShow = true
			},
			closeSelectGender() {
				this.genderShow = false
			},
			selectGender(e) {
				console.log('选择性别', e)
				this.gender = e.value
				this.genderName = e.name
				this.genderShow = false
			},
			/* 上传图片 */
			uploadFilePromise() {
				let that = this
				uni.showToast({
					title: '保存中',
					icon: 'loading'
				})
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
						filePath: that.avatarUploadUrl,
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
							that.avatarUrl = 'https://qiaokun.yuepong.com/' + data.key
							that.savePersonalInfo()
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
				})
			},
			/* 保存个人资料 */
			savePersonalInfo() {
				let that = this
				that.request({
					url: `${that.config.customers}/${that.userInfo.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						gender: that.gender,
						birthday: that.birthday,
						avatar: that.avatarUrl,
						nickname: that.nickname
					}
				}).then(res => {
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
			/* 获取个人资料 */
			getPersonalInfo() {
				let that = this
				that.request({
					url: `${that.config.customers}/${that.userInfo.openId}`
				}).then(res => {
					if (res.data.code == 200000) {
						const data = res.data.data
						uni.getImageInfo({
							src: data.avatar,
							success: (image) => {
								console.log(image)
								that.avatarUploadUrl = image.path
							},
							fail: (err) => {
								uni.hideLoading()
							}
						});
						that.nickname = data.nickname
						that.phone = data.phone
						that.birthday = (data.birthday).slice(0, 10)
						if (data.gender == '1') {
							that.genderName = '男'
						} else if (data.gender == '2') {
							that.genderName = '女'
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			changeNickname(e) {
				setTimeout(() =>{
					this.nickname = e.detail.value
					console.log('选择昵称', e)
				}, 10)
			}
		}
	}
</script>

<style scoped>
	.personal-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 20rpx;
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #000;
	}

	.personal-input input {
		text-align: right;
	}
	
	.gender-box{
		display: flex;
		align-items: center;
		color: #999;
	}

	.personal-avatar {
		background-color: transparent;
		display: flex;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.personal-avatar::after {
		border: unset;
	}

	.personal-avatar image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
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
</style>
