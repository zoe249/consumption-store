<template>
	<view>
		<view class="element-name-box">
			<view class="element-name">{{elementName}}</view>
			<view>明细</view>
		</view>
		<view class="stock-info">
			<view v-for="(item, index) in stockElementInfo" :key="index" class="stock-box"
				@click="getStockDetail(item)">
				<view class="stock-detail">
					<view><text class="element-num">{{item.ingredientQuantity}}</text>{{item.ingredientUnitName}}</view>
					<view class="stock-time">{{item.dayTime}}</view>
				</view>
				<view class="stock-detail">
					<view>{{item.stockPlaceName}}</view>
					<view class="stock-time">{{item.dateTime}}</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @click="openAddStockShow">新存货</view>

		<!-- 新存货 -->
		<u-popup :show="addStockShow" @close="closeAddStockShow" :round="10">
			<view>
				<view class="add-stock-title">
					<view>新存货</view>
					<view>{{elementName}}</view>
				</view>
				<view class="add-stock-box">
					<view class="add-box" @click="getStockPointList">
						<view>位置</view>
						<view class="add-input">
							<block v-if="stockPoint === ''">请选择</block>
							<block v-else>{{stockPoint}}</block>
						</view>
					</view>
					<view class="add-box" @click="openTimeShow">
						<view>时间</view>
						<view>
							<block v-if="stockTime === ''">年/月/日</block>
							<block v-else>{{stockTime}}</block>
						</view>
					</view>
					<view class="add-box">
						<view>数量</view>
						<input type="number" placeholder="请输入存货数量" v-model="stockNum" />
					</view>
					<view class="add-box">
						<view>单位</view>
						<view class="add-input" @click="openSelectUnit">
							<block v-if="elementUnit === ''">请选择单位</block>
							<block v-else>{{elementUnit}}</block>
						</view>
					</view>
				</view>
				<block v-if="stockId === ''">
					<view class="save-btn" @click="addStockInfo">保存</view>
				</block>
				<block v-if="stockId !== ''">
					<view class="supplier-btn">
						<view @click="deleteStockInfo">删除记录</view>
						<view class="save-edit" @click="editStockInfo">保存</view>
					</view>
				</block>
			</view>
		</u-popup>

		<!-- 位置选择 -->
		<u-picker :show="stockPointShow" :columns="stockPointList" keyName="name" @confirm="confirmSelectStockPoint">
		</u-picker>

		<!-- 选择时间 -->
		<u-datetime-picker :show="stockTimeShow" :minDate="0" v-model="timeValue" mode="date"
			:closeOnClickOverlay="true" @confirm="confirmTime" @cancel="cancleTimeShow" @close="cancleTimeShow">
		</u-datetime-picker>

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
							<view class="add-input" @click="openSelectAbstrUnit">
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
				<view>
					<view class="unit-operate" v-for="(item, idx) in unitList" :key="idx"
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
	</view>
</template>

