<template>
	<view>
		<view class="cook-name">
			<input type="number" v-model="cookbookInfo.name" placeholder="请输入食谱名称" :disabled="!editState" />
		</view>
		<view class="bake-time-box">
			<view class="bake-time-tip">
				<view class="bake-icon">
					<u-icon name="clock" color="#333" size="20"></u-icon>
				</view>
				<view>制作用时</view>
			</view>
			<view>{{productionTime}}分钟</view>
		</view>
		<view class="bake-time-box">
			<view class="bake-time-tip">
				<view class="bake-icon">
					<u-icon name="clock" color="#333" size="20"></u-icon>
				</view>
				<view>准备用时</view>
			</view>
			<view>{{preparationTime}}分钟</view>
		</view>
		<view class="bake-time-box border-bottom">
			<view class="bake-time-tip">
				<view class="bake-icon">
					<u-icon name="clock" color="#333" size="20"></u-icon>
				</view>
				<view>烘焙用时</view>
			</view>
			<view>{{bakingTime}}分钟</view>
		</view>
		<view class="bake-time-box border-bottom">
			<view>难度</view>
			<view class="difficulty-img">
				<view v-for="(img, index) in cookbookInfo.difficulty" :key="index">
					<image :src="imgUrl + 'difficulty.png'" @click="cancleDifficulty(index + 1)"></image>
				</view>
				<view v-for="(img, index) in (5 - cookbookInfo.difficulty)" :key="index">
					<image :src="imgUrl + 'undifficulty.png'" @click="chooseDifficulty(index + 1)"></image>
				</view>
			</view>
		</view>
		<view class="bake-time-box border-bottom">
			<view>份量</view>
			<view class="input-box">
				<input type="number" v-model="deal" placeholder="请输入份量" :disabled="!editState" />
				<view>份</view>
			</view>
		</view>
		<view class="bake-step-cont">
			<view class="add-ingredient">
				<view>食材</view>
				<view @click="addIngredient" class="price" v-if="editState">+添加原料</view>
			</view>
			<view class="ingredient-cont">
				<view class="ingredient-box" v-for="(item, index) in selectElementList" :key="index">
					<view>{{item.name}}</view>
					<view>{{item.elementQuantity}}{{item.elementUnit}}</view>
				</view>
			</view>
		</view>
		<block v-if="editState">
			<u-sticky>
				<view class="bake-process">
					<view class="bake-operate-title">制作过程</view>
					<view class="bake-operate-box">
						<view v-for="(oitem, oidx) in operateList" :key="oidx" class="bake-operate"
							@click="addOperate(oitem)">{{oitem.name}}</view>
					</view>
				</view>
			</u-sticky>
		</block>
		<block v-for="(item, index) in bakeProcessInfo" :key="index">
			<!-- 添加标题 -->
			<view v-if="item.title != undefined && item.title.detailFlag != 'deleted'" class="cook-name-box">
				<view class="cook-name-input">
					<input type="text" placeholder="请输入标题名称" v-model="item.title.title"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="delete-img" @click="deleteBakeStep(index, item)" v-if="editState">
					<image :src="imgUrl + 'closeStep.png'" mode=""></image>
				</view>
			</view>
			<!-- <view>准备阶段</view> -->
			<view v-if="item.doughState != undefined && item.doughState.detailFlag != 'deleted'" class="bake-step-cont">
				<view class="delete-box">
					<view>面团准备</view>
					<view class="delete-img" @click="deleteBakeStep(index, item)" v-if="editState">
						<image :src="imgUrl + 'closeStep.png'" mode=""></image>
					</view>
				</view>
				<view class="bake-dough-box">
					<view class="bake-time-box">
						<view>重量</view>
						<view class="input-box">
							<input type="digit" placeholder="面团重量" :placeholderStyle="style"
								v-model="item.doughState.weight" :disabled="!editState">
							<view>g</view>
						</view>
					</view>
					<view class="bake-time-box no-border">
						<view>状态</view>
						<view class="input-box">
							<input type="text" placeholder="面团状态" :placeholderStyle="style"
								v-model="item.doughState.state" :disabled="!editState">
						</view>
					</view>
				</view>
			</view>
			<view v-if="item.doughWake != undefined && item.doughWake.detailFlag != 'deleted'" class="bake-step-cont">
				<view class="delete-box">
					<view>面团醒发</view>
					<view class="delete-img" @click="deleteBakeStep(index, item)" v-if="editState">
						<image :src="imgUrl + 'closeStep.png'" mode=""></image>
					</view>
				</view>
				<view class="bake-dough-box">
					<view class="bake-time-box" @click="openWakeShow('wakeTime', index)">
						<view>时间</view>
						<view>
							<block v-if="item.doughWake.time === ''">醒发时间</block>
							<block v-else>{{item.doughWake.time}}分钟</block>
						</view>
					</view>
					<view class="bake-time-box" @click="openWakeShow('wakeTemp', index)">
						<view>温度</view>
						<view>
							<block v-if="item.doughWake.temp === ''">醒发温度 ℃</block>
							<block v-else>{{item.doughWake.temp}}℃</block>
						</view>
					</view>
					<view class="bake-time-box no-border" @click="openWakeShow('wakeHumidity', index)">
						<view>湿度</view>
						<view>
							<block v-if="item.doughWake.humidity === ''">醒发湿度 %RH</block>
							<block v-else>{{item.doughWake.humidity}}%RH</block>
						</view>
					</view>
				</view>
			</view>
			<view v-if="item.stepList != undefined && item.stepList.detailFlag != 'deleted'" class="bake-step-cont">
				<view>准备步骤</view>
				<view class="bake-time-box bake-step">
					<view>步骤{{item.stepList.index}}</view>
					<view class="bake-step-delete">
						<view class="bake-time-tip bake-step-time">
							<view class="bake-time-tip" @click="openWakeShow('stepTime', index)">
								<view class="bake-icon">
									<u-icon name="clock" color="#333" size="20"></u-icon>
								</view>
								<view>用时
									<text class="step-time">
										<block v-if="item.stepList.stepTime === ''">步骤用时</block>
										<block v-else>{{item.stepList.stepTime}}</block>
									</text>
									分钟
								</view>
							</view>
						</view>
						<view class="delete-img" @click="deleteBakeStep(index, item)" v-if="editState">
							<image :src="imgUrl + 'closeStep.png'" mode=""></image>
						</view>
					</view>
				</view>
				<view class="step-input">
					<u--textarea v-model="item.stepList.stepCont" :disabled="!editState" placeholder="请输入内容">
					</u--textarea>
				</view>
			</view>
			<view class="edit-cookbook-img" v-if="item.stepImg != undefined && item.stepImg.detailFlag != 'deleted'">
				<view class="delete-box">
					<view class="bake-tip">图片</view>
					<view class="delete-img" @click="deleteBakeStep(index, item)" v-if="editState">
						<image :src="imgUrl + 'closeStep.png'" mode=""></image>
					</view>
				</view>
				<view class="upload-isImg" @click="chooseImg(index)"
					:class="item.stepImg.stepImg === '' ? 'upload-sign' : ''">
					<block v-if="item.stepImg.stepImg === ''">
						<image :src="imgUrl + 'supplierAdd.png'" class="upload-img"></image>
					</block>
					<block v-else>
						<view class="delete-step-img" @click.stop="deleteSelectImg(bidx)" v-if="editState">
							<image :src="imgUrl + 'closeStep.png'" mode=""></image>
						</view>
						<image :src="item.stepImg.stepImg" class="active-img" mode="widthFix"></image>
					</block>
				</view>
			</view>
			<!-- <view v-if="item.stepImg != undefined" class="ingredient-img">
				<image :src="item.stepImg.stepImg" mode="widthFix"></image>
			</view> -->
			<view v-if="item.doughBake != undefined && item.doughBake.detailFlag != 'deleted'" class="bake-step-cont">
				<view class="delete-box">
					<view>烘焙阶段</view>
					<view class="delete-img" @click="deleteBakeStep(index, item)" v-if="editState">
						<image :src="imgUrl + 'closeStep.png'" mode=""></image>
					</view>
				</view>
				<view class="bake-dough-time">
					<view class="bake-time-box" @click="openWakeShow('bakeTime', index)">
						<view>时间</view>
						<view>
							<block v-if="item.doughBake.time === ''">烘焙时间</block>
							<block v-else>{{item.doughBake.time}}分钟</block>
						</view>
					</view>
					<view class="bake-time-box" @click="openWakeShow('bakeTemp', index)">
						<view>温度</view>
						<view>
							<block v-if="item.doughBake.temp === ''">烘焙温度 ℃</block>
							<block v-else>{{item.doughBake.temp}}℃</block>
						</view>
					</view>
					<view class="bake-time-box" @click="openWakeShow('bakeHumidity', index)">
						<view>湿度</view>
						<view>
							<block v-if="item.doughBake.humidity === ''">烘焙湿度 %RH</block>
							<block v-else>{{item.doughBake.humidity}}%RH</block>
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="supplier-btn" v-if="!editState">
			<view @click="deleteCookbook">删除食谱</view>
			<view class="edit-btn" @click="changeEditState">编辑食谱</view>
		</view>
		<view v-else class="save-btn" @tap="$u.throttle(editRecipe, 1000)">保存</view>
		<view style="height: 40rpx;"></view>

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
				cookbookInfo: {},
				cookbookId: '',
				editState: false,
				deal: '',
				bakeProcessInfo: [],
				selectElementList: [],
				storeId: '',
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
				wakeTimeShow: false,
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
				bakeTimeShow: false,
				productionTime: 0,
				bakingTime: 0,
				preparationTime: 0,
				qiniuToken: '',
				reelementList: [],
				definitionValue: ''
			}
		},
		onLoad(options) {
			this.cookbookId = options.cookbookId
			this.storeId = uni.getStorageSync('storeInfo').id
			this.getCookbookDetail()
			this.getQiniuToken()
		},
		methods: {
			/* 获取食谱详情 */
			getCookbookDetail() {
				let that = this
				let arr = []
				that.request({
					url: `${that.config.cookbookInfo}/${that.cookbookId}`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.cookbookInfo = data
					that.productionTime = data.productionTime
					that.preparationTime = data.preparationTime
					that.bakingTime = data.bakingTime
					that.deal = data.part
					data.ingredientItems.forEach(item => {
						item.name = item.ingredientName
						item.elementQuantity = item.ingredientQuantity
						item.elementUnit = item.ingredientUnitName
						item.unit = item.ingredientUnitName
					})
					that.selectElementList = data.ingredientItems
					that.reelementList = JSON.parse(JSON.stringify(data.ingredientItems))
					// 标题列表
					data.titleItems.forEach(item => {
						that.bakeProcessInfo.push({
							sequenceNumber: item.sequenceNumber,
							title: {
								id: item.id,
								title: item.description,
								sequenceNumber: item.sequenceNumber,
								detailFlag: 'modified'
							}
						})
					})
					// 步骤列表
					let index = 1
					data.operatingStepItems.forEach(item => {
						that.bakeProcessInfo.push({
							sequenceNumber: item.sequenceNumber,
							stepList: {
								id: item.id,
								stepTime: item.duration,
								stepCont: item.description,
								sequenceNumber: item.sequenceNumber,
								index: index,
								detailFlag: 'modified'
							}
						})
						index++
					})
					// 图片列表
					data.pictureItems.forEach(item => {
						that.bakeProcessInfo.push({
							sequenceNumber: item.sequenceNumber,
							stepImg: {
								id: item.id,
								stepImg: item.picture,
								sequenceNumber: item.sequenceNumber,
								detailFlag: 'modified'
							}
						})
					})
					// 面团状态
					data.doughPreparationItems.forEach(item => {
						that.bakeProcessInfo.push({
							sequenceNumber: item.sequenceNumber,
							doughState: {
								id: item.id,
								weight: item.doughWeight,
								state: item.doughStatus,
								sequenceNumber: item.sequenceNumber,
								detailFlag: 'modified'
							}
						})
					})
					// 面团醒发
					data.fermentItems.forEach(item => {
						that.bakeProcessInfo.push({
							sequenceNumber: item.sequenceNumber,
							doughWake: {
								id: item.id,
								time: item.fermentTime,
								temp: item.fermentTemperature,
								humidity: item.fermentHumidity,
								sequenceNumber: item.sequenceNumber,
								detailFlag: 'modified'
							}
						})
					})
					// 面团烘焙
					data.bakingItems.forEach(item => {
						that.bakeProcessInfo.push({
							sequenceNumber: item.sequenceNumber,
							doughBake: {
								id: item.id,
								time: item.bakingTime,
								temp: item.fermentTemperature,
								humidity: item.fermentHumidity,
								sequenceNumber: item.sequenceNumber,
								detailFlag: 'modified'
							}
						})
					})
					// 根据序号排序
					for (var i = 0; i < that.bakeProcessInfo.length; i++) {
						for (var j = i + 1; j < that.bakeProcessInfo.length; j++) {
							if (that.bakeProcessInfo[i].sequenceNumber > that.bakeProcessInfo[j].sequenceNumber) {
								var temp = that.bakeProcessInfo[i]
								that.bakeProcessInfo[i] = that.bakeProcessInfo[j]
								that.bakeProcessInfo[j] = temp
							}
						}
					}
					console.log('bakeProcessInfo', that.bakeProcessInfo)
				})
			},
			/* 删除食谱 */
			deleteCookbook() {
				let that = this
				uni.showModal({
					content: '确定要删除该食谱',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.cookbookInfo}/${that.cookbookId}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log(res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '删除成功',
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
				})
			},
			/* 编辑配方 */
			changeEditState() {
				this.editState = true
			},
			/* 选择难度 */
			chooseDifficulty(index) {
				if (this.editState) {
					this.cookbookInfo.difficulty += index
				}
			},
			/* 减少难度 */
			cancleDifficulty(index) {
				if (this.editState) {
					this.cookbookInfo.difficulty = index
				}
			},
			/* 修改配方 */
			editRecipe() {
				let that = this
				let titleItems = [] // 标题列表
				let pictureItems = [] // 图片列表
				let operatingStepItems = [] // 步骤列表
				let doughPreparationItems = [] // 面团准备列表
				let fermentItems = [] // 醒发列表
				let bakingItems = [] // 烘烤列表
				// let elementList = [] // 原料列表
				console.log('bakeProcessInfo', this.bakeProcessInfo)

				let elementList = []
				that.selectElementList.forEach(item => {
					that.reelementList.forEach(value => {
						if (item.ingredientId == value.ingredientId) {
							// 新选择的原料列表中无原料id与原原料列表中原料id相同
							elementList.push({
								id: value.id,
								ingredientId: item.ingredientId,
								ingredientQuantity: item.elementQuantity,
								ingredientUnit: value.ingredientUnit,
								detailFlag: 'modified'
							})
						}
					})
				})
				console.log('elementList', elementList)
				console.log('reelementList', that.reelementList)
				console.log('selectElementList', that.selectElementList)

				// 查询删除的原料
				let deleteElementArr = []
				for (let i = 0; i < that.reelementList.length; i++) {
					if (elementList.filter(e => e.ingredientId == that.reelementList[i].ingredientId).length == 0) {
						deleteElementArr.push({
							id: that.reelementList[i].id,
							ingredientId: that.reelementList[i].ingredientId,
							ingredientQuantity: that.reelementList[i].ingredientQuantity,
							ingredientUnit: that.reelementList[i].ingredientUnit,
							detailFlag: 'deleted'
						})
					}
				}
				elementList.push(...deleteElementArr)

				// 查询新增的原料
				let addElementArr = []
				for (let i = 0; i < that.selectElementList.length; i++) {
					if (that.reelementList.filter(e => e.ingredientId == that.selectElementList[i].ingredientId).length ==
						0) {
						addElementArr.push({
							ingredientId: that.selectElementList[i].ingredientId,
							ingredientQuantity: that.selectElementList[i].elementQuantity,
							ingredientUnit: that.selectElementList[i].elementUnitId,
							detailFlag: 'added'
						})
					}
				}
				elementList.push(...addElementArr)
				console.log('elementList', elementList)

				that.bakeProcessInfo.forEach((item, i) => {
					if (item.title != undefined) {
						titleItems.push({
							sequenceNumber: i,
							description: item.title.title,
							detailFlag: item.title.detailFlag,
							id: item.title.id
						})
					}
					if (item.stepImg != undefined) {
						pictureItems.push({
							sequenceNumber: i,
							picture: item.stepImg.stepImg,
							detailFlag: item.stepImg.detailFlag,
							id: item.stepImg.id
						})
					}
					if (item.stepList != undefined) {
						operatingStepItems.push({
							sequenceNumber: i,
							duration: parseInt(item.stepList.stepTime),
							description: item.stepList.stepCont,
							detailFlag: item.stepList.detailFlag,
							id: item.stepList.id
						})
					}
					if (item.doughState != undefined) {
						doughPreparationItems.push({
							sequenceNumber: i,
							doughWeight: item.doughState.weight,
							doughStatus: item.doughState.state,
							detailFlag: item.doughState.detailFlag,
							id: item.doughState.id
						})
					}
					if (item.doughWake != undefined) {
						fermentItems.push({
							sequenceNumber: i,
							fermentTime: parseInt(item.doughWake.time),
							fermentTemperature: parseInt(item.doughWake.temp),
							fermentHumidity: parseInt(item.doughWake.humidity),
							detailFlag: item.doughWake.detailFlag,
							id: item.doughWake.id
						})
					}
					if (item.doughBake != undefined) {
						bakingItems.push({
							sequenceNumber: i,
							bakingTime: parseInt(item.doughBake.time),
							fermentTemperature: parseInt(item.doughBake.temp),
							fermentHumidity: parseInt(item.doughBake.humidity),
							detailFlag: item.doughBake.detailFlag,
							id: item.doughBake.id
						})
					}
				})
				// that.selectElementList.forEach(value => {
				// 	elementList.push({
				// 		ingredientId: value.id,
				// 		ingredientQuantity: value.elementQuantity,
				// 		ingredientUnit: value.elementUnitId
				// 	})
				// })
				that.request({
					url: `${that.config.cookbookInfo}/${that.cookbookId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						name: that.cookbookInfo.name,
						difficulty: that.cookbookInfo.difficulty,
						part: that.deal,
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
			/* 跳转新建原料 */
			addIngredient() {
				uni.navigateTo({
					url: '../recipe/ingredient?selectElementList=' + JSON.stringify(this.selectElementList)
				})
			},
			/* 选择制作过程 */
			addOperate(item) {
				console.log(item)
				if (item.id == 1) {
					// 添加标题
					this.bakeProcessInfo.push({
						title: {
							title: '',
							detailFlag: 'added'
						}
					})
				} else if (item.id == 2) {
					// 添加步骤
					let index = this.cookbookInfo.operatingStepItems.length
					this.bakeProcessInfo.push({
						stepList: {
							stepTime: '',
							stepCont: '',
							index: index + 1,
							detailFlag: 'added'
						}
					})
				} else if (item.id == 3) {
					// 添加图片
					this.bakeProcessInfo.push({
						stepImg: {
							stepImg: '',
							detailFlag: 'added'
						}
					})
				} else if (item.id == 4) {
					// 面团状态
					this.bakeProcessInfo.push({
						doughState: {
							weight: '',
							state: '',
							detailFlag: 'added'
						}
					})
				} else if (item.id == 5) {
					// 醒发
					this.bakeProcessInfo.push({
						doughWake: {
							time: '',
							temp: '',
							humidity: '',
							detailFlag: 'added'
						}
					})
				} else if (item.id == 6) {
					// 烘烤
					this.bakeProcessInfo.push({
						doughBake: {
							time: '',
							temp: '',
							humidity: '',
							detailFlag: 'added'
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
						if (this.stepTimeList[this.stepTimeIdx].indexOf('小时') > -1) {
							this.stepTimeList[this.stepTimeIdx] = parseFloat(this.stepTimeList[this.stepTimeIdx]) *
								60
						}
						this.bakeProcessInfo[this.bakeIdx].stepList.stepTime = parseFloat(this.stepTimeList[this
							.stepTimeIdx])
					} else if (this.type == 'wakeTime') {
						// 醒发时间
						if (this.wakeTimeList[this.wakeTimeIdx].indexOf('小时') > -1) {
							this.wakeTimeList[this.wakeTimeIdx] = parseFloat(this.wakeTimeList[this.wakeTimeIdx]) *
								60
						}
						this.bakeProcessInfo[this.bakeIdx].doughWake.time = parseFloat(this.wakeTimeList[this
							.wakeTimeIdx])
					} else if (this.type == 'wakeTemp') {
						// 醒发温度
						this.bakeProcessInfo[this.bakeIdx].doughWake.temp = parseFloat(this.wakeTempList[this
							.wakeTempIdx])
					} else if (this.type == 'wakeHumidity') {
						// 醒发湿度
						this.bakeProcessInfo[this.bakeIdx].doughWake.humidity = parseFloat(this.wakeHumidityList[
							this
							.wakeHumidityIdx])
					} else if (this.type == 'bakeTime') {
						// 烘焙时间
						console.log('烘焙时间', this.bakeTimeList[this.bakeTimeIdx])
						if (this.bakeTimeList[this.bakeTimeIdx].indexOf('小时') > -1) {
							this.bakeTimeList[this.bakeTimeIdx] = parseFloat(this.bakeTimeList[this.bakeTimeIdx]) *
								60
						}
						this.bakeProcessInfo[this.bakeIdx].doughBake.time = parseFloat(this.bakeTimeList[this
							.bakeTimeIdx])
					} else if (this.type == 'bakeTemp') {
						// 烘焙温度
						this.bakeProcessInfo[this.bakeIdx].doughBake.temp = parseFloat(this.bakeTempList[this
							.bakeTempIdx])
					} else if (this.type == 'bakeHumidity') {
						// 烘焙湿度
						this.bakeProcessInfo[this.bakeIdx].doughBake.humidity = parseFloat(this.bakeHumidityList[
							this
							.bakeHumidityIdx])
					}
					this.bakeTimeShow = false
					this.computedBakeTime()
				}, 1000)
			},
			/* 删除制作过程 */
			deleteBakeStep(index, item) {
				if (item.title) {
					item.title.detailFlag = 'deleted'
				}
				if (item.stepList) {
					item.stepList.detailFlag = 'deleted'
				}
				if (item.stepImg) {
					item.stepImg.detailFlag = 'deleted'
				}
				if (item.doughState) {
					item.doughState.detailFlag = 'deleted'
				}
				if (item.doughWake) {
					item.doughWake.detailFlag = 'deleted'
				}
				if (item.doughBake) {
					item.doughBake.detailFlag = 'deleted'
				}
				// this.bakeProcessInfo.splice(index, 1)
			},
			/* 计算制作用时 */
			computedBakeTime() {
				this.productionTime = 0
				this.bakingTime = 0
				this.preparationTime = 0
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
							stepTime = item.stepList.stepTime
						}
						this.productionTime += stepTime
					}
					// 醒发
					if (item.doughWake != undefined) {
						if (item.doughWake.time === '') {
							doughWakeTime = 0
						} else {
							doughWakeTime = item.doughWake.time
						}
						this.productionTime += doughWakeTime
					}
					// 烘焙
					if (item.doughBake != undefined) {
						if (item.doughBake.time === '') {
							doughBakeTime = 0
						} else {
							doughBakeTime = item.doughBake.time
						}
						this.productionTime += doughBakeTime
						this.bakingTime += doughBakeTime
					}
				})
				this.preparationTime = this.productionTime - this.bakingTime
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
							that.bakeProcessInfo[index].stepImg.stepImg =
								'https://qiaokun.yuepong.com/' + data
								.key
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
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
				if (this.definitionValue.indexOf('小时') > -1) {
					this.definitionValue = parseFloat(this.definitionValue) * 60
				}
				if (this.type == 'stepTime') {
					// 步骤用时
					this.bakeProcessInfo[this.bakeIdx].stepList.stepTime = parseFloat(this.definitionValue)
				} else if (this.type == 'wakeTime') {
					// 醒发时间
					this.bakeProcessInfo[this.bakeIdx].doughWake.time = parseFloat(this.definitionValue)
				} else if (this.type == 'wakeTemp') {
					// 醒发温度
					this.bakeProcessInfo[this.bakeIdx].doughWake.temp = parseFloat(this.definitionValue)
				} else if (this.type == 'wakeHumidity') {
					// 醒发湿度
					this.bakeProcessInfo[this.bakeIdx].doughWake.humidity = parseFloat(this.definitionValue)
				} else if (this.type == 'bakeTime') {
					// 烘焙时间
					this.bakeProcessInfo[this.bakeIdx].doughBake.time = parseFloat(this.definitionValue)
				} else if (this.type == 'bakeTemp') {
					// 烘焙温度
					this.bakeProcessInfo[this.bakeIdx].doughBake.temp = parseFloat(this.definitionValue)
				} else if (this.type == 'bakeHumidity') {
					// 烘焙湿度
					this.bakeProcessInfo[this.bakeIdx].doughBake.humidity = parseFloat(this.definitionValue)
				}
				this.definitionShow = false
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
	.cook-name {
		font-size: 40rpx;
		padding: 30rpx 0;
		margin: 0 20rpx;
		color: #333;
		border-bottom: 1rpx solid #eee;
	}

	.bake-time-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		padding: 30rpx 0 0;
		margin: 0 20rpx;
	}

	.bake-icon {
		margin-right: 10rpx;
	}

	.border-bottom {
		border-bottom: 1rpx solid #eee;
		padding-bottom: 30rpx;
	}

	.bake-step-delete {
		display: flex;
		align-items: center;
	}

	.bake-step-delete image {
		width: 26rpx;
		height: 26rpx;
		display: block;
		margin-left: 10rpx;
	}

	.bake-time-tip {
		display: flex;
		align-items: center;
	}

	.bake-time-tip image {
		width: 24rpx;
		height: 24rpx;
		display: block;
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

	.ingredient-cont {
		margin: 0 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.ingredient-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 30rpx;
	}

	.input-box {
		display: flex;
		align-items: center;
	}

	.input-box input {
		text-align: right;
	}

	.supplier-btn {
		display: flex;
		align-items: center;
		margin: 190rpx 24rpx 0;
		font-size: 28rpx;
	}

	.supplier-btn view {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #F2AB99;
		border-radius: 50rpx;
		border: 2rpx solid #F2AB99;
	}

	.supplier-btn view.edit-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}

	.save-btn {
		margin: 40rpx 24rpx;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #F2AB99;
		color: #fff;
		border-radius: 50rpx;
	}

	.ingredient-img {
		margin: 0 24rpx;
	}

	.ingredient-img image {
		width: 100%;
		height: auto;
		display: block;
	}

	.cook-name-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2rpx solid #eee;
		padding: 30rpx 0;
		margin: 0 24rpx;
	}

	.cook-name-input {
		color: #333;
		font-size: 28rpx;
	}

	.bake-dough-box {
		/* margin: 0 24rpx;
		padding: 30rpx 0; */
		border-bottom: 1rpx solid #eee;
	}

	/* .bake-dough-time {
		margin: 0 20rpx;
	} */

	.add-ingredient {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bake-step {
		font-size: 28rpx;
		color: #999;
		padding-bottom: 30rpx;
		margin: 0;
	}

	.bake-step-time {
		color: #333;
	}

	.bake-process {
		background-color: #fff;
		margin: 0 24rpx;
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

	.delete-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.delete-img image {
		width: 28rpx;
		height: 28rpx;
		display: block;
	}

	.step-time {
		padding: 0 20rpx;
		color: #ccc;
	}

	.bake-step-cont {
		margin: 0 24rpx;
		padding: 30rpx 0;
	}

	.edit-cookbook-img {
		margin: 0 24rpx;
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
</style>
