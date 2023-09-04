<template>
	<view>
		<view class="recipe-cont">
			<view class="recipe-title">
				<view>配方名称</view>
				<view>成本</view>
			</view>
			<view v-for="(item, index) in recipeList" :key="index" class="recipe-box" @click="goRecipeDetail(item)">
				<view class="recipe-name">
					<view>{{item.name}}</view>
					<view>({{item.quantity}}份)</view>
				</view>
				<view>￥{{item.formulaCost}}</view>
			</view>
		</view>
		<view style="height: 150rpx;"></view>
		<view class="add-btn" @click="goAddRecipe">新建配方</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recipeList: [],
				completed: false,
				pageIndex: 1,
				pageSize: 10,
				storeId: ''
			}
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getRecipeList()
			}
		},
		onLoad() {
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.recipeList = []
			this.getRecipeList()
		},
		methods: {
			/* 获取配方列表 */
			getRecipeList() {
				let that = this
				that.request({
					url: that.config.formulaInfo,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize:  that.pageSize
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length != 0) {
						that.recipeList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* 跳转新建配方 */
			goAddRecipe() {
				uni.navigateTo({
					url: './add?addState=true'
				})
			},
			/* 配方详情 */
			goRecipeDetail(item) {
				uni.navigateTo({
					url: './detail?recipeId=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.recipe-cont {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
	}

	.recipe-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.recipe-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #eee;
		padding: 20rpx 0;
	}

	.recipe-name {
		display: flex;
		align-items: center;
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
</style>
