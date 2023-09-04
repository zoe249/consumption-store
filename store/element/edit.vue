<template>
	<view>
		<view class="element-name">
			<input type="text" placeholder="请输入原料名称" v-model="elementName">
			<view @click="openSelectElement" v-if="isSelectElement" class="select-element-tip">原料选择</view>
		</view>
		<view class="add-element">
			<view class="add-box">
				<view>供货商</view>
				<view @click="goSelectSupplier" class="add-tip-box">
					<block v-if="supplierName === ''">
						<image :src="imgUrl + 'addTip.png'" mode=""></image>
						<view>添加</view>
					</block>
					<block v-else>{{supplierName}}</block>
				</view>
			</view>
			<view class="add-box">
				<view>价格</view>
				<view class="add-input">
					<input type="digit" placeholder="请输入原料价格" v-model="elementPrice" :placeholderStyle="style">
					<view class="dollars">元</view>
				</view>
			</view>
			<view class="add-box">
				<view>数量</view>
				<view>
					<input type="number" placeholder="请输入原料数量" v-model="elementNum" :placeholderStyle="style">
				</view>
			</view>
			<view class="add-box">
				<view>单位</view>
				<view class="add-input" @click="openSelectUnit">
					<view class="add-unit">
						<block v-if="elementUnit === ''">请选择单位</block>
						<block v-else>{{elementUnit}}</block>
					</view>
					<view class="add-tip-box">
						<image :src="imgUrl + 'addTip.png'" mode=""></image>
						<view>添加</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @click="saveElement" v-if="!editSupplier">保存</view>
		<view class="supplier-btn" v-if="editSupplier">
			<view @click="deleteElementSupplier">删除原料</view>
			<view class="save-btn" @click="saveSupplierInfo">保存</view>
		</view>

		<!-- 单位 -->
		<u-popup :show="unitShow" @close="closeSelectUnit" :closeOnClickOverlay="true" :round="10">
			<view class="unit-info">
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
						<view class="unit-name-box" v-for="(item, idx) in unitList" :key="idx"
							@click="selectUnit(item)" @longpress="deleteUnit(item)">
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
							<view class="add-input" @click="addSelectUnit">
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

		<!-- 原料选择 -->
		<u-popup :show="selectElementShow" @close="closeSelectElement" :closeOnClickOverlay="true" :closeable="true"
			:round="10">
			<view class="unit-info">
				<view class="select-element">原料选择</view>
				<view class="select-element-box">
					<view v-for="(item, index) in elementList" :key="index" class="element-box"
						@click="selectElement(item)">{{item.name}}</view>
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
				style: 'text-align: right; color: #999; font-size: 28rpx;',
				elementName: '',
				supplierName: '',
				supplierId: '',
				elementPrice: '',
				elementNum: '',
				elementUnit: '',
				elementUnitId: '',
				unitShow: false,
				storeId: '',
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
				addUnitName: '',
				addUnitNum: '',
				addElementUnit: '',
				addSelectUnitShow: false,
				selectElementShow: false,
				elementList: [],
				editSupplier: false,
				elementId: '',
				elementInfo: {},
				isSelectElement: false,
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
				abstractValue: '', // 抽象单位换算值
				baseUnitList: []
			}
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.unitType = this.unitTypeList[0].value
			this.supplierId = options.supplierId == undefined ? '' : options.supplierId
			this.elementId = options.elementId == undefined ? '' : options.elementId
			this.elementName = options.elementName == undefined ? '' : options.elementName
			this.supplierName = options.supplierName == undefined ? '' : options.supplierName
			if (this.supplierId === '') {
				// 无供货商
				// 新建
				this.editSupplier = false
			} else {
				// 有供货商
				if (this.elementId === '') {
					// 无原料
					this.isSelectElement = true
					this.editSupplier = false
					uni.setNavigationBarTitle({
						title: '新建原料'
					})
					this.getElementList()
				} else {
					this.editSupplier = true
					// 有原料
					uni.setNavigationBarTitle({
						title: '原料编辑'
					})
					this.getElementInfo()
				}
			}
			this.getUnitList()
			let i = 1
			this.getBaseUnitList(1, i) // 获取基本单位列表
		},
		methods: {
			/* 获取原料供货商详情 */
			getElementInfo() {
				let that = this
				that.request({
					url: `${that.config.ingredientInfo}/${that.elementId}`
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.elementPrice = data.price
						that.elementNum = data.quantity
						that.elementUnit = data.unit
						that.elementUnitId = data.unitId
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除原料供货商 */
			deleteElementSupplier() {
				let that = this
				uni.showModal({
					content: '确定要删除该原料',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.ingredientInfo}/${that.elementId}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log(res)
								if (res.data.code == '200000') {
									that.storeId = res.data.data
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
			/* 保存修改 */
			saveSupplierInfo() {
				let that = this
				that.request({
					url: `${that.config.ingredientInfo}/${that.elementId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						price: that.elementPrice,
						quantity: that.elementNum,
						unitId: that.elementUnitId,
						name: that.elementName
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.storeId = res.data.data
						uni.showToast({
							title: '修改成功',
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
			/* 新增原料 */
			saveElement() {
				let that = this
				that.request({
					url: that.config.ingredientInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						name: that.elementName,
						supplierId: that.supplierId,
						price: that.elementPrice,
						quantity: that.elementNum,
						unitId: that.elementUnitId
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
			/* 选择供货商 */
			goSelectSupplier() {
				if (!this.editSupplier) {
					uni.navigateTo({
						url: '../supplier/list?selectState=true'
					})
				}
			},
			/* 切换单位选择 */
			changeUnit(item, index) {
				this.unitIdx = index
				this.unitType = item.value
				this.getUnitList()
			},
			openSelectUnit() {
				this.unitShow = true
				this.unitIdx = 0
				this.unitType = this.unitTypeList[0].value
				this.getUnitList()
				this.addUnitShow = false
			},
			closeSelectUnit() {
				this.unitShow = false
			},
			/* 选中单位 */
			selectUnit(item) {
				this.elementUnit = item.name
				this.elementUnitId = item.id
				this.unitShow = false
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
			addSelectUnit() {
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
			closeSelectAbstrUnit() {
				this.addSelectUnitShow = false
			},
			openSelectElement() {
				this.selectElementShow = true
				// this.getElementInfo()
			},
			closeSelectElement() {
				this.selectElementShow = false
			},
			/* 选择原料 */
			selectElement(item) {
				this.elementName = item.name
				this.selectElementShow = false
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
						convertedValue: that.addUnitNum
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
			getBaseUnitList(type, i) {
				let that = this
				if (i < 3) {
					that.request({
						url: that.config.unitsInfo,
						data: {
							storeId: that.storeId,
							type: type
						}
					}).then(res => {
						console.log(res)
						const data = res.data.data
						that.baseUnitList.push(...data)
						i++
						that.getBaseUnitList(2, i)
					})
				}
				console.log('基础单位列表', this.baseUnitList)
			},
			/* 获取原料列表 */
			getElementList() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId,
						supplierName: ''
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.elementList = data
				})
			},
			/* 删除抽象单位 */
			deleteUnit(item) {
				let that = this
				if (that.unitIdx == 2) {
					uni.showModal({
						content: '确定删除该单位',
						success: function (res) {
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
	.element-name {
		font-size: 40rpx;
		color: #999;
		padding: 40rpx 44rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.select-element-tip {
		font-size: 28rpx;
		color: #333;
	}

	.add-element {
		background-color: #fff;
		margin: 0 24rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
	}

	.add-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.add-box:last-child {
		border-bottom: 0;
	}

	.add-tip-box {
		display: flex;
		align-items: center;
		color: #62B279;
		font-size: 28rpx;
	}

	.add-tip-box image {
		width: 26rpx;
		height: 26rpx;
		display: block;
		margin-right: 6rpx;
	}

	.add-input {
		display: flex;
		align-items: center;
	}

	.add-box input {
		text-align: right;
	}

	.dollars {
		margin-left: 20rpx;
	}

	.add-unit {
		color: #999;
		margin-right: 20rpx;
	}

	.add-btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.unit-operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		margin: 0 24rpx;
		font-size: 28rpx;
		border-bottom: 2rpx solid #eee;
	}
	
	.unit-name-cont{
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

	.supplier-btn {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		right: 24rpx;
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

	.supplier-btn view.save-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}

	.abstrac-unit-operate {
		justify-content: center;
	}

	.unit-info {
		min-height: 300rpx;
	}

	.select-element {
		background-color: #F4F4F4;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
		padding: 0 0 0 44rpx;
	}

	.select-element-box {
		margin: 0 44rpx;
		font-size: 28rpx;
		color: #333;
	}

	.element-box {
		padding: 30rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.element-box:last-child {
		border-bottom: 0;
	}
</style>
