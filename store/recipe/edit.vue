<template>
	<view>
		<view class="element-name">
			<input type="text" v-model="recipeInfo.name" placeholder="请输入配方名称" placeholder-style="color: #999; line-height: 40rpx;" />
		</view>
		<view class="recipe-detail">
			<view class="deal-box">
				<view>配方成本</view>
				<view>{{recipeInfo.formulaCost}}元</view>
			</view>
			<view class="deal-box">
				<view>份量</view>
				<view>
					<input type="text" v-model="recipeInfo.quantity" placeholder="请输入份量" placeholder-style="color: #ccc; font-size: 28rpx;" />
					份</view>
			</view>
		</view>
		<view class="recipe-detail">
			<view class="add-element-tip">
				<view class="ingredient-tip">原料</view>
				<view>+添加原料</view>
			</view>
			<view class="element-cont">
				<view class="element-box" v-for="(item, index) in recipeInfo.ingredientItems" :key="index">
					<view class="setout-bake recipe-name">
						<view>{{item.name}}</view>
						<view>{{item.ingredientQuantity}}{{item.ingredientUnits}}</view>
					</view>
					<view class="setout-bake">
						<view class="cost-box">
							<view>成本</view>
							<view>({{item.costRatio}}%)</view>
						</view>
						<view>￥{{item.ingredientCost}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="add-btn">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				operateShow: false,
				elementList: [],
				recipeId: '',
				recipeInfo: {},
				recipeName: '',
				renameRecipeShow: false
			}
		},
		onLoad(options) {
			this.recipeId = options.recipeId
			this.getRecipeInfo()
		},
		methods: {
			changeOperate() {
				this.operateShow = !this.operateShow
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
				})
			},
			openRenameRecipe() {
				this.renameRecipeShow = true
				this.operateShow = false
			},
			cancelRenameRecipe() {
				this.renameRecipeShow = false
			},
			/* 修改配方详情 */
			editRecipeInfo() {
				let that = this
				that.request({
					url: `${that.config.formulaInfo}/${that.recipeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.recipeName
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
							that.getRecipeInfo()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除配方 */
			deleteRecipe() {
				let that = this
				that.request({
					url: `${that.config.formulaInfo}/${that.recipeId}`,
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
	}
</script>

<style scoped>
	.element-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 0 40rpx 20rpx;
		margin: 0 24rpx;
		font-size: 40rpx;
		color: #999;
	}

	.unload-img {
		display: flex;
		align-items: center;
	}

	.operate-box {
		background-color: #fff;
		padding: 20rpx;
		position: absolute;
		right: 0;
		bottom: -80rpx;
	}

	.recipe-detail {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.element-box {
		padding: 20rpx 0;
		border-top: 1rpx solid #eee;
		font-size: 28rpx;
	}

	.deal-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		font-size: 28rpx;
		color: #333;
	}
	
	.add-element-tip{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #62B279;
		padding: 30rpx 0;
	}

	.ingredient-tip {
		color: #333;
	}

	.setout-bake {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
	}

	.recipe-name {
		color: #333;
		margin-bottom: 14rpx;
	}

	.cost-box {
		display: flex;
		align-items: center;
	}

	.add-btn {
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

	.add-tip {
		color: #999;
		text-align: center;
	}
</style>
