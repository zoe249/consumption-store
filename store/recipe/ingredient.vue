<template>
	<view>
		<view class="element-cont">
			<view class="element-box" v-for="(item, index) in selectElementList" :key="index">
				<view>{{item.name}}</view>
				<view @click="openElementSpecShow(item, index)" class="element-info">
					<block v-if="item.elementQuantity === '' || item.elementUnit === ''">数量选择</block>
					<block>{{item.elementQuantity}}{{item.elementUnit}}</block>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<view @click="selectElement">原料选择</view>
			<view class="save-btn" @click="saveElement">保存</view>
		</view>

		<u-popup :show="elementSpecShow" @close="closeElementSpecShow" :round="10">
			<view>
				<view class="select-spec-title">
					<view>原料选择</view>
					<view class="select-element-name">{{elementName}}</view>
				</view>
				<view>
					<view class="select-input">
						<view>数量</view>
						<input type="number" placeholder="请输入原料数量" v-model="elementQuantity" />
					</view>
					<view class="select-input">
						<view>单位</view>
						<view class="select-element-unit" @click="openSelectUnit">
							<view v-if="elementUnit === ''" class="add-unit-tip">请选择单位</view>
							<view v-else>{{elementUnit}}</view>
							<view class="unit-select">选择</view>
						</view>
					</view>
					<view class="select-input">
						<view>价格参考</view>
						<view @click="openPriceSpecShow">
							<view v-if="supplierName == ''" class="add-unit-tip">请选择</view>
							<view v-else>{{supplierName}} ￥{{price}}/{{quantity}}{{unit}}</view>
						</view>
					</view>
				</view>
				<view class="select-element-btn">
					<view @click="deleteElement">删除原料</view>
					<view class="element-save-btn" @click="saveElementSelect">保存</view>
				</view>
			</view>
		</u-popup>

		<!-- 单位 -->
		<u-popup :show="unitShow" @close="closeSelectUnit" :closeOnClickOverlay="true" :round="10">
			<view>
				<block v-if="!addUnitShow">
					<view class="unit-operate">
						<!-- <view @click="closeSelectUnit">取消</view> -->
						<view class="unit-cont">
							<view v-for="(unit, index) in unitTypeList" :key="index" class="unit-box"
								:class="unitIdx == index ? 'active-unit' : ''" @click="changeUnit(unit, index)">
								{{unit.name}}
							</view>
						</view>
						<view @click="openAddUnit">
							<u-icon name="plus" :color="unitIdx == 2 ? '#F2AB99' : '#999'" size="20"></u-icon>
						</view>
					</view>
					<view class="unit-name-cont">
						<view class="unit-name-box" v-for="(item, idx) in unitList" :key="idx" @click="selectUnit(item)"
							@longpress="deleteUnit(item)">
							<view>{{item.name}}</view>
							<view class="matrixing-box">
								<view>{{item.conversionValue}}</view>
								<view>{{item.unitName}}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-if="addUnitShow">
					<view class="unit-operate">
						<view @click="closeAddUnit">取消</view>
						<view>抽象单位</view>
						<view @click="addAbstractUnit">完成</view>
					</view>
					<view class="add-unit-box">
						<view class="add-box">
							<view>新建单位</view>
							<view>
								<input type="text" placeholder="请输入单位名称" v-model="addUnitName"
									:placeholderStyle="style">
							</view>
						</view>
						<view class="add-box">
							<view>数量</view>
							<view>
								<input type="number" placeholder="请输入数量" v-model="addUnitNum" :placeholderStyle="style">
							</view>
						</view>
						<view class="add-box">
							<view>单位</view>
							<view class="add-input" @click="addSelecAbstrtUnit">
								<block v-if="elementAbstracUnit === ''">请选择单位</block>
								<block v-else>{{elementAbstracUnit}}</block>
							</view>
						</view>
					</view>
				</block>
			</view>
		</u-popup>

		<!-- 添加抽象单位选择 -->
		<u-popup :show="addSelectUnitShow" @close="closeSelectAbstrUnit" :closeOnClickOverlay="true" :round="10">
			<view>
				<view class="abstrac-unit-operate unit-operate">
					<view class="unit-cont">
						<view v-for="(unit, index) in abstracUnitTypeList" :key="index" class="unit-box"
							:class="abstrUnitIdx == index ? 'active-unit' : ''" @click="changeAbstrUnit(unit, index)">
							{{unit.name}}
						</view>
					</view>
				</view>
				<view class="unit-name-cont">
					<view class="unit-name-box" v-for="(item, idx) in unitList" :key="idx"
						@click="selectAbstracUnit(item)">
						<view>{{item.name}}</view>
						<view class="matrixing-box">
							<view>{{item.conversionValue}}</view>
							<view>{{item.unitName}}</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 价格参考 -->
		<u-popup :show="priceSpecShow" @close="closePriceSpecShow">
			<view>
				<view class="picker-btn">
					<view @click="closePriceSpecShow">取消</view>
					<view @click="confirmSelectPrice">确定</view>
				</view>
				<picker-view indicator-style="height: 50px;" :value="value" @change="bindChangeSupplier"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in priceList" :key="index">{{item.supplierName}}
							￥{{item.price}}/{{item.quantity}}{{item.unit}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: '',
				selectElementList: [],
				elementSpecShow: false,
				priceSpecShow: false,
				priceList: [],
				supplierPrice: '',
				elementUnit: '',
				addElementUnit: '',
				unitShow: false,
				unitTypeList: [{
					value: 1,
					name: '重量'
				}, {
					value: 2,
					name: '容积'
				}, {
					value: 0,
					name: '抽象单位'
				}],
				unitType: '',
				unitList: [],
				unitIdx: 0,
				addUnitShow: false,
				elementIdx: '',
				elementName: '',
				quantity: '',
				value: [0],
				priceIdx: 0,
				price: '',
				supplierName: '',
				elementQuantity: '',
				unit: '',
				unitInfo: {},
				unitMatrixing: 0,
				abstracUnitTypeList: [{
					value: 1,
					name: '重量'
				}, {
					value: 2,
					name: '容积'
				}],
				abstrUnitIdx: 0,
				elementAbstracUnit: '',
				elementAbstracUnitId: '',
				baseUnitList: [],
				abstractionUnitList: [],
				addSelectUnitShow: false,
				recipeIdx: -1,
				recipeId: '',
				detailState: false
			}
		},
		onLoad(options) {
			this.selectElementList = JSON.parse(options.selectElementList)
			this.detailState = options.detailState == 'true' ? true : false
			console.log('selectElementList', this.selectElementList)
			this.storeId = uni.getStorageSync('storeInfo').id
			this.unitType = this.unitTypeList[0].value
			this.getUnitList()
			let i = 0
			this.getBaseUnitList(i) // 获取基本单位列表
		},
		watch: {
			elementUnit() {
				this.computedPrice()
			},
			elementQuantity() {
				this.computedPrice()
			},
			/* 计算成本 */
			supplierName() {
				this.computedPrice()
			}
		},
		methods: {
			computedPrice() {
				console.log('elementQuantity', this.elementQuantity)
				console.log('conversionValue', this.unitInfo.conversionValue)
				console.log('unitName', this.unitInfo.unitName)
				let unitId = this.priceList[this.priceIdx].unitId
				let conversionValue = this.priceList[this.priceIdx].conversionValue
				let unitInfo = {}
				if (this.elementQuantity === '') {
					// 未输入数量
					this.unitMatrixing = this.unitInfo.conversionValue + this.unitInfo.unitName
				} else {
					this.unitMatrixing = this.elementQuantity * this.unitInfo.conversionValue + this.unitInfo.unitName
				}
				console.log('单位换算', this.unitMatrixing)
				console.log('priceList', this.priceList[this.priceIdx])
				console.log(this.priceList[this.priceIdx].price) // 200
				console.log(conversionValue) // 1
				console.log(this.unitInfo.conversionValue) // 1
				console.log(this.elementQuantity) // 10
				this.selectElementList[this.elementIdx].cost = (this.priceList[this.priceIdx].price / (conversionValue / (
					this.unitInfo
					.conversionValue * this.elementQuantity))).toFixed(2)
				console.log('原料成本', this.selectElementList[this.elementIdx].cost)
			},
			/* 跳转原料选择 */
			selectElement() {
				uni.navigateTo({
					url: './selectElement?selectElementList=' + JSON.stringify(this.selectElementList) +
						'&recipeIdx=' + this.recipeIdx + '&recipeId=' + this.recipeId
				})
			},
			/* 保存原料选择 */
			saveElement() {
				console.log('选择后的原料', this.selectElementList)
				let that = this
				let flag = true
				this.selectElementList.forEach(item => {
					if (item.elementQuantity === '') {
						flag = false
						uni.showToast({
							title: '请进行数量选择',
							icon: 'none'
						})
					}
				})
				if (flag) {
					if (this.detailState) {
						uni.redirectTo({
							url: './add?selectElementList=' + JSON.stringify(that.selectElementList) + '&editState=true'
						})
					} else {
						var pages = getCurrentPages()
						var prevPage = pages[pages.length - 2]
						prevPage.$vm.selectElementList = that.selectElementList
						prevPage.$vm.editState = true
						prevPage.$vm.detailAddState = true
						uni.navigateBack()
					}
				}
			},
			openElementSpecShow(item, index) {
				console.log('选择原料', item)
				// 筛选基础单位，赋值选择修改的单位
				if (item.quantity !== '' && item.unit !== '') {
					// 编辑
					this.baseUnitList.forEach(value => {
						if (value.id == item.elementUnitId || value.id == item.ingredientUnit) {
							this.unitInfo = value
						}
					})
					console.log('unitInfo', this.unitInfo)
				}
				this.elementName = item.name
				if (item.quantity === '') {
					this.elementQuantity = ''
				} else {
					this.elementQuantity = item.elementQuantity
				}
				if (item.unit === '') {
					this.elementUnit = ''
				} else {
					this.elementUnit = item.elementUnit
				}
				if (item.price === '') {
					this.supplierName = ''
					this.price = ''
					this.quantity = ''
					this.unit = ''
				} else {
					this.supplierName = item.supplierName
					this.price = item.price
					this.quantity = item.quantity
					this.unit = item.unit
				}
				this.elementIdx = index
				this.elementSpecShow = true
				this.getSupplierInfo(item)
			},
			closeElementSpecShow() {
				this.elementIdx = ''
				this.elementSpecShow = false
			},
			openPriceSpecShow() {
				this.priceSpecShow = true
				this.elementSpecShow = false
			},
			closePriceSpecShow() {
				this.priceSpecShow = false
				this.elementSpecShow = true
			},
			bindChangeSupplier(e) {
				console.log('改变价格参考选择', e)
				this.priceIdx = e.detail.value[0]
			},
			/* 价格选择 */
			confirmSelectPrice(e) {
				let index = this.priceIdx
				console.log('选择价格', this.priceList[index])
				let item = this.priceList[index]
				console.log('baseUnitList', this.baseUnitList)
				for (let i = 0; i < this.baseUnitList.length; i++) {
					if (item.unit != 'g' && item.unit != 'ml') {
						console.log('基础单位', this.baseUnitList)
						console.log('unitType', this.unitType)
						if (this.unitType == 0) {
							// 抽象单位  单位的单位id与基础单位id比较
							if (item.conversionUnit == this.baseUnitList[i].id) {
								console.log('抽象单位')
								console.log('item', item)
								console.log('value', this.baseUnitList[i])
								item.name = this.baseUnitList[i].name
								item.unitName = this.baseUnitList[i].unitName
								item.conversionUnit = this.baseUnitList[i].conversionUnits
								item.conversionValue = this.baseUnitList[i].conversionValue * item.quantity
								break
							}
						} else {
							if (item.unitId == this.baseUnitList[i].id) {
								console.log('基础单位')
								console.log('item', item)
								console.log('value', this.baseUnitList[i])
								item.name = this.baseUnitList[i].name
								item.unitName = this.baseUnitList[i].unitName
								item.conversionUnit = this.baseUnitList[i].conversionUnits
								item.conversionValue = this.baseUnitList[i].conversionValue * item.quantity
								break
							}
						}
					} else {
						item.conversionValue = this.priceList[index].quantity
					}
				}
				console.log('选择价格', this.priceList[index])
				let supplierName = this.priceList[index].supplierName
				let price = this.priceList[index].price
				let quantity = this.priceList[index].quantity
				let unit = this.priceList[index].unit
				let unitId = this.priceList[index].unitId
				console.log('价格参考单位', quantity + unit)
				this.supplierName = supplierName
				this.price = price
				this.quantity = quantity
				this.unit = unit
				this.priceSpecShow = false
				this.elementSpecShow = true
			},
			openSelectUnit() {
				this.elementSpecShow = false
				this.unitShow = true
				this.unitIdx = 0
				this.unitType = this.unitTypeList[0].value
				this.getUnitList()
				this.addUnitShow = false
			},
			closeSelectUnit() {
				this.unitShow = false
				this.elementSpecShow = true
			},
			// addSelectUnit() {
			// 	this.addSelectUnitShow = true
			// },
			// closeSelectUnit() {
			// 	this.addSelectUnitShow = false
			// },
			openSelectElement() {
				this.selectElementShow = true
				// this.getElementList()
			},
			closeSelectElement() {
				this.selectElementShow = false
			},
			/* 删除原料 */
			deleteElement() {
				this.selectElementList.splice(this.elementIdx, 1)
				this.elementSpecShow = false
			},
			/* 获取原料供货商详情 */
			getSupplierInfo(item) {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId,
						name: that.elementName
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.priceList = data
					if (item.quantity !== '' && item.unit !== '') {
						// 编辑
						that.priceList.forEach((value, i) => {
							console.log('value', value)
							console.log('item', item)
							if (value.id == item.ingredientId) {
								item.price = value.price
								item.supplierName = value.supplierName
								item.quantity = value.quantity
								item.unit = value.unit
								that.supplierName = item.supplierName
								that.price = item.price
								that.quantity = item.quantity
								that.unit = item.unit
								that.priceIdx = i
								console.log('priceIdx', that.priceIdx)
							}
						})
						that.confirmSelectPrice()
					}
				})
			},
			/* 保存原料选择 */
			saveElementSelect() {
				this.selectElementList[this.elementIdx].elementUnit = this.elementUnit
				this.selectElementList[this.elementIdx].elementUnitId = this.elementUnitId
				this.selectElementList[this.elementIdx].elementQuantity = this.elementQuantity
				this.selectElementList[this.elementIdx].price = this.price
				this.selectElementList[this.elementIdx].quantity = this.quantity
				this.selectElementList[this.elementIdx].unit = this.unit
				this.selectElementList[this.elementIdx].ingredientId = this.selectElementList[this.elementIdx].id
				this.elementSpecShow = false
			},
			/* 选中单位 */
			selectUnit(item) {
				this.elementUnit = item.name
				this.elementUnitId = item.id
				this.unitShow = false
				this.elementSpecShow = true
				if (item.name != 'g' && item.name != 'ml') {
					// 单位转换
					console.log('单位转换')
					// 抽象单位的基础id匹配基础单位列表的单位
					this.conversionUnit(item)
				} else {
					this.unitInfo = item
					console.log('unitInfo', this.unitInfo)
				}
			},
			/* 单位转换 */
			conversionUnit(item) {
				this.baseUnitList.forEach(value => {
					if (item.conversionUnits == value.id) {
						if (item.unitName != 'g' && item.unitName != 'ml') {
							console.log('item', item)
							console.log('value', value)
							item.name = value.name
							item.unitName = value.unitName
							item.conversionUnits = value.conversionUnits
							item.conversionValue = value.conversionValue
						}
					}
				})
				this.unitInfo = item
				console.log('unitInfo', this.unitInfo)
			},
			/* 切换单位选择 */
			changeUnit(item, index) {
				this.unitIdx = index
				this.unitType = item.value
				this.getUnitList()
			},
			/* 获取单位列表 */
			getUnitList() {
				let that = this
				that.request({
					url: that.config.unitsInfo,
					data: {
						storeId: that.storeId,
						type: that.unitType
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						const data = res.data.data
						if (that.unitType == 0) {
							// 抽象单位
							data.forEach(item => {
								that.baseUnitList.forEach(value => {
									if (item.conversionUnits == value.id) {
										item.unitName = value.name
									}
								})
							})
						} else {
							data.forEach(item => {
								data.forEach(value => {
									if (item.name == 'g') {
										item.conversionValue = 1
										item.unitName = 'g'
									} else if (item.name == 'ml') {
										item.conversionValue = 1
										item.unitName = 'ml'
									} else {
										if (item.conversionUnits == value.id) {
											item.unitName = value.name
										}
									}
								})
							})
						}
						that.unitList = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			openAddUnit() {
				if (this.unitIdx == 2) {
					// 添加抽象单位
					this.addUnitShow = true
				}
			},
			closeAddUnit() {
				this.addUnitShow = false
			},
			addSelecAbstrtUnit() {
				this.unitShow = false
				this.addSelectUnitShow = true
				this.abstrUnitIdx = 0
				this.unitType = this.abstracUnitTypeList[0].value
				this.getUnitList()
			},
			/* 选中抽象单位单位 */
			selectAbstracUnit(item) {
				console.log('选择抽象单位单位', item)
				this.elementAbstracUnit = item.name
				this.elementAbstracUnitId = item.id
				this.abstractValue = item.conversionValue
				this.addSelectUnitShow = false
				this.unitShow = true
				this.addUnitShow = true
			},
			changeAbstrUnit(item, index) {
				this.abstrUnitIdx = index
				this.unitType = item.value
				this.getUnitList()
			},
			/* 添加抽象单位 */
			addAbstractUnit() {
				let that = this
				that.request({
					url: that.config.unitsInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						name: that.addUnitName,
						conversionUnit: that.elementAbstracUnitId,
						convertedValue: 1
					}
				}).then(res => {
					console.log('添加单位', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.addUnitShow = false
							that.unitType = 0
							that.getUnitList()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 基本单位列表 */
			getBaseUnitList(i) {
				let that = this
				if (i < 3) {
					that.request({
						url: that.config.unitsInfo,
						data: {
							storeId: that.storeId,
							type: i
						}
					}).then(res => {
						console.log(res)
						const data = res.data.data
						if (data.length != 0) {
							data.forEach(item => {
								data.forEach(value => {
									if (item.name == 'g') {
										item.conversionValue = 1
										item.unitName = 'g'
									} else if (item.name == 'ml') {
										item.conversionValue = 1
										item.unitName = 'ml'
									} else {
										if (item.conversionUnits == value.id) {
											item.unitName = value.name
										}
									}
								})
							})
						}
						that.baseUnitList.push(...data)
						console.log('基础单位列表', this.baseUnitList)
						i++
						that.getBaseUnitList(i)
					})
				}
			},
			/* 删除抽象单位 */
			deleteUnit(item) {
				let that = this
				if (that.unitIdx == 2) {
					uni.showModal({
						content: '确定删除该单位',
						success: function(res) {
							if (res.confirm) {
								that.request({
									url: `${that.config.unitsInfo}/${item.id}`,
									method: 'DElETE',
									header: {
										'Content-Type': 'application/json',
										'Transaction-No': new Date().getTime()
									}
								}).then(res => {
									if (res.data.code == '200000') {
										uni.showToast({
											title: '删除成功',
											icon: 'none'
										})
										setTimeout(() => {
											that.addUnitShow = false
											that.unitType = 0
											that.getUnitList()
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
				}
			}
		}
	}
</script>

<style scoped>
	.element-cont {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
	}

	.element-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.element-info {
		color: #999;
	}

	.add-btn {
		display: flex;
		align-items: center;
		margin: 40rpx 24rpx;
		font-size: 28rpx;
	}

	.add-btn view {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #F2AB99;
		border-radius: 50rpx;
		border: 2rpx solid #F2AB99;
	}

	.add-btn view.save-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}

	.select-spec-title {
		text-align: center;
		color: #333;
		font-size: 36rpx;
		padding: 20rpx 0;
	}

	.select-element-name {
		font-size: 28rpx;
		color: #999;
	}

	.select-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.select-input input {
		text-align: right;
	}

	.select-element-unit {
		display: flex;
		align-items: center;
	}

	.unit-select {
		color: #62B279;
		margin-left: 14rpx;
	}

	.unit-operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 24rpx;
		font-size: 28rpx;
	}

	.unit-name-cont {
		margin: 0 24rpx;
	}

	.unit-name-box {
		padding: 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.matrixing-box {
		display: flex;
		align-items: center;
	}

	.unit-cont {
		display: flex;
		align-items: center;
	}

	.unit-box {
		margin: 0 20rpx;
		padding-bottom: 8rpx;
		color: #999;
	}

	.active-unit {
		color: #333;
		border-bottom: 4rpx solid #F2AB99;
	}

	.add-unit-box {
		padding: 0 20rpx;
	}

	.add-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.add-box:last-child {
		border-bottom: 0;
	}

	.add-input {
		display: flex;
		align-items: center;
	}

	.add-box input {
		text-align: right;
	}

	.select-element-btn {
		display: flex;
		align-items: center;
		margin: 40rpx 24rpx;
		font-size: 28rpx;
	}

	.select-element-btn view {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #F2AB99;
		border-radius: 50rpx;
		border: 2rpx solid #F2AB99;
	}

	.select-element-btn view.element-save-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}

	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
	}

	.item {
		height: 50px;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.picker-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.abstrac-unit-operate {
		justify-content: center;
	}

	.add-unit-tip {
		color: #999;
	}
</style>
