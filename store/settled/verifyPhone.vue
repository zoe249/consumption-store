<template>
	<view>
		<view class="verify-box">
			<view class="base-info">请填写经营者微信手机号并认证</view>
			<view class="verification-code-box">
				<input type="number" placeholder="请输入微信绑定手机号" v-model="phone" :placeholder-style="style">
				<view>
					<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange">
					</u-code>
					<view @tap="getVerifyCode">{{tips}}</view>
				</view>
			</view>
			<view class="base-info">
				<input type="number" placeholder="请输入验证码" v-model="phoneCode">
			</view>
		</view>
		<view class="save-btn" :class="verifyState ? '' : 'disabled'" @click="verifyPhone">下一步</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tips: '',
				seconds: 60,
				phone: '',
				phoneCode: '',
				storeType: '',
				verifyState: false
			}
		},
		onLoad(options) {
			this.storeType = options.storeType == undefined ? '' : options.storeType
		},
		watch: {
			phone() {
				if (this.phone !== '' && this.phoneCode !== '') {
					this.verifyState = true
				} else {
					this.verifyState = false
				}
			},
			phoneCode() {
				if (this.phone !== '' && this.phoneCode !== '') {
					this.verifyState = true
				} else {
					this.verifyState = false
				}
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			/* 获取验证码 */
			getVerifyCode() {
				let that = this
				if (this.phone === '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
				} else if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					})
				} else {
					uni.showLoading({
						title: '正在获取验证码'
					})
					that.request({
						url: `${that.config.phoneCode}/${that.phone}:send`,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Transaction-No': new Date().getTime()
						}
					}).then(res => {
						console.log(res)
						uni.hideLoading()
						if (res.data.code == '200000') {
							uni.showToast({
								title: '验证码已发送',
								icon: 'none'
							})
							that.$refs.uCode.start()
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			end() {
				// uni.$u.toast('倒计时结束');
			},
			start() {
				// uni.$u.toast('倒计时开始');
			},
			/* 手机号验证 */
			verifyPhone() {
				let that = this
				that.request({
					url: `${that.config.phoneCode}/${that.phone}/${that.phoneCode}:verify`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.redirectTo({
							url: './add?storeType=' + that.storeType + '&phoneState=true&phone=' + this
								.phone
						})
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
	.verify-box {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.base-info {
		padding: 20rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.base-info:last-child {
		border-bottom: 0;
	}

	.verification-code-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.save-btn {
		background-color: #F2AB99;
		color: #fff;
		border-radius: 50rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx 24rpx;
		font-size: 28rpx;
	}

	.disabled {
		pointer-events: none;
		background-color: #ccc;
	}
</style>
