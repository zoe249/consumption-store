<template>
	<view class="cont">
		<view class="bake-tip">面团准备</view>
		<view class="bake-box">
			<view class="input-cont">
				<view>重量</view>
				<view class="input-box">
					<input type="digit" placeholder="面团重量" :placeholderStyle="style">
					<view>g</view>
				</view>
			</view>
			<view class="input-cont no-border">
				<view>状态</view>
				<view>
					<input type="digit" placeholder="面团状态" :placeholderStyle="style">
				</view>
			</view>
		</view>
		<view class="bake-tip">面团醒发</view>
		<view class="bake-box">
			<view class="input-cont" @click="openWakeShow('wakeTime')">
				<view>时间</view>
				<view>{{wakeTimeValue}}</view>
			</view>
			<view class="input-cont" @click="openWakeShow('wakeTemp')">
				<view>温度</view>
				<view>{{wakeTempValue}}</view>
			</view>
			<view class="input-cont no-border" @click="openWakeShow('wakeHumidity')">
				<view>湿度</view>
				<view>{{wakeHumidityValue}}</view>
			</view>
			<block v-if="secAwakenState">
				<view class="input-cont">
					<view>二次醒发时间</view>
					<view>醒发时间</view>
				</view>
				<view class="input-cont">
					<view>温度</view>
					<view>面团温度</view>
				</view>
				<view class="input-cont">
					<view>湿度</view>
					<view>面团湿度</view>
				</view>
			</block>
		</view>
		<view class="sec-awaken" @click="changeSecAwakenState">
			<image :src="imgUrl + 'addAvatar.png'" mode=""></image>
			<view>二次醒发</view>
		</view>
		<view class="bake-tip">准备步骤</view>
		<view class="bake-box">
			<block v-for="(item, index) in stepList" :key="index">
				<view class="input-cont">
					<view>步骤{{index + 1}}</view>
					<view class="input-box" @click="openWakeShow('stepTime')">
						<view>用时{{stepTimeValue}}</view>
						<view class="delete-img" @click="deleteBakeStep(index)">
							<u-icon name="trash" color="#F2AB99" size="20"></u-icon>
						</view>
					</view>
				</view>
				<view class="step-input">
					<u--textarea v-model="item.stepCont" placeholder="请输入内容"></u--textarea>
					<block v-if="item.stepImg.length != 0">
						<block v-if="sonRefresh">
							<view class="upload-sign" v-for="(img, idx) in item.stepImg" :key="idx" @click="chooseImg(index, idx)">
								<block v-if="img === ''">
									<image :src="imgUrl + 'addAvatar.png'" class="upload-img"></image>
								</block>
								<block v-else>
									<view class="delete-step-img" @click.stop="selectImg(index, idx)">
										<image :src="imgUrl + 'delete.png'" mode=""></image>
									</view>
									<image :src="img" class="active-img"></image>
								</block>
							</view>
						</block>
					</block>
				</view>
			</block>
		</view>
		<view class="add-step">
			<view class="add-step-box" @click="addStep">
				<image :src="imgUrl + 'addAvatar.png'" mode=""></image>
				<view>添加步骤</view>
			</view>
			<view class="add-step-box add-step-img" @click="addStepImg">
				<image :src="imgUrl + 'addAvatar.png'" mode=""></image>
				<view>添加图片</view>
			</view>
		</view>
		<view class="save-btn" @click="saveStep">保存</view>

		<u-popup :show="wakeTimeShow" @close="closeWakeTimeShow" :closeable="true" round="10rpx">
			<view class="add-title">
				<block v-if="type == 'wakeTime'">醒发时间</block>
				<block v-else-if="type == 'wakeTemp'">醒发温度</block>
				<block v-else-if="type == 'wakeHumidity'">醒发湿度</block>
				<block v-else-if="type == 'stepTime'">步骤用时</block>
			</view>
			<view>
				<picker-view indicator-style="height: 70rpx;" :value="wakeTimeValue" @change="changeBakeTime"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in list" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('1')">自定义</view>
				<view @click="confirmBakeTimeValue">确定</view>
			</view>
		</u-popup>

		<!-- 自定义输入框 -->
		<u-popup :show="definitionShow" @close="closeDefinitionShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<input type="number" v-model="definitionValue" placeholder="请输入自定义"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="closeDefinitionShow">取消</view>
					<view class="confirm-btn" @click="confirmDefinition">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				style: 'text-align: right; color: #ccc;',
				secAwakenState: false,
				stepList: [{
					stepCont: '',
					stepImg: []
				}],
				wakeTimeShow: false,
				definitionShow: false,
				list: [],
				// 醒发时间
				wakeTimeList: ['30分钟', '40分钟', '50分钟', '1小时', '1.5小时', '2小时'],
				wakeTimeValue: '醒发时间',
				wakeTimeIdx: 0,
				// 醒发温度
				wakeTempList: ['10°C', '20°C', '30°C', '40°C', '50°C', '60°C'],
				wakeTempValue: '面团温度',
				wakeTempIdx: 0,
				// 醒发湿度
				wakeHumidityList: ['50%RH', '60%RH', '70%RH', '80%RH', '90%RH'],
				wakeHumidityValue: '醒发湿度',
				wakeHumidityIdx: 0,
				// 步骤用时
				stepTimeList: ['10分钟', '20分钟', '30分钟', '40分钟', '50分钟', '1小时'],
				stepTimeValue: '步骤用时',
				stepTimeIdx: 0,
				type: '',
				sonRefresh: false
			}
		},
		methods: {
			changeSecAwakenState() {
				this.secAwakenState = !this.secAwakenState
			},
			addStep() {
				this.stepList.push({
					stepCont: '',
					stepImg: []
				})
			},
			addStepImg() {
				let index = this.stepList.length - 1
				this.stepList[index].stepImg.push('')
				console.log('stepList', this.stepList)
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
			},
			openWakeShow(type) {
				this.type = type
				if (type == 'wakeTime') {
					// 醒发时间
					this.list = this.wakeTimeList
				} else if (type == 'wakeTemp') {
					// 醒发温度
					this.list = this.wakeTempList
				} else if (type == 'wakeHumidity') {
					// 醒发湿度
					this.list = this.wakeHumidityList
				} else if (type == 'stepTime') {
					// 步骤用时
					this.list = this.stepTimeList
				}
				this.wakeTimeShow = true
			},
			closeWakeTimeShow() {
				this.wakeTimeShow = false
			},
			changeBakeTime(e) {
				console.log(e)
				if (this.type == 'wakeTime') {
					// 醒发时间
					this.wakeTimeIdx = e.detail.value[0]
				} else if (this.type == 'wakeTemp') {
					// 醒发温度
					this.wakeTempIdx = e.detail.value[0]
				} else if (this.type == 'wakeHumidity') {
					// 醒发湿度
					this.wakeHumidityIdx = e.detail.value[0]
				} else if (this.type == 'stepTime') {
					// 步骤用时
					this.stepTimeIdx = e.detail.value[0]
				}
			},
			confirmBakeTimeValue() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					if (this.type == 'wakeTime') {
						// 醒发时间
						this.wakeTimeValue = this.wakeTimeList[this.wakeTimeIdx]
					} else if (this.type == 'wakeTemp') {
						// 醒发温度
						this.wakeTempValue = this.wakeTempList[this.wakeTempIdx]
					} else if (this.type == 'wakeHumidity') {
						// 醒发湿度
						this.wakeHumidityValue = this.wakeHumidityList[this.wakeHumidityIdx]
					} else if (this.type == 'stepTime') {
						// 步骤用时
						this.stepTimeValue = this.stepTimeList[this.stepTimeIdx]
					}
					this.wakeTimeShow = false
				}, 1000)
			},
			openDefinitionShow() {
				this.wakeTimeShow = false
				this.definitionShow = true
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				if (this.type == 'wakeTime') {
					// 醒发时间
					this.wakeTimeValue = this.definitionValue
				} else if (this.type == 'wakeTemp') {
					// 醒发温度
					this.wakeTempValue = this.definitionValue
				} else if (this.type == 'wakeHumidity') {
					// 醒发湿度
					this.wakeHumidityValue = this.definitionValue
				} else if (this.type == 'stepTime') {
					// 步骤用时
					this.stepTimeValue = this.definitionValue
				}
				this.definitionShow = false
			},
			/* 删除步骤 */
			deleteBakeStep(index) {
				this.stepList.splice(index, 1)
			},
			saveStep() {
				var pages = getCurrentPages()
				var prevPage = pages[pages.length - 2]
				prevPage.$vm.stepState = true
				uni.navigateBack()
			},
			chooseImg(index, idx) {
				let that = this
				uni.chooseImage({
					count: 1,
					success: function(res) {
						that.stepList[index].stepImg[idx] = res.tempFilePaths[0]
						console.log(that.stepList)
						that.sonRefresh = false
						that.$nextTick(() => {
							that.sonRefresh = true
						})
					}
				})
			},
			selectImg(index, idx) {
				this.stepList[index].stepImg.splice(idx, 1)
			}
		}
	}
