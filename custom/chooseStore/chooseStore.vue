<template>
	<view>
		<view class="filter-cont">
			<view v-for="(item, index) in filterList" :key="index" class="filter-box"
				:class="item.select ? 'selected-filter' : ''" @click="selectFilter(item)">{{item.name}}</view>
		</view>
		<view>
			<block v-for="(item,index) in chooseStoreList" :key="index">
				<view class="store-box" :class="item.select ? 'active-store' : ''">
					<u-swipe-action>
						<u-swipe-action-item :options="funcArr" @click.stop="cancleAttentionStore" :name="index">
							<view class="store-cont" @click.stop="manageStore(item.id)">
								<view class="store-img-box">
									<view class="store-img">
										<image :src="item.logo ? item.logo : defaultHead"></image>
									</view>
									<view class="store-name">{{item.name}}</view>
									<view class="store-state open-state" v-if="item.businessState">营业中</view>
									<view class="store-state close-state" v-if="!item.businessState">休息中</view>
									<view class="store-state" v-if="item.functionState == '1'">可配送</view>
								</view>
								<view class="address-box">
									<image src="../../static/custome/localIcon.png" mode="widthFix"></image>
									<view v-if="item.distance < 1">{{item.distance * 1000}}m</view>
									<view v-else>{{item.distance}}km</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
			</block>
		</view>
		<view>
			<view class="cancle-store-box">
				<view>取关店铺（{{cancleStoreList.length}}）</view>
				<view @click="showCancleStore" class="upload-store">
					<block v-if="!cancleStoreState">展开</block>
					<block v-else>收起</block>
				</view>
			</view>
			<view v-if="cancleStoreState">
				<block v-for="(item,index) in cancleStoreList" :key="index">
					<view class="cancle-store">
						<view class="cancle-store-cont">
							<view class="store-img-box">
								<view class="store-img">
									<image :src="item.logo ? item.logo : defaultHead"></image>
								</view>
								<view class="store-name">{{item.name}}</view>
								<view class="store-state open-state" v-if="item.businessState">营业中</view>
								<view class="store-state close-state" v-if="!item.businessState">休息中</view>
								<view class="store-state" v-if="item.functionState == '1'">可配送</view>
							</view>
							<view class="address-box">
								<image src="../../static/custome/localIcon.png" mode="widthFix"></image>
								<view v-if="item.distance < 1">{{item.distance * 1000}}m</view>
								<view v-else>{{item.distance}}km</view>
							</view>
						</view>
						<view @click="attentionStore(item)" class="attention-store">恢复关注</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chooseStoreList: [], // 选择门店列表数据
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				storeId: '', // 门店id
				userInfo: {},
				filterList: [{
					value: 1,
					name: '营业中',
					select: false
				}, {
					value: 2,
					name: '离我最近',
					select: false
				}],
				businessState: false, // 是否营业中
				longitude: '',
				latitude: '',
				_longitude: '',
				_latitude: '',
				funcArr: [{
					text: '取消关注',
					style: {
						backgroundColor: '#ff4545',
					}
				}],
				cancleStoreState: false,
				cancleStoreList: []
			}
		},
		onShow() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
			this.userInfo = uni.getStorageSync('userInfo')
			this.getAtteStoreList()
			this.getCancleAtteStore()
			let that = this
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that._longitude = res.longitude
					that._latitude = res.latitude
				}
			})
		},
		methods: {
			/* 获取关注门店列表 */
			getAtteStoreList() {
				let that = this
				that.request({
					url: `${that.config.customeStoreList}/${that.userInfo.openId}?businessState=${that.businessState}&customerLongitude=${that.longitude}&customerLatitude=${that.latitude}`
				}).then((res) => {
					console.log(res)
					res.data.data.forEach(item => {
						item.select = false
						if (that.storeId == item.id) {
							item.select = true
						}
					})
					that.chooseStoreList = res.data.data
				})
			},
			// 选择注册门店
			// chooseStore(storeId) {
			// 	console.log(storeId)
			// 	let that = this
			// 	that.request({
			// 		url: `${that.config.storecustomers}/${that.userInfo.openId}:visit/${storeId}`,
			// 		header: {
			// 			'Content-Type': 'application/json',
			// 			'Transaction-No': new Date().getTime()
			// 		},
			// 		method: 'POST',
			// 	}).then((res) => {
			// 		console.log(res)
			// 		if (res.data.code === '200000') {
			// 			that.manageStore(storeId)
			// 		} else {
			// 			uni.showToast({
			// 				title: res.data.detail,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// },
			/* 切换店铺 */
			manageStore(id) {
				let that = this
				that.request({
					url: `${that.config.stores}/${id}`
				}).then(res => {
					console.log('店铺信息', res)
					let storeInfo = res.data.data
					// uni.setStorageSync('storeInfo', storeInfo)
					let storeId = storeInfo.id
					var pages = getCurrentPages()
					var prevPage = pages[pages.length - 2]
					prevPage.$vm.storeId = storeId
					prevPage.$vm.navIdx = 0
					uni.navigateBack()
				})
			},
			/* 选择筛选条件 */
			selectFilter(item) {
				item.select = !item.select
				// 营业中
				if (this.filterList[0].select) {
					this.businessState = true
				} else {
					this.businessState = false
				}
				// 离我最近
				if (this.filterList[1].select) {
					this.longitude = this._longitude
					this.latitude = this._latitude
				} else {
					this.longitude = ''
					this.latitude = ''
				}
				this.getAtteStoreList()
			},
			showCancleStore() {
				this.cancleStoreState = !this.cancleStoreState
			},
			/* 取消店铺关注 */
			cancleAttentionStore(e) {
				let item = this.chooseStoreList[e.name]
				let that = this
				uni.showModal({
					content: '确定要取消关注吗',
					success: function (res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.cancleAttention}/${item.id}/collection`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								}
							}).then(res => {
								console.log('取消关注', res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '取消成功',
										icon: 'none'
									})
									setTimeout(() => {
										// that.getAtteStoreList()
										// that.getCancleAtteStore()
										uni.redirectTo({
											url: '../chooseStore/chooseStore'
										})
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
			/* 关注店铺 */
			attentionStore(item) {
				let that = this
				that.request({
					url: `${that.config.attentionStore}/${item.id}/collection`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log('关注', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '关注成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.getAtteStoreList()
							that.getCancleAtteStore()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取取消关注店铺列表 */
			getCancleAtteStore() {
				let that = this
				that.request({
					url: that.config.cancleAttentionStore
				}).then(res => {
					console.log('取消关注店铺列表', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.cancleStoreList = data
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
	.filter-cont {
		display: flex;
		align-items: center;
		margin: 10rpx 24rpx 14rpx;
	}

	.filter-box {
		width: 344rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		background-color: #fff;
		text-align: center;
		color: #666;
		font-size: 28rpx;
		margin-right: 14rpx;
	}

	.filter-box:last-child {
		margin-right: 0;
	}

	.selected-filter {
		color: #fff;
		background-color: #F2AB99;
	}

	.store-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		color: #333;
		font-size: 24rpx;
		border: 1rpx solid #fff;
		/* display: flex;
		justify-content: space-between;
		align-items: center; */
	}

	.store-box.active-store {
		border: 1rpx solid #F2AB99;
	}

	.store-cont {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
	}

	/* .store-info-box {
		display: flex;
		align-items: center;
		max-width: 75%;
	} */

	.store-img-box {
		text-align: center;
		display: flex;
		align-items: center;
	}

	.store-img {
		margin-right: 16rpx;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
	}

	.store-address {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.address-box {
		display: flex;
		align-items: center;
	}

	.address-box image {
		width: 40rpx;
		height: auto;
		margin-right: 14rpx;
	}

	.phone-box {
		width: 32%;
		margin-left: 40rpx;
	}

	.address {
		width: 360rpx;
	}

	/* .choose-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F2AB99;
		color: #fff;
		font-size: 20rpx;
		height: 48rpx;
		line-height: 48rpx;
		width: 140rpx;
		border-radius: 50rpx;
	} */

	.store-state-box {
		display: flex;
		align-items: center;
		position: absolute;
		right: 20rpx;
		top: 40rpx;
	}

	.store-state {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		color: #7CD1F8;
		border: 1rpx solid #7CD1F8;
		border-radius: 50rpx;
		text-align: center;
		background-color: #E5F6FE;
		font-size: 20rpx;
		margin-left: 14rpx;
	}

	.store-state.open-state {
		background-color: #7CD1F8;
		border-color: #7CD1F8;
		color: #fff;
	}

	.store-state.close-state {
		background-color: #999;
		border-color: #999;
		color: #fff;
	}

	.cancle-store-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
		padding: 10rpx 24rpx 30rpx;
	}

	.upload-store {
		color: #999;
		font-weight: normal;
	}

	.cancle-store {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		color: #333;
		font-size: 24rpx;
		border: 1rpx solid #fff;
		padding: 30rpx 20rpx;
	}

	.cancle-store-cont {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.attention-store {
		text-align: center;
		width: 140rpx;
		height: 54rpx;
		line-height: 54rpx;
		background-color: #F2AB99;
		color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
		margin-left: 96rpx;
	}
	
	.store-box>>>.u-swipe-action-item__content{
		width: 95%;
	}
</style>
