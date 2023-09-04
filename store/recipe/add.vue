<template>
	<view class="add-bake-box">
		<view class="make-name">
			<input type="text" placeholder="请输入配方名称" v-model="recipeName"
				placeholder-style="color: #999; line-height: 40rpx;">
		</view>
		<view class="bake-box">
			<view class="make-difficulty">
				<view>配方成本</view>
				<view class="computed-make-name">
					<text class="total-price">
						<block v-if="totalPrice == 0">自动计算</block>
						<block v-else>{{totalPrice * part}}</block>
					</text>元
				</view>
			</view>
			<view class="make-difficulty no-border">
				<view>份量</view>
				<view class="unit-box">
					<input type="text" placeholder="份量" :placeholderStyle="style" v-model="deal">
					<view>份</view>
				</view>
			</view>
		</view>
		<view class="bake-box">
			<view class="make-difficulty">
				<view class="ingredient-tip">原料</view>
				<view @click="addIngredient" class="add-element">+添加原料</view>
			</view>
			<view class="setout-bake-completed">
				<view class="element-box" v-for="(item, index) in selectElementList" :key="index">
					<view class="setout-bake element-name">
						<view>{{item.name}}</view>
						<view>{{item.elementQuantity * part}}{{item.elementUnit}}</view>
					</view>
					<view class="setout-bake">
						<view class="cost-box">
							<view>成本</view>
							<view v-if="!editState">({{item.costRatio}}%)</view>
						</view>
						<view>￥{{item.cost * part}}</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="save-btn" @click="addRecipe" v-if="recipeId === ''">保存</view>
		<view class="save-btn" @click="editRecipeInfo" v-else>保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				style: 'text-align: right; color: #ccc;font-size: 28rpx;',
				selectElementList: [],
				totalPrice: '0.00',
				deal: '',
				part: 1,
				recipeName: '',
				recipeId: '',
				storeId: '',
				recipeInfo: {},
				editState: true,
				reelementList: [],
				addState: false,
				detailAddState: false
			}
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.recipeId = options.recipeId == undefined ? '' : options.recipeId
			this.addState = options.addState == undefined ? false : options.recipeId
			this.selectElementList = options.selectElementList == undefined ? [] : JSON.parse(options.selectElementList)
		},
		onShow() {
			console.log('配方id', getApp().globalData.recipeId)
			if (getApp().globalData.recipeId !== '') {
				// 详情直接添加原料
				this.detailAddState = true
				this.recipeId = getApp().globalData.recipeId
			}
			if (this.recipeId !== '') {
				uni.setNavigationBarTitle({
					title: '配方编辑'
				})
				this.editState = false
				this.getRecipeInfo()
			}
			if (this.deal == 0 || this.deal === '') {
				this.part = 1
			}
		},
		watch: {
			/* 总成本 */
			selectElementList() {
				this.totalPrice = 0
				console.log('selectElementList', this.selectElementList)
				this.selectElementList.forEach(item => {
					this.totalPrice = (parseFloat(this.totalPrice) + parseFloat(item.cost)).toFixed(2)
				})
				console.log('recipeId', this.recipeId)
				console.log('总成本', this.totalPrice)
			},
			/* 份量 */
			deal() {
				if (this.deal == 0 || this.deal === '') {
					this.part = 1
				} else {
					this.part = this.deal
				}
			}
		},
		methods: {
			addIngredient() {
				uni.navigateTo({
					url: './ingredient?selectElementList=' + JSON.stringify(this.selectElementList)
				})
			},
			/* 新建配方 */
			addRecipe() {
				let that = this
				let ingredientItems = []
				this.selectElementList.forEach(item => {
					ingredientItems.push({
						ingredientId: item.id,
						ingredientQuantity: item.elementQuantity,
						unitId: item.elementUnitId
					})
				})
				that.request({
					url: that.config.formulaInfo,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.recipeName,
						quantity: that.deal,
						ingredientItems: ingredientItems,
						storeId: that.storeId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						that.storeId = res.data.data
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
			/* 获取配方详情 */
			getRecipeInfo() {
				let that = this
				that.request({
					url: `${that.config.formulaInfo}/${that.recipeId}`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.recipeInfo = data
					that.recipeName = data.name
					that.deal = data.quantity
					that.part = data.quantity
					data.ingredientItems.forEach(item => {
						item.elementQuantity = item.ingredientQuantity
						item.elementUnit = item.ingredientUnitName
						item.cost = item.ingredientCost
					})
					that.reelementList = JSON.parse(JSON.stringify(data.ingredientItems))
					if (!that.detailAddState) {
						that.totalPrice = data.formulaCost
						that.selectElementList = data.ingredientItems
					} else {
						that.editState = true
					}
				})
			},
			/* 修改配方详情 */
			editRecipeInfo() {
				let that = this
				let elementList = []
				that.selectElementList.forEach(item => {
					that.reelementList.forEach(value => {
						if (item.ingredientId == value.ingredientId) {
							// 新选择的原料列表中无原料id与原原料列表中原料id相同
							elementList.push({
								id: value.id,
								ingredientId: item.ingredientId,
								name: item.name,
								ingredientQuantity: item.elementQuantity,
								unitsId: value.ingredientUnit,
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
							name: that.reelementList[i].name,
							ingredientQuantity: that.reelementList[i].ingredientQuantity,
							unitsId: that.reelementList[i].ingredientUnit,
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
							name: that.selectElementList[i].name,
							ingredientQuantity: that.selectElementList[i].elementQuantity,
							unitsId: that.selectElementList[i].elementUnitId,
							detailFlag: 'added'
						})
					}
				}
				elementList.push(...addElementArr)
				console.log('elementList', elementList)

				that.request({
					url: `${that.config.formulaInfo}/${that.recipeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.recipeName,
						quantity: that.deal,
						ingredientItems: elementList
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
							// that.getRecipeInfo()
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
	}
</script>

<style scoped>
	.add-bake-box {
		margin: 0 20rpx;
		font-size: 28rpx;
	}

	.make-name {
		margin: 40rpx 20rpx;
		color: #999;
		font-size: 40rpx;
	}

	.make-name input {
		height: 40rpx;
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

	.total-price {
		margin-right: 20rpx;
		color: #999;
		font-size: 28rpx;
	}

	.bake-box {
		background-color: #fff;
		padding: 0 20rpx;
		border-radius: 10rpx;
		margin: 14rpx 0;
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

	.add-element {
		color: #62B279;
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
		line-height: 46rpx;
	}

	.no-border {
		border-bottom: 0;
	}

	.element-box {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.setout-bake-completed .element-box:last-child {
		border-bottom: 0;
	}

	.setout-bake {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
	}

	.cost-box {
		display: flex;
		align-items: center;
	}

	.element-name {
		color: #333;
		margin-bottom: 10rpx;
	}

	.unit-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.unit-box input {
		width: 100rpx;
		margin-right: 20rpx;
		text-align: right;
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
</style>
