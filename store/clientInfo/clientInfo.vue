<template>
	<view>
		<view class="client-info-box">
			<view class="client-info">
				<view class="info-left">手机</view>
				<view>{{client.phone}}</view>
			</view>
			<view class="client-info">
				<view class="info-left">性别</view>
				<view class="info-right">
					<view>
						<block v-if="client.gender === ''">请选择性别</block>
						<block v-else>{{client.gender}}</block>
					</view>
					<u-icon name="arrow-right" color="#999" size="12"></u-icon>
				</view>
			</view>
			<view class="client-info">
				<view class="info-left">生日</view>
				<view class="info-right">
					<view>
						<block v-if="client.birthday == null">请选择生日</block>
						<block v-else>{{client.birthday}}</block>
					</view>
					<u-icon name="arrow-right" color="#999" size="12"></u-icon>
				</view>
			</view>
			<view class="client-remark">
				<view class="info-left">备注</view>
				<u--textarea v-model="client.remarks" placeholder="请输入备注内容" autoHeight></u--textarea>
			</view>
		</view>
		<view class="save-btn" @click="saveClientInfo">保存</view>

		<!-- <u-action-sheet :show="showSex" :actions="actions" title="请选择性别" @close="showSex = false"
			:closeOnClickOverlay="true" @select="sexSelect">
		</u-action-sheet>
		
		<u-datetime-picker :show="showDate" @confirm='confirmDate' @cancel="cancelDate" v-model="dateValue" mode="date">
		</u-datetime-picker> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				client: {}, // 客户信息
				showSex: false, // 显示性别选项
				showDate: false, // 显示日期选项
				actions: [{
						name: '男',
						value: '1'
					},
					{
						name: '女',
						value: '2'
					},

				],
				dateValue: Number(new Date()), // 日期
				storeId: '',
				clientId: ''
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.clientId = options.id == undefined ? '' : options.id
			this.getClientDetail()
		},
		methods: {
			/* 获取客户信息 */
			getClientDetail() {
				let that = this
				that.request({
					url: `${that.config.storecustomers}/${that.clientId}`,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					const data = res.data.data
					if (!data.remarks)
						data.remarks = ''
					if (data.gender == 0) {
						data.gender = ''
					} else if (data.gender == 1) {
						data.gender = '先生'
					} else if (data.gender == 2) {
						data.gender = '女士'
					}
					that.client = data
				})
			},
			// sexSelect(e) {
			// 	this.client.gender = e.name
			// },
			// 确定日期
			// confirmDate(e) {
			// 	// 转换日期格式
			// 	this.client.birthday = this.formatDate(e.value)
			// 	this.showDate = false
			// },
			// 日期选择取消
			// cancelDate() {
			// 	this.showDate = false
			// },
			//时间戳转换方法    date:时间戳数字
			// formatDate(date) {
			// 	var date = new Date(date);
			// 	var YY = date.getFullYear() + '-';
			// 	var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			// 	var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());

			// 	return YY + MM + DD;
			// },
			/* 保存客户信息 */
			saveClientInfo() {
				let that = this
				that.request({
					url: `${that.config.storecustomers}/${that.client.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						gender: that.client.gender,
						birthday: that.client.birthday,
						remarks: that.client.remarks
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
			}
		}
	}
</script>

<style scoped>
	.client-info-box {
		margin: 20rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 24rpx;
	}

	.client-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		font-size: 28rpx;
		color: #999;
		border-bottom: 2rpx solid #F4F4F4;
	}

	.info-left {
		margin-right: 22rpx;
	}

	.info-right {
		display: flex;
		align-items: center;
	}

	.client-remark {
		display: flex;
		font-size: 28rpx;
		color: #999;
		padding: 26rpx 0;
	}

	.client-remark>>>.u-textarea {
		padding: 0 !important;
	}

	.save-btn {
		text-align: center;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #FFFFFF;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>