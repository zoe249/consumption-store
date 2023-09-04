<template>
	<view>
		<u-tabs :list="navList" :current="navIdx" @click="changeSelectElement" :scrollable="false" lineColor="#F2AB99"
			activeStyle="color: #F2AB99;"></u-tabs>
		<view>
			<block v-if="navIdx == 0">
				<block v-for="(item, index) in elementList" :key="index">
					<view class="element-box" :class="item.select ? 'active-element' : ''" @click="selectElement(item)">
						<view class="element-name">{{item.name}}</view>
						<view class="select-goods" :class="item.select ? 'isSelect-goods' : ''">
							<block v-if="item.select">
								<image src="../../static/store/check.png" mode=""></image>
							</block>
						</view>
					</view>
				</block>
			</block>
			<block v-if="navIdx == 1">
				<block v-for="(item, index) in recipeList" :key="index">
					<view class="element-box" :class="recipeIdx == index ? 'active-element' : ''"
						@click="selectRecipe(item, index)">
						<view class="element-name">{{item.name}}</view>
						<view class="select-goods" :class="recipeIdx == index ? 'isSelect-goods' : ''">
							<block v-if="recipeIdx == index">
								<image src="../../static/store/check.png" mode=""></image>
							</block>
						</view>
					</view>
				</block>
			</block>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="add-btn">
			<view @click="goAddElement">新建原料</view>
			<view class="save-btn" @tap="$u.throttle(saveElement, 500)">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: '',
				pageIndex: 1,
				pageSize: 10,
				completed: false,
				elementList: [],
				elementId: '',
				selectElementList: [],
				navList: [{
					name: '原料'
				}, {
					name: '配方'
				}],
				navIdx: 0,
				recipeList: [],
				recipeElement: [],
				recipeIdx: -1,
				addState: false,
				recipeElementList: [],
				recipeId: '',
				arr: []
			}
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.selectElementList = JSON.parse(options.selectElementList) == undefined ? [] : JSON.parse(options
				.selectElementList)
			this.recipeId = options.recipeId == undefined ? '' : options.recipeId
			if (this.recipeId !== '') {
				// 获取配方原料
				this.getRecipeDetail()
			}
			if (this.selectElementList.length == 0) {
				// 新增原料
				this.addState = true
			} else {
				// 编辑原料
				this.addState = false
			}
			// this.recipeIdx = options.recipeIdx == undefined ? -1 : options.recipeIdx
			console.log('selectElementList', this.selectElementList)
		},
		onShow() {
			this.getElementList()
		},
		onReachBottom() {
			// 配方列表
			if (!this.completed && this.navIdx == 1) {
				this.pageIndex++
				this.getRecipeList()
			}
		},
		methods: {
			/* 获取原料列表 */
			getElementList() {
				let that = this
				that.request({
					url: that.config.supplierIngredient,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						data.forEach(item => {
							item.select = false
						})
						if (that.selectElementList.length != 0) {
							console.log('selectElementList', that.selectElementList)
							data.forEach(value => {
								that.selectElementList.forEach(item => {
									// if (value.id == item.ingredientId || value.id == item.id) {
									// 	value.select = true
									// }
									if (value.name == item.name) {
										value.select = true
									}
								})
							})
						}
						for (let i = 0; i < data.length; i++) {
							if (this.elementList.filter(e => e.name == data[i].name).length == 0) {
								this.elementList.push(data[i])
							}
						}
						// that.elementList.push(...data)
					}
				})
			},
			/* 选择原料 */
			selectElement(item) {
				item.select = !item.select
			},
			/* 保存原料 */
			saveElement() {
				// this.selectElementList = []
				let arr = []
				this.elementList.forEach(item => {
					item.quantity = ''
					item.unit = ''
					item.price = ''
					item.elementQuantity = ''
					item.elementUnit = ''
					item.ingredientId = item.id
					// 原料
					if (item.select) {
						arr.push(item)
					}
				})
				arr = arr.concat(this.recipeElementList)

				console.log('1111111111', arr)

				let elementArr = []
				arr.forEach((value, i) => {
					this.selectElementList.forEach(item => {
						// if (value.id == item.ingredientId && value.select) {
						if (value.name == item.name && value.select) {
							value.quantity = item.ingredientQuantity
							value.unit = item.ingredientUnitName
							value.price = item.elementUnit
							value.elementQuantity = item.elementQuantity
							value.elementUnit = item.elementUnit
							value.ingredientId = item.ingredientId
							value.cost = item.cost
							// elementArr.push(value)
							// arr.splice(i, 1)
						}
					})
				})

				console.log('arr', arr)
				// 查询新增的原料
				// for (let i = 0; i < arr.length; i++) {
				// 	if (this.selectElementList.filter(e => e.ingredientId == arr.id).length == 0) {
				// 		if (this.addState) {
				// 			elementArr = arr
				// 		} else {
				// 			elementArr.push(...arr)
				// 		}
				// 	}
				// }
				
				for (let i = 0; i < arr.length; i++) {
					if (this.arr.filter(e => e.name == arr[i].name).length == 0) {
						this.arr.push(arr[i])
					}
				}

				console.log('elementArr', elementArr)
				var pages = getCurrentPages()
				var prevPage = pages[pages.length - 2]
				prevPage.$vm.selectElementList = this.arr
				// if (this.navIdx == 1) {
					// 配方
					// prevPage.$vm.recipeIdx = this.recipeIdx
				// }
				uni.navigateBack()
			},
			/* 跳转新建原料 */
			goAddElement() {
				uni.navigateTo({
					url: '../element/edit'
				})
			},
			changeSelectElement(e) {
				console.log('切换导航', e)
				this.addState = true
				this.navIdx = e.index
				if (e.index == 0) {
					// 原料
					this.getElementList()
				} else {
					// 配方
					this.pageIndex = 1
					this.recipeList = []
					this.getRecipeList()
				}
			},
			/* 获取配方列表 */
			getRecipeList() {
				let that = this
				that.request({
					url: that.config.formulaInfo,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						data.forEach(item => {
							item.select = false
						})
						that.recipeList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* 选择配方 */
			selectRecipe(item, index) {
				this.recipeIdx = index
				this.recipeId = item.id
				this.recipeElementList = []
				this.getRecipeDetail()
			},
			/* 获取配方原料 */
			getRecipeDetail() {
				let that = this
				that.request({
					url: `${that.config.formulaInfo}/${that.recipeId}`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					data.ingredientItems.forEach(item => {
						item.select = true
						item.quantity = ''
						item.unit = ''
						item.price = ''
						item.elementQuantity = ''
						item.elementUnit = ''
						let _ingredientId = item.ingredientId
						item.ingredientId = item.id
						item.id = _ingredientId
					})
					that.recipeElementList = data.ingredientItems
					console.log('配方原料', that.recipeElementList)
				})
			}
		}
	}
</script>

<style scoped>
	.element-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
	}

	.element-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		color: #333;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1rpx solid #fff;
	}

	.element-box.active-element {
		border: 1rpx solid #F2AB99;
	}

	.select-goods {
		background-color: #fff;
		border: 2rpx solid #333;
		border-radius: 4rpx;
		width: 24rpx;
		height: 24rpx;
		text-align: center;
	}

	.select-goods image {
		width: 18rpx;
		height: 12rpx;
	}

	.isSelect-goods {
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-btn {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		font-size: 28rpx;
		padding: 24rpx 40rpx;
		background-color: #F8F8F8;
	}

	.add-btn view {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #F2AB99;
		border-radius: 50rpx;
		border: 2rpx solid #F2AB99;
		background-color: #fff;
	}

	.add-btn view.save-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
</style>
