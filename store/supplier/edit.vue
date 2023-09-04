<template>
	<view>
		<view class="add-element">
			<view class="element-name">
				<input type="text" placeholder="请输入原料名称" v-model="elementName">
				<view @click="openSelectElement" v-if="isSelectElement">原料选择</view>
			</view>
			<view class="add-box">
				<view>供货商</view>
				<view @click="goSelectSupplier">
					<block v-if="supplierName === ''">添加</block>
					<block v-else>{{supplierName}}</block>
				</view>
			</view>
			<view class="add-box">
				<view>价格</view>
				<view class="add-input">
					<input type="digit" placeholder="请输入原料价格" v-model="elementPrice" :placeholderStyle="style">
					<view>元</view>
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
					<view>
						<block v-if="elementUnit === ''">请选择单位</block>
						<block v-else>{{elementUnit}}</block>
					</view>
					<view>选择</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @click="saveElement" v-if="!editSupplier">保存</view>
		<view class="supplier-btn" v-if="editSupplier">
			<view @click="deleteElementSupplier">删除原料</view>
			<view class="save-btn" @click="saveSupplierInfo">保存</view>
		</view>

		<!-- 单位 -->
		<u-popup :show="unitShow" @close="closeSelectUnit" :closeOnClickOverlay="true">
			<view>
				<block v-if="!addUnitShow">
					<view class="unit-operate">
						<view @click="closeSelectUnit">取消</view>
						<view class="unit-cont">
							<view v-for="(unit, index) in unitTypeList" :key="index" class="unit-box"
								:class="unitIdx == index ? 'active-unit' : ''" @click="changeUnit(unit, index)">{{unit.name}}
							</view>
						</view>
						<view @click="openAddUnit">
							<u-icon name="plus" :color="unitIdx == 2 ? '#F2AB99' : '#999'" size="20"></u-icon>
						</view>
					</view>
					<view>
						<view class="unit-operate" v-for="(item, idx) in unitList" :key="idx" @click="selectUnit(item)">
							<view>{{item.name}}</view>
							<view class="matrixing-box">
								<view>{{item.matrixingValue}}</view>
								<view>{{item.matrixing}}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-if="addUnitShow">
					<view class="unit-operate">
						<view @click="closeAddUnit">取消</view>
						<view>抽象单位</view>
						<view>完成</view>
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
								<view>
									<block v-if="addElementUnit === ''">请选择单位</block>
									<block v-else>{{addElementUnit}}</block>
								</view>
								<view>选择</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</u-popup>

		<!-- 添加抽象单位选择 -->
		<u-popup :show="addSelectUnitShow" @close="closeSelectUnit" :closeOnClickOverlay="true">
			<view>
				<view class="unit-cont">
					<view v-for="(unit, index) in unitTypeList" :key="index" class="unit-box"
						:class="unitIdx == index ? 'active-unit' : ''" @click="changeUnit(unit, index)">{{unit.name}}
					</view>
				</view>
				<view>
					<view class="unit-operate" v-for="(item, idx) in unitList" :key="idx" @click="selectUnit(item)">
						<view>{{item.name}}</view>
						<view class="matrixing-box">
							<view>{{item.matrixingValue}}</view>
							<view>{{item.matrixing}}</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 原料选择 -->
		<u-popup :show="selectElementShow" @close="closeSelectElement" :closeOnClickOverlay="true" :closeable="true">
			<view>
				<view>原料选择</view>
				<view>
					<view v-for="(item, index) in elementList" :key="index" class="element-box" @click="selectElement(item)">{{item.name}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				style: 'text-align: right; color: #ccc; font-size: 28rpx;',
				elementName: '',
				supplierName: '新西兰供货商',
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
				// weightUnitList: [{
				// 	name: 'kg',
				// 	matrixingValue: '1000',
				// 	matrixing: 'g'
				// }, {
				// 	name: 'g',
				// 	matrixingValue: '1',
				// 	matrixing: 'g'
				// }, {
				// 	name: 'mg',
				// 	matrixingValue: '0.001',
				// 	matrixing: 'g'
				// }],
				// volumeUnitList: [{
				// 	name: 'L',
				// 	matrixingValue: '1000',
				// 	matrixing: 'ml'
				// }, {
				// 	name: 'dL',
				// 	matrixingValue: '100',
				// 	matrixing: 'ml'
				// }, {
				// 	name: 'mL',
				// 	matrixingValue: '1',
				// 	matrixing: 'ml'
				// }],
				unitIdx: 0,
				// abstractionUnitList: [{
				// 	name: '个',
				// 	matrixingValue: '100',
				// 	matrixing: 'g'
				// }, {
				// 	name: '袋',
				// 	matrixingValue: '100',
				// 	matrixing: 'ml'
				// }],
				// list: [],
				addUnitShow: false,
				addUnitName: '',
				addUnitNum: '',
				addElementUnit: '',
				addSelectUnitShow: false,
				selectElementShow: false,
				elementList: [{
					name: 'xxx面粉',
					price: '200',
					spec: '25kg'
				}, {
					name: '新西兰黄油',
					price: '100',
					spec: '1kg'
				}, {
					name: '韩国砂糖',
					price: '100',
					spec: '5kg'
				}, {
					name: '法国橄榄油',
					price: '500',
					spec: '5L'
				}],
				editSupplier: false,
				elementId: '',
				elementInfo: {},
				isSelectElement: false
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
				} else {
					this.editSupplier = true
					// 有原料
					uni.setNavigationBarTitle({
						title: '原料编辑'
					})
				}
				// this.getElementInfo()
			}
			// this.getUnitList()
		},
		methods: {
			/* 获取原料供货商详情 */
			getElementInfo() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId,
						name: that.elementName,
						supplierName: that.supplierName
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						const data = res.data.data
						if (that.elementId === '') {
							// 新建原料
							that.elementList = data
						} else {
							that.elementPrice = data.price
							that.elementNum = data.quantity
							that.elementUnit = data.unit
							that.elementUnitId = data.unitId
						}
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
				that.request({
					url: `${that.config.ingredientInfo}/${that.supplierId}`,
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
			},
			/* 保存修改 */
			saveSupplierInfo() {
				let that = this
				that.request({
					url: `${that.config.ingredientInfo}/${that.supplierId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						price: that.elementPrice,
						quantity: that.elementNum,
						unit: that.elementUnit
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
				// if (index == 0) {
				// 	// 重量
				// 	this.list = this.weightUnitList
				// } else if (index == 1) {
				// 	// 容积
				// 	this.list = this.volumeUnitList
				// } else if (index == 2) {
				// 	// 抽象单位
				// 	this.list = this.abstractionUnitList
				// 	// this.getAbstractionUnit()
				// }
			},
			openSelectUnit() {
				this.unitShow = true
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
				this.addSelectUnitShow = true
			},
			// closeSelectUnit() {
			// 	this.addSelectUnitShow = false
			// },
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
			}
		}
	}
</script>

<style scoped>
	.add-element {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 0 20rpx;
	}

	.element-name {
		font-size: 30rpx;
		color: #999;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	.add-btn {
		margin: 100rpx 24rpx 0;
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
		padding: 20rpx 24rpx;
		font-size: 28rpx;
	}

	.matrixing-box {
		display: flex;
		align-items: center;
	}

	.unit-cont {
		display: flex;
		align-items: center;
		border: 2rpx solid #F2AB99;
		border-right: 0;
	}

	.unit-box {
		border-right: 2rpx solid #F2AB99;
		padding: 0 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #F2AB99;
		text-align: center;
	}

	.active-unit {
		background-color: #F2AB99;
		color: #fff;
	}

	.add-unit-box {
		padding: 0 20rpx;
	}
	
	.supplier-btn{
		display: flex;
		align-items: center;
		margin: 40rpx 24rpx;
		font-size: 28rpx;
	}
	
	.supplier-btn view{
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #F2AB99;
		border-radius: 50rpx;
		border: 2rpx solid #F2AB99;
	}
	
	.supplier-btn view.save-btn{
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
</style>
