<template>
	<view class="add-bake-box">
		<view class="make-name">
			<input type="text" placeholder="请输入食谱名称" v-model="name"
				placeholder-style="color: #333; line-height: 60rpx;">
		</view>
		<view class="make-time">
			<view>制作用时</view>
			<view class="computed-make-name">
				<block v-if="productionTime == 0">自动计算</block>
				<block v-else>{{productionTime}}分钟</block>
			</view>
		</view>
		<view class="bake-box">
			<view class="make-difficulty">
				<view>难度</view>
				<view class="difficulty-img">
					<view v-for="(img, index) in difficulty" :key="index">
						<image :src="imgUrl + 'difficulty.png'" @click="cancleDifficulty(index + 1)"></image>
					</view>
					<view v-for="(img, index) in (5 - difficulty)" :key="index">
						<image :src="imgUrl + 'undifficulty.png'" @click="chooseDifficulty(index + 1)"></image>
					</view>
				</view>
			</view>
			<view class="make-difficulty">
				<view>份量</view>
				<view class="unit-box">
					<input type="text" placeholder="份量" :placeholderStyle="style" v-model="part">
					<view>份</view>
				</view>
			</view>
			<view>
				<view class="make-difficulty">
					<view class="add-ingredient-tip">
						<view class="ingredient-tip">原料</view>
						<view>例：牛奶 10g</view>
					</view>
					<view @click="addIngredient" class="price">+添加原料</view>
				</view>
				<view class="setout-bake-completed">
					<view class="setout-bake" v-for="(item, index) in selectElementList" :key="index">
						<view>{{item.name}}</view>
						<view>{{item.elementQuantity}}{{item.elementUnit}}</view>
					</view>
				</view>
			</view>
			<u-sticky>
				<view class="bake-process">
					<view class="bake-operate-title">制作过程</view>
					<view class="bake-operate-box">
						<view v-for="(oitem, oidx) in operateList" :key="oidx" class="bake-operate"
							@click="addOperate(oitem)">{{oitem.name}}</view>
					</view>
				</view>
			</u-sticky>

			<block v-for="(bake, bidx) in bakeProcessInfo" :key="bidx">
				<!-- 添加标题 -->
				<view v-if="bake.title != undefined" class="cook-name-box">
					<view class="cook-name-input">
						<input type="text" placeholder="请输入标题名称" v-model="bake.title"
							placeholder-style="color: #ccc; line-height: 60rpx;">
					</view>
					<view class="delete-img" @click="deleteBakeStep(bidx)">
						<image :src="imgUrl + 'closeStep.png'" mode=""></image>
					</view>
				</view>

				<!-- 准备步骤 -->
				<view class="step-bake-box" v-if="bake.stepList != undefined">
					<view class="input-cont">
						<view>步骤{{bidx}}</view>
						<view class="step-time-input" @click="openWakeShow('stepTime', bidx)">
							<view>用时
								<text class="step-time">
									<block v-if="bake.stepList.stepTime === ''">步骤用时</block>
									<block v-else>{{bake.stepList.stepTime}}</block>
								</text>
								分钟
							</view>
							<view class="delete-img" @click.stop="deleteBakeStep(bidx)">
								<image :src="imgUrl + 'closeStep.png'" mode=""></image>
							</view>
						</view>
					</view>
					<view class="step-input">
						<u--textarea v-model="bake.stepList.stepCont" placeholder="请输入内容"></u--textarea>
					</view>
				</view>

				<!-- 添加图片 -->
				<view v-if="bake.stepImg != undefined">
					<!-- <block v-if="item.stepImg.length != 0">
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
					</block> -->
					<view class="bake-dough">
						<view class="bake-tip">图片</view>
						<view class="delete-img" @click="deleteBakeStep(bidx)">
							<image :src="imgUrl + 'closeStep.png'" mode=""></image>
						</view>
					</view>
					<view class="upload-isImg" @click="chooseImg(bidx)" :class="bake.stepImg === '' ? 'upload-sign' : ''">
						<block v-if="bake.stepImg === ''">
							<image :src="imgUrl + 'supplierAdd.png'" class="upload-img"></image>
						</block>
						<block v-else>
							<view class="delete-step-img" @click.stop="deleteSelectImg(bidx)">
								<image :src="imgUrl + 'closeStep.png'" mode=""></image>
							</view>
							<image :src="bake.stepImg" class="active-img" mode="widthFix"></image>
						</block>
					</view>
				</view>

				<!-- 面团准备 -->
				<view v-if="bake.doughState != undefined">
					<view class="bake-dough">
						<view class="bake-tip">面团准备</view>
						<view class="delete-img" @click="deleteBakeStep(bidx)">
							<image :src="imgUrl + 'closeStep.png'" mode=""></image>
						</view>
					</view>
					<view class="bake-dough-box">
						<view class="input-cont">
							<view>重量</view>
							<view class="input-box">
								<input type="digit" placeholder="面团重量" :placeholderStyle="style"
									v-model="bake.doughState.weight">
								<view>g</view>
							</view>
						</view>
						<view class="input-cont no-border">
							<view>状态</view>
							<view class="input-box">
								<input type="text" placeholder="面团状态" :placeholderStyle="style"
									v-model="bake.doughState.state">
							</view>
						</view>
					</view>
				</view>

				<!-- 面团醒发 -->
				<view v-if="bake.doughWake != undefined">
					<view class="bake-dough">
						<view class="bake-tip">面团醒发</view>
						<view class="delete-img" @click="deleteBakeStep(bidx)">
							<image :src="imgUrl + 'closeStep.png'" mode=""></image>
						</view>
					</view>
					<view class="bake-dough-box">
						<view class="input-cont" @click="openWakeShow('wakeTime', bidx)">
							<view>时间</view>
							<view>
								<block v-if="bake.doughWake.time === ''">醒发时间</block>
								<block v-else>{{bake.doughWake.time}}</block>
							</view>
						</view>
						<view class="input-cont" @click="openWakeShow('wakeTemp', bidx)">
							<view>温度</view>
							<view>
								<block v-if="bake.doughWake.temp === ''">醒发温度 ℃</block>
								<block v-else>{{bake.doughWake.temp}}</block>
							</view>
						</view>
						<view class="input-cont no-border" @click="openWakeShow('wakeHumidity', bidx)">
							<view>湿度</view>
							<view>
								<block v-if="bake.doughWake.humidity === ''">醒发湿度 %RH</block>
								<block v-else>{{bake.doughWake.humidity}}</block>
							</view>
						</view>
					</view>
				</view>

				<!-- 烘焙 -->
				<view v-if="bake.doughBake != undefined">
					<view class="bake-dough">
						<view class="bake-tip">烘焙阶段</view>
						<view class="delete-img" @click="deleteBakeStep(bidx)">
							<image :src="imgUrl + 'closeStep.png'" mode=""></image>
						</view>
					</view>
					<view class="bake-dough-box">
						<view class="input-cont" @click="openWakeShow('bakeTime', bidx)">
							<view>时间</view>
							<view>
								<block v-if="bake.doughBake.time === ''">烘焙时间</block>
								<block v-else>{{bake.doughBake.time}}</block>
							</view>
						</view>
						<view class="input-cont" @click="openWakeShow('bakeTemp', bidx)">
							<view>温度</view>
							<view>
								<block v-if="bake.doughBake.temp === ''">烘焙温度 ℃</block>
								<block v-else>{{bake.doughBake.temp}}</block>
							</view>
						</view>
						<view class="input-cont" @click="openWakeShow('bakeHumidity', bidx)">
							<view>湿度</view>
							<view>
								<block v-if="bake.doughBake.humidity === ''">烘焙湿度 %RH</block>
								<block v-else>{{bake.doughBake.humidity}}</block>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="save-btn" @tap="$u.throttle(addRecipe, 1000)" :class="saveState ? 'disabled' : ''">{{saveTip}}</view>

		<u-popup :show="bakeTimeShow" @close="closeWakeShow" :closeable="true" round="10rpx">
			<view class="add-title">
				<block v-if="type == 'wakeTime'">醒发时间</block>
				<block v-else-if="type == 'wakeTemp'">醒发温度</block>
				<block v-else-if="type == 'wakeHumidity'">醒发湿度</block>
				<block v-if="type == 'bakeTime'">烘焙时间</block>
				<block v-else-if="type == 'bakeTemp'">烘焙温度</block>
				<block v-else-if="type == 'bakeHumidity'">烘焙湿度</block>
			</view>
			<view>
				<picker-view indicator-style="height: 70rpx;" :value="bakeTimeValue" @change="changeBakeTime"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in list" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow">自定义</view>
				<view @click="confirmBakeValue">确定</view>
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
				style: 'text-align: right; color: #ccc;font-size: 28rpx;',
				storeId: '',
				bakeTimeShow: false,
				definitionShow: false,
				list: [],
				// 烘焙时间
				bakeTimeList: ['30分钟', '40分钟', '50分钟', '1小时', '1.5小时', '2小时'],
				bakeTimeValue: '烘焙时间',
				bakeTimeIdx: 0,
				// 烘焙温度
				bakeTempList: ['100°C', '120°C', '140°C', '160°C', '180°C', '200°C', '220°C'],
				bakeTempValue: '烘焙温度',
				bakeTempIdx: 0,
				// 烘焙湿度
				bakeHumidityList: ['50%RH', '60%RH', '70%RH', '80%RH', '90%RH'],
				bakeHumidityValue: '烘焙湿度',
				bakeHumidityIdx: 0,
				type: '',
				definitionValue: '',
				ingredientState: false,
				stepState: false,
				difficulty: 0,
				operateList: [{
					id: 1,
					name: '添加标题'
				}, {
					id: 2,
					name: '添加步骤'
				}, {
					id: 3,
					name: '添加图片'
				}, {
					id: 4,
					name: '面团状态'
				}, {
					id: 5,
					name: '醒发'
				}, {
					id: 6,
					name: '烘烤'
				}],
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
				sonRefresh: false,
				cookbookName: '', // 食谱标题
				bakeProcessInfo: [],
				name: '',
				difficulty: 0,
				part: '',
				selectElementList: [],
				bakeIdx: 0,
				qiniuToken: '',
				productionTime: 0,
				saveState: false,
				saveTip: '保存'
			}
		},
		onLoad() {
			this.saveState = false
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getQiniuToken()
		},
		methods: {
			editBakeStep() {
				uni.navigateTo({
					url: './recipe'
				})
			},
			openDefinitionShow() {
				this.definitionValue = ''
				this.bakeTimeShow = false
				this.definitionShow = true
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				if (this.type == 'stepTime') {
					// 步骤用时
					this.bakeProcessInfo[this.bakeIdx].stepList.stepTime = this.definitionValue
				} else if (this.type == 'wakeTime') {
					// 醒发时间
					this.bakeProcessInfo[this.bakeIdx].doughWake.time = this.definitionValue
				} else if (this.type == 'wakeTemp') {
					// 醒发温度
					this.bakeProcessInfo[this.bakeIdx].doughWake.temp = this.definitionValue
				} else if (this.type == 'wakeHumidity') {
					// 醒发湿度
					this.bakeProcessInfo[this.bakeIdx].doughWake.humidity = this.definitionValue
				} else if (this.type == 'bakeTime') {
					// 烘焙时间
					this.bakeProcessInfo[this.bakeIdx].doughBake.time = this.definitionValue
				} else if (this.type == 'bakeTemp') {
					// 烘焙温度
					this.bakeProcessInfo[this.bakeIdx].doughBake.temp = this.definitionValue
				} else if (this.type == 'bakeHumidity') {
					// 烘焙湿度
					this.bakeProcessInfo[this.bakeIdx].doughBake.humidity = this.definitionValue
				}
				this.definitionShow = false
			},
			/* 选择难度 */
			chooseDifficulty(index) {
				this.difficulty += index
			},
			/* 减少难度 */
			cancleDifficulty(index) {
				this.difficulty = index
			},
			/* 选择制作过程 */
			addOperate(item) {
				console.log(item)
				if (item.id == 1) {
					// 添加标题
					this.bakeProcessInfo.push({
						title: ''
					})
				} else if (item.id == 2) {
					// 添加步骤
					this.bakeProcessInfo.push({
						stepList: {
							stepTime: '',
							stepCont: ''
						}
					})
				} else if (item.id == 3) {
					// 添加图片
					this.bakeProcessInfo.push({
						stepImg: ''
					})
				} else if (item.id == 4) {
					// 面团状态
					this.bakeProcessInfo.push({
						doughState: {
							weight: '',
							state: ''
						}
					})
				} else if (item.id == 5) {
					// 醒发
					this.bakeProcessInfo.push({
						doughWake: {
							time: '',
							temp: '',
							humidity: ''
						}
					})
				} else if (item.id == 6) {
					// 烘烤
					this.bakeProcessInfo.push({
						doughBake: {
							time: '',
							temp: '',
							humidity: ''
						}
					})
				}
			},
			/* 选择醒发 烘焙状态 */
			openWakeShow(type, index) {
				this.type = type
				console.log('type', type)
				console.log('index', index)
				this.bakeIdx = index
				console.log(this.bakeProcessInfo[this.bakeIdx])
				if (type == 'stepTime') {
					// 步骤用时
					this.list = this.stepTimeList
				} else if (type == 'wakeTime') {
					// 醒发时间
					this.list = this.wakeTimeList
				} else if (type == 'wakeTemp') {
					// 醒发温度
					this.list = this.wakeTempList
				} else if (type == 'wakeHumidity') {
					// 醒发湿度
					this.list = this.wakeHumidityList
				} else if (type == 'bakeTime') {
					// 烘焙时间
					this.list = this.bakeTimeList
				} else if (type == 'bakeTemp') {
					// 烘焙温度
					this.list = this.bakeTempList
				} else if (type == 'bakeHumidity') {
					// 烘焙湿度
					this.list = this.bakeHumidityList
				}
				this.bakeTimeShow = true
			},
			closeWakeShow() {
				this.bakeTimeShow = false
			},
			changeBakeTime(e) {
				console.log(e)
				if (this.type == 'stepTime') {
					// 步骤用时
					this.stepTimeIdx = e.detail.value[0]
				} else if (this.type == 'wakeTime') {
					// 醒发时间
					this.wakeTimeIdx = e.detail.value[0]
				} else if (this.type == 'wakeTemp') {
					// 醒发温度
					this.wakeTempIdx = e.detail.value[0]
				} else if (this.type == 'wakeHumidity') {
					// 醒发湿度
					this.wakeHumidityIdx = e.detail.value[0]
				} else if (this.type == 'bakeTime') {
					// 烘焙时间
					this.bakeTimeIdx = e.detail.value[0]
				} else if (this.type == 'bakeTemp') {
					// 烘焙温度
					this.bakeTempIdx = e.detail.value[0]
				} else if (this.type == 'bakeHumidity') {
					// 烘焙湿度
					this.bakeHumidityIdx = e.detail.value[0]
				}
			},
			confirmBakeValue() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					if (this.type == 'stepTime') {
						// 步骤用时
						this.bakeProcessInfo[this.bakeIdx].stepList.stepTime = this.stepTimeList[this.stepTimeIdx]
					} else if (this.type == 'wakeTime') {
						// 醒发时间
						this.bakeProcessInfo[this.bakeIdx].doughWake.time = this.wakeTimeList[this.wakeTimeIdx]
					} else if (this.type == 'wakeTemp') {
						// 醒发温度
						this.bakeProcessInfo[this.bakeIdx].doughWake.temp = this.wakeTempList[this.wakeTempIdx]
					} else if (this.type == 'wakeHumidity') {
						// 醒发湿度
						this.bakeProcessInfo[this.bakeIdx].doughWake.humidity = this.wakeHumidityList[this
							.wakeHumidityIdx]
					} else if (this.type == 'bakeTime') {
						// 烘焙时间
						this.bakeProcessInfo[this.bakeIdx].doughBake.time = this.bakeTimeList[this.bakeTimeIdx]
					} else if (this.type == 'bakeTemp') {
						// 烘焙温度
						this.bakeProcessInfo[this.bakeIdx].doughBake.temp = this.bakeTempList[this.bakeTempIdx]
					} else if (this.type == 'bakeHumidity') {
						// 烘焙湿度
						this.bakeProcessInfo[this.bakeIdx].doughBake.humidity = this.bakeHumidityList[this
							.bakeHumidityIdx]
					}
					this.bakeTimeShow = false
					this.computedBakeTime()
				}, 1000)
			},
			/* 删除制作过程 */
			deleteBakeStep(index) {
				this.bakeProcessInfo.splice(index, 1)
			},
			/* 新建配方 */
			addRecipe() {
				let that = this
				that.saveState = false
				that.saveTip = '保存中'
				let titleItems = [] // 标题列表
				let pictureItems = [] // 图片列表
				let operatingStepItems = [] // 步骤列表
				let doughPreparationItems = [] // 面团准备列表
				let fermentItems = [] // 醒发列表
				let bakingItems = [] // 烘烤列表
				let elementList = [] // 原料列表
				console.log('bakeProcessInfo', this.bakeProcessInfo)
				that.bakeProcessInfo.forEach((item, i) => {
					if (item.title != undefined) {
						titleItems.push({
							sequenceNumber: i + 1,
							description: item.title
						})
					}
					if (item.stepImg != undefined) {
						pictureItems.push({
							sequenceNumber: i + 1,
							picture: item.stepImg
						})
					}
					if (item.stepList != undefined) {
						operatingStepItems.push({
							sequenceNumber: i + 1,
							duration: parseInt(item.stepList.stepTime),
							description: item.stepList.stepCont
						})
					}
					if (item.doughState != undefined) {
						doughPreparationItems.push({
							sequenceNumber: i + 1,
							doughWeight: item.doughState.weight,
							doughStatus: item.doughState.state
						})
					}
					if (item.doughWake != undefined) {
						fermentItems.push({
							sequenceNumber: i + 1,
							fermentTime: parseInt(item.doughWake.time),
							fermentTemperature: parseInt(item.doughWake.temp),
							fermentHumidity: parseInt(item.doughWake.humidity)
						})
					}
					if (item.doughBake != undefined) {
						bakingItems.push({
							sequenceNumber: i + 1,
							bakingTime: parseInt(item.doughBake.time),
							fermentTemperature: parseInt(item.doughBake.temp),
							fermentHumidity: parseInt(item.doughBake.humidity)
						})
					}
				})
				that.selectElementList.forEach(value => {
					elementList.push({
						ingredientId: value.id,
						ingredientQuantity: value.elementQuantity,
						ingredientUnit: value.elementUnitId
					})
				})
				that.request({
					url: that.config.cookbookInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						name: that.name,
						difficulty: that.difficulty,
						part: that.part,
						ingredientItems: elementList,
						titleItems: titleItems,
						pictureItems: pictureItems,
						operatingStepItems: operatingStepItems,
						doughPreparationItems: doughPreparationItems,
						fermentItems: fermentItems,
						bakingItems: bakingItems
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '创建成功',
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
			chooseImg(index) {
				let that = this
				uni.chooseImage({
					count: 1,
					success: (rst) => {
						let goodsPath = rst.tempFilePaths[0]
						that.uploadFilePromise(goodsPath, index)
					}
				})
			},
			/* 上传图片 */
			uploadFilePromise(img, index) {
				let that = this
				uni.showToast({
					title: '上传中',
					icon: 'loading'
				})
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				console.log('上传七牛云地址', img)
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: img,
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
							that.bakeProcessInfo[index].stepImg = 'https://qiaokun.yuepong.com/' + data
								.key
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
				})
			},
			/* 跳转新建原料 */
			addIngredient() {
				uni.navigateTo({
					url: '../recipe/ingredient?selectElementList=' + JSON.stringify(this.selectElementList)
				})
			},
			/* 计算制作用时 */
			computedBakeTime() {
				this.productionTime = 0
				console.log('bakeProcessInfo', this.bakeProcessInfo)
				let stepTime
				let doughWakeTime
				let doughBakeTime
				this.bakeProcessInfo.forEach(item => {
					// 步骤用时
					if (item.stepList != undefined) {
						if (item.stepList.stepTime === '') {
							stepTime = 0
						} else {
							if (item.stepList.stepTime.indexOf('小时') > -1) {
								stepTime = parseFloat(item.stepList.stepTime) * 60
							} else {
								stepTime = parseFloat(item.stepList.stepTime)
							}
						}
						this.productionTime += stepTime
					}
					console.log('productionTime111111', this.productionTime)
					// 醒发
					if (item.doughWake != undefined) {
						if (item.doughWake.time === '') {
							doughWakeTime = 0
						} else {
							if (item.doughWake.time.indexOf('小时') > -1) {
								doughWakeTime = parseFloat(item.doughWake.time) * 60
							} else {
								doughWakeTime = parseFloat(item.doughWake.time)
							}
						}
						this.productionTime += doughWakeTime
					}
					console.log('productionTime222', this.productionTime)
					// 烘焙
					if (item.doughBake != undefined) {
						if (item.doughBake.time === '') {
							doughBakeTime = 0
						} else {
							if (item.doughBake.time.indexOf('小时') > -1) {
								doughBakeTime = parseFloat(item.doughBake.time) * 60
							} else {
								doughBakeTime = parseFloat(item.doughBake.time)
							}
						}
						this.productionTime += doughBakeTime
					}
					console.log('productionTime3333', this.productionTime)
				})
			},
			/* 删除选择的图片 */
			deleteSelectImg(index) {
				console.log('bakeProcessInfo', this.bakeProcessInfo)
				this.bakeProcessInfo[index].stepImg = ''
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style scoped>
	.add-bake-box {
		margin: 0 20rpx;
		font-size: 28rpx;
	}

	.make-name {
		margin: 40rpx 0;
		color: #333;
		font-weight: 600;
		font-size: 60rpx;
	}

	.make-name input {
		height: 60rpx;
	}

	.make-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 40rpx 0 30rpx;
		color: #999;
		font-size: 28rpx;
	}

	.computed-make-name {
		color: #333;
	}

	.bake-box {
		background-color: #fff;
		/* padding: 0 20rpx; */
		border-top: 6rpx solid #F2AB99;
		/* border-radius: 0 0 10rpx 10rpx; */
	}

	.add-ingredient-tip {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #999;
	}

	.ingredient-tip {
		color: #333;
		margin-right: 40rpx;
	}

	.add-ingredient-title {
		text-align: right;
		padding: 30rpx 0;
	}

	.make-difficulty {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.difficulty-img {
		display: flex;
		align-items: center;
	}

	.difficulty-img image {
		width: 42rpx;
		height: 42rpx;
		display: block;
		margin-left: 30rpx;
	}

	.setout-bake-completed {
		border-bottom: 1rpx solid #eee;
	}

	.setout-bake {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 30rpx 0;
		color: #999;
	}

	.unit-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.unit-box input {
		width: 100rpx;
	}

	.bake-stage {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.save-btn {
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		font-size: 28rpx;
		position: fixed;
		left: 24rpx;
		right: 24rpx;
		bottom: 40rpx;
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

	.bake-process {
		background-color: #fff;
	}

	.bake-operate-title {
		padding: 20rpx 0;
	}

	.bake-operate-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 16rpx;
	}

	.bake-operate {
		width: 150rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #fff;
		background-color: #F2AB99;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		margin: 0 14rpx 30rpx 0;
	}

	.bake-operate:nth-child(4n) {
		margin-right: 0;
	}

	.step-bake-box {
		font-size: 28rpx;
		color: #999;
		background-color: #fff;
		border-radius: 10rpx;
		border-bottom: 2rpx solid #eee;
		padding: 30rpx 0;
	}

	.step-bake-box>>>.u-textarea {
		padding: 0;
	}

	.input-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0 30rpx;
	}

	.no-border {
		border-bottom: 0;
	}

	.input-box {
		display: flex;
		align-items: center;
		text-align: right;
	}

	.delete-img {
		margin-left: 10rpx;
	}

	.delete-img image {
		width: 28rpx;
		height: 28rpx;
		display: block;
	}

	.step-input {
		padding-bottom: 20rpx;
	}

	.upload-sign {
		height: 400rpx;
	}
	
	.upload-isImg {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ddd;
		border-radius: 10rpx;
		position: relative;
		margin-top: 20rpx;
	}

	.upload-img {
		width: 60rpx;
		height: 60rpx;
	}

	.delete-step-img {
		position: absolute;
		top: 12rpx;
		right: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
	}
	
	.delete-step-img image {
		width: 28rpx;
		height: 28rpx;
	}

	.active-img {
		width: 100%;
		height: auto;
	}

	.cook-name-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2rpx solid #eee;
		padding-bottom: 30rpx;
	}

	.cook-name-input {
		color: #333;
		font-size: 36rpx;
	}

	.step-time-input {
		display: flex;
		align-items: center;
		color: #333;
	}

	.step-time {
		padding: 0 20rpx;
		color: #ccc;
	}

	.bake-dough {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		font-size: 32rpx;
	}

	.bake-dough-box {
		font-size: 28rpx;
		color: #999;
		background-color: #fff;
		border-radius: 10rpx;
		border-bottom: 2rpx solid #eee;
	}
	
	.disabled {
		pointer-events: none;
	}
</style>