</script>

<style scoped>
	.cont {
		margin: 0 24rpx;
	}

	.bake-tip {
		color: #333;
		font-weight: 600;
		font-size: 28rpx;
		margin: 30rpx 0;
	}

	.bake-box {
		margin: 30rpx 0;
		font-size: 28rpx;
		color: #999;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.input-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		margin: 0 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.no-border {
		border-bottom: 0;
	}

	.input-box {
		display: flex;
		align-items: center;
	}

	.sec-awaken {
		display: flex;
		align-items: center;
		margin: 30rpx 20rpx;
		color: #F2AB99;
		font-size: 28rpx;
	}

	.sec-awaken image {
		width: 20rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}

	.delete-img {
		margin-left: 10rpx;
	}
	
	.step-input{
		padding-bottom: 20rpx;
	}

	.upload-sign {
		width: 660rpx;
		height: 270rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #eee;
		border-radius: 10rpx;
		margin: 14rpx 20rpx;
		position: relative;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}
	
	.delete-step-img {
		background-color: rgba(0, 0, 0, .5);
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
	}
	
	.delete-step-img image {
		width: 48rpx;
		height: 54rpx;
	}
	
	.active-img{
		width: 660rpx;
		height: 270rpx;
	}

	.add-step {
		display: flex;
		align-items: center;
		margin: 30rpx 0;
	}

	.add-step-box {
		display: flex;
		align-items: center;
		color: #F2AB99;
		font-size: 28rpx;
	}
	
	.add-step-box image {
		width: 20rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}

	.add-step-img {
		margin-left: 40rpx;
	}

	.save-btn {
		margin: 40rpx 24rpx;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		font-size: 28rpx;
	}

	.add-title {
		background-color: #F4F4F4;
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		overflow: hidden;
	}

	.picker-view {
		height: 300rpx;
	}

	.item {
		height: 70rpx;
		line-height: 70rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.select-btn-box {
		margin: 22rpx 24rpx;
	}

	.select-btn-box view {
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50rpx;
		font-size: 28rpx;
		margin-top: 26rpx;
	}

	.select-btn-box view.definition-btn {
		background-color: #fff;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	.cont>>>.u-popup__content__close--top-right {
		top: 24rpx;
		right: 24rpx;
	}

	.cont>>>.u-popup__content {
		overflow: hidden;
	}

	.definition-box {
		margin: 60rpx 24rpx;
	}

	.definition-input input {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.definition-btn-box {
		display: flex;
		align-items: center;
	}

	.definition-btn-box view {
		width: 172rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #F2AB99;
		font-size: 28rpx;
		border: 2rpx solid #F2AB99;
	}

	.definition-btn-box view.confirm-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
</style>