<script>
	import date from '@/common/js/date.js'
	export default {
		data() {
			return {
				elementName: '',
				elementId: '',
				stockElementInfo: [],
				addStockShow: false,
				stockPoint: '',
				stockPointId: '',
				stockTime: '',
				stockNum: '',
				units: '',
				addSelectUnitShow: false,
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
				unitShow: false,
				addUnitShow: false,
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
				addSelectAbstractUnitShow: false,
				units: '',
				addElementUnit: '',
				abstractList: [],
				addUnitName: '',
				addUnitNum: '',
				storeId: '',
				stockPointShow: false,
				stockPointList: [
					[]
				],
				stockTimeShow: false,
				timeValue: 0,
				timeDate: '',
				timeDateValue: '',
				stockId: '',
				baseUnitList: [],
				elementUnit: '',
				elementUnitId: ''
			}
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.list = this.weightUnitList
			this.abstractList = this.weightUnitList
			this.elementName = options.elementName == undefined ? '' : options.elementName
			this.elementId = options.elementId == undefined ? '' : options.elementId
			let time = new Date()
			this.timeValue = time.getTime()
			this.stockTime = date.parseTime(this.timeValue, "{y}-{m}-{d}")
			this.timeDateValue = date.parseTime(this.timeValue, "{y}-{m}-{d} {h}:{i}:{s}")
			this.getStockDetailList()
			this.unitType = this.unitTypeList[0].value
			this.getUnitList()
			let i = 1
			this.getBaseUnitList(1, i) // 获取基本单位列表
		},
		methods: {
			/* 获取存货记录列表 */
			getStockDetailList() {
				let that = this
				that.request({
					url: `${that.config.stockElement}/${that.elementId}/stockList`,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					data.forEach(item => {
						item.dayTime =
							`${item.stockTime.slice(0, 4)}年${item.stockTime.slice(5, 7)}月${item.stockTime.slice(8, 10)}日`
						item.dateTime = item.stockTime.slice(11, 19)
					})
					that.stockElementInfo = data
				})
			},
			/* 新存货 */
			openAddStockShow() {
				this.stockId = ''
				this.stockPoint = ''
				this.stockTime = date.parseTime(this.timeValue, "{y}-{m}-{d}")
				this.stockNum = ''
				this.units = ''
				this.addStockShow = true
			},
			closeAddStockShow() {
				this.addStockShow = false
			},
			/* 单位选择 */
			openSelectUnit() {
				this.addStockShow = false
				this.unitShow = true
				this.unitIdx = 0
				this.unitType = this.unitTypeList[0].value
				this.getUnitList()
			},
			closeSelectUnit() {
				this.unitShow = false
				this.addStockShow = true
			},
			/* 切换单位选择 */
			changeUnit(item, index) {
				this.unitIdx = index
				this.unitType = item.value
				this.getUnitList()
			},
			/* 选中单位 */
			selectUnit(item) {
				this.elementUnit = item.name
				this.elementUnitId = item.id
				this.unitShow = false
				this.addStockShow = true
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
			openSelectAbstrUnit() {
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
			/* 获取存货点列表 */
			getStockPointList() {
				let that = this
				that.request({
					url: that.config.stockPointInfo,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.stockPointList[0] = data
					that.addStockShow = false
					that.stockPointShow = true
				})
			},
			/* 选择位置 */
			closeSelectStockPoint() {
				this.stockPointShow = false
				this.addStockShow = true
			},
			confirmSelectStockPoint(e) {
				console.log('选中位置', e)
				this.stockPoint = e.value[0].name
				this.stockPointId = e.value[0].id
				this.stockPointShow = false
				this.addStockShow = true
			},
			/* 选择时间 */
			openTimeShow() {
				this.addStockShow = false
				this.stockTimeShow = true
			},
			cancleTimeShow() {
				this.stockTimeShow = false
				this.addStockShow = true
			},
			confirmTime(e) {
				console.log('选择时间', e)
				this.timeValue = e.value
				this.stockTime = date.parseTime(e.value, "{y}-{m}-{d}")
				let time = new Date()
				let hour
				let minutes
				let second
				if (time.getHours() < 10) {
					hour = '0' + time.getHours()
				} else {
					hour = time.getHours()
				}
				if (time.getMinutes() < 10) {
					minutes = '0' + time.getMinutes()
				} else {
					minutes = time.getMinutes()
				}
				if (time.getSeconds() < 10) {
					second = '0' + time.getSeconds()
				} else {
					second = time.getSeconds()
				}
				this.timeDateValue = `${this.stockTime} ${hour}:${minutes}:${second}`
				console.log('时间', this.timeDateValue)
				this.stockTimeShow = false
				this.addStockShow = true
			},
			/* 新增存货 */
			addStockInfo() {
				let that = this
				that.request({
					url: that.config.stockElement,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						stockPlaceId: that.stockPointId,
						ingredientId: that.elementId,
						stockTime: that.timeDateValue,
						ingredientQuantity: that.stockNum,
						ingredientUnit: that.elementUnitId,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.addStockShow = false
							that.getStockDetailList()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 存货记录详情 */
			getStockDetail(item) {
				let that = this
				that.request({
					url: `${that.config.stockElement}/${item.id}`
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.stockId = data.id
						that.stockPointId = data.stockPlaceId
						that.stockPoint = data.stockPlaceName
						let stockTime = new Date(data.stockTime).getTime() // 中国标准时间转换时间戳
						that.stockTime = date.parseTime(stockTime, "{y}-{m}-{d}") // 时间戳转换时间格式
						that.timeDateValue = date.parseTime(stockTime, "{y}-{m}-{d} {h}:{i}:{s}") // 时间戳转换时间格式
						that.stockNum = data.ingredientQuantity
						that.elementUnit = data.ingredientUnitName
						that.elementUnitId = data.ingredientUnit
						that.addStockShow = true
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除存货 */
			deleteStockInfo() {
				let that = this
				uni.showModal({
					content: '确定要删除该存货记录',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.stockElement}/${that.stockId}`,
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
										that.addStockShow = false
										that.getStockDetailList()
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
			/* 修改存货 */
			editStockInfo() {
				let that = this
				that.request({
					url: `${that.config.stockElement}/${that.stockId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						stockPlaceId: that.stockPointId,
						stockTime: that.timeDateValue,
						ingredientQuantity: that.stockNum,
						ingredientUnit: that.elementUnitId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.addStockShow = false
							that.getStockDetailList()
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
	.element-name-box {
		margin: 30rpx 44rpx;
		color: #999;
		font-size: 28rpx;
	}

	.element-name {
		color: #333;
		font-size: 40rpx;
		margin-bottom: 30rpx;
	}

	.stock-info {
		margin: 0 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.stock-box {
		padding: 26rpx 0 16rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
	}
	
	.stock-box:last-child{
		border-bottom: 0;
	}

	.stock-detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 10rpx;
	}

	.stock-time {
		color: #999;
	}

	.element-num {
		color: #62B279;
		font-size: 40rpx;
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
	
	.save-btn {
		margin: 20rpx 24rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.add-stock-title {
		text-align: center;
		padding: 20rpx 0;
		color: #333;
		font-size: 32rpx;
	}

	.add-stock-box {
		padding: 0 20rpx;
	}

	.add-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.add-box input {
		text-align: right;
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

	.unit-operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 24rpx;
		font-size: 28rpx;
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

	.abstrac-unit-operate {
		justify-content: center;
	}

	.matrixing-box {
		display: flex;
		align-items: center;
	}

	.abstract-unit-operate {
		display: flex;
		justify-content: center;
		padding: 20rpx 24rpx;
		font-size: 28rpx;
	}

	.abstract-unit-cont {
		display: flex;
		justify-content: center;
	}

	.supplier-btn {
		display: flex;
		align-items: center;
		margin: 40rpx 24rpx;
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

	.supplier-btn view.save-edit {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
</style>
