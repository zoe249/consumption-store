<template>
	<view>
		<view v-for="(item, index) in cookList" :key="index" class="cookbook-box" @click="goCookbookDetail(item)">
			<view>
				<view class="cook-name">{{item.name}}</view>
				<view class="cook-time">制作用时 {{item.productionTime}}分钟</view>
			</view>
			<view class="difficulty-img">
				<view v-for="(img, index) in item.difficulty" :key="index">
					<image :src="imgUrl + 'difficulty.png'" mode=""></image>
				</view>
				<view v-for="(img, index) in (5 - item.difficulty)" :key="index">
					<image :src="imgUrl + 'undifficulty.png'" mode=""></image>
				</view>
			</view>
		</view>
		<view style="height: 150rpx;"></view>
		<view class="add-btn" @click="goAddCookbook">新建食谱</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				storeId: '',
				completed: false,
				pageIndex: 1,
				pageSize: 10,
				cookList: []
			}
		},
		onLoad() {
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.pageIndex = 1
			this.completed = false
			this.cookList = []
			this.getCookList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getCookList()
			}
		},
		methods: {
			/* 获取食谱列表 */
			getCookList() {
				let that = this
				that.request({
					url: that.config.cookbookInfo,
					data: {
						storeId: that.storeId,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						that.cookList.push(...data)
					}
				})
			},
			/* 跳转新建食谱 */
			goAddCookbook() {
				uni.navigateTo({
					url: './add'
				})
			},
			/* 跳转食谱详情 */
			goCookbookDetail(item) {
				uni.navigateTo({
					url: './detail?cookbookId=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.cookbook-box {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.cook-name{
		color: #333;
		font-size: 32rpx;
		padding-bottom: 10rpx;
	}
	
	.cook-time{
		color: #999;
		font-size: 28rpx;
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
