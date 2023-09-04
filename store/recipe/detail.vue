<template>
	<view>
		<view class="element-operate">
			<view class="element-name">
				<view>{{recipeInfo.name}}</view>
				<view class="unload-img">
					<view @click="chooseImg" class="upload-img">
						<view class="default-img" v-if="goodsPath === ''"></view>
						<block v-else>
							<image :src="goodsPath"></image>
						</block>
					</view>
					<view @click="changeOperate">
						<u-icon name="more-dot-fill" color="#F2AB99" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="recipe-detail">
			<view class="deal-box">
				<view>配方成本</view>
				<view>
					<text class="price-num">{{recipeInfo.formulaCost}}</text>
					元</view>
			</view>
			<view class="deal-box no-border">
				<view>份量</view>
				<view>
					<text class="price-num">{{recipeInfo.quantity}}</text>
					份</view>
			</view>
		</view>
		<view class="recipe-detail">
			<view class="ingredient-tip">原料</view>
			<view class="element-cont">
				<view class="element-box" v-for="(item, index) in selectElementList" :key="index">
						<view class="setout-bake recipe-name">
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
				<!-- <view class="element-box" v-for="(item, index) in recipeInfo.ingredientItems" :key="index">
					<view class="setout-bake recipe-name">
						<view>{{item.name}}</view>
						<view>{{item.ingredientQuantity}}{{item.ingredientUnitName}}</view>
					</view>
					<view class="setout-bake">
						<view class="cost-box">
							<view>成本</view>
							<view>({{item.costRatio}}%)</view>
						</view>
						<view>￥{{item.ingredientCost}}</view>
					</view>
				</view> -->
			</view>
		</view>

		<view style="height: 160rpx;"></view>
		<view class="add-btn" @click="addIngredient">添加原料</view>

		<!-- 重命名 -->
		<u-modal :show="renameRecipeShow" @confirm="editRecipeInfo" @cancel="cancelRenameRecipe" :showCancelButton="true"
		 confirmColor="#F2AB99" title="重命名">
			<view class="add-tip">
				<input type="text" v-model="recipeName" placeholder="名称" placeholderStyle="text-align: center; color: #ccc; line-height: 60rpx;" />
			</view>
		</u-modal>
		
		<u-overlay :show="operateShow" @click="changeOperate" opacity="rgba(0, 0, 0, 0)">
			<view class="operate-box">
				<view @click="goEditRecipe" class="operate-name">编辑</view>
				<view @click="openRenameRecipe" class="operate-name">重命名</view>
				<view @click="deleteRecipe" class="operate-name">删除</view>
			</view>
		</u-overlay>
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
				renameRecipeShow: false,
				qiniuToken: '',
				cardPicture: '',
				goodsPath: '',
				selectElementList: [],
				reelementList: [],
				deal: '',
				part: 1
			}
		},
		onLoad(options) {
			this.recipeId = options.recipeId
			this.getQiniuToken()
		},
		onShow() {
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
					if (data.photo != null) {
						uni.getImageInfo({
							src: data.photo,
							success: (image) => {
								console.log(image)
								that.goodsPath = image.path
							},
							fail: (err) => {
								uni.hideLoading()
							}
						})
					}
					that.deal = data.quantity
					that.part = data.quantity
					data.ingredientItems.forEach(item => {
						item.elementQuantity = item.ingredientQuantity
						item.elementUnit = item.ingredientUnitName
						item.cost = item.ingredientCost
					})
					that.selectElementList = data.ingredientItems
					that.reelementList = JSON.parse(JSON.stringify(data.ingredientItems))
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
				let ingredientItems = []
				this.reelementList.forEach(value => {
					ingredientItems.push({
						id: value.id,
						ingredientId: value.ingredientId,
						ingredientQuantity: value.ingredientQuantity,
						unitsId: value.ingredientUnit,
						detailFlag: 'modified'
					})
				})
				
				that.request({
					url: `${that.config.formulaInfo}/${that.recipeId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						name: that.recipeName,
						photo: that.cardPicture,
						quantity: that.part,
						ingredientItems: ingredientItems
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
			/* 配方编辑 */
			goEditRecipe() {
				uni.navigateTo({
					url: './add?recipeId=' + this.recipeId
				})
				this.operateShow = false
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
			chooseImg() {
				let that = this
				uni.chooseImage({
					count: 1,
					success: (rst) => {
						that.goodsPath = rst.tempFilePaths[0]
						that.uploadFilePromise()
					}
				})
			},
			/* 上传图片 */
			uploadFilePromise() {
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
				console.log('上传七牛云地址', that.goodsPath)
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: that.goodsPath,
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
							that.cardPicture = 'https://qiaokun.yuepong.com/' + data.key
							that.editRecipeInfo()
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
				})
			},
			/* 跳转新建原料 */
			addIngredient() {
				getApp().globalData.recipeId = this.recipeId
				uni.navigateTo({
					url: './ingredient?selectElementList=' + JSON.stringify(this.selectElementList) + '&detailState=true'
				})
			}
		}
	}
</script>

<style scoped>
	.element-operate {
		position: relative;
		margin: 40rpx;
	}

	.element-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 40rpx;
		color: #999;
	}

	.unload-img {
		display: flex;
		align-items: center;
	}

	.upload-img {
		width: 72rpx;
		height: 72rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
		overflow: hidden;
	}

	.default-img {
		width: 72rpx;
		height: 72rpx;
		background-color: #959595;
	}

	.upload-img image {
		width: 72rpx;
		height: 72rpx;
		display: block;
		border-radius: 10rpx;
	}

	.operate-box {
		background-color: #fff;
		position: absolute;
		right: 0;
		top: 80rpx;
		width: 120rpx;
		text-align: center;
		color: #333;
		font-size: 28rpx;
		border-radius: 10rpx;
		padding: 0 40rpx;
		box-shadow: 10rpx 10rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.operate-name{
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}
	
	.operate-name:last-child{
		border-bottom: 0;
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
		border-bottom: 1rpx solid #eee;
	}

	.no-border {
		border-bottom: 0;
	}

	.price-num {
		color: #999;
		margin-right: 20rpx;
	}

	.ingredient-tip {
		padding: 30rpx 0;
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
		background-color: #F4F4F4;
		padding-left: 20rpx;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
	
	.add-tip input{
		height: 60rpx;
		line-height: 60rpx;
	}
</style>
