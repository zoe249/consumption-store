<template>
	<view>
		<view class="agreement-desc" v-html="agreement"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreement: '',
				type: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.type = options.type
			let title
			if (this.type == 'userAgreement') {
				// 用户协议
				title = '用户协议'
			} else if (this.type == 'privacyPolicy') {
				// 隐私政策
				title = '隐私政策'
			} else if (this.type == 'operationSpec') {
				// 平台运营规范
				title = '平台运营规范'
			} else if (this.type == 'managementSpec') {
				// 商户管理规范
				title = '商户管理规范'
			}
			uni.setNavigationBarTitle({
				title: title
			})
			this.getAgreement()
		},
		methods: {
			getAgreement() {
				let that = this
				that.request({
					url: that.config.platformContexts
				}).then(res => {
					console.log('规范', res)
					const data = res.data.data
					if (that.type == 'userAgreement') {
						// 用户协议
						that.agreement = data.userAgreement
					} else if (that.type == 'privacyPolicy') {
						// 隐私政策
						that.agreement = data.privacyPolicy
					} else if (that.type == 'operationSpec') {
						// 平台运营规范
						that.agreement = data.operationSpecification
					} else if (that.type == 'managementSpec') {
						// 商户管理规范
						that.agreement = data.managementSpecification
					}
					that.agreement = that.agreement.replace(/(\r\n|\n|\r)/gm, ' < br /> ')
				})
			}
		}
	}
</script>

<style scoped>
	.agreement-desc {
		padding: 14rpx 24rpx;
	}
</style>
