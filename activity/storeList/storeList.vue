<template>
	<view>
		<view class="wrap">
			<u-search placeholder="请输入店铺名称" v-model="productName" :showAction="false" @search="searchGoods"
				:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
				searchIconColor="#ccc" shape="square" @clear="searchGoods"></u-search>
		</view>
		<view>
			<block v-for="(item, index) in storeList" :key="index">
				<view class="store-box" :class="storeId == item.id ? 'active-store' : ''" @click="selectStore(item.id)">
					<view class="store-info-box">
						<view :class="item.activityStatus ? 'shadow-box' : ''"></view>
						<view class="store-img">
							<image :src="item.logo ? item.logo : defaultHead"></image>
						</view>
						<view class="store-info">
							<view class="store-name">{{item.name}}</view>
							<view>{{item.state}}{{item.city}}{{item.district}}{{item.address}}</view>
						</view>
					</view>
					<block v-if="item.activityStatus">
						<view class="activity-state">活动进行中</view>
					</block>
					<block v-else>
						<view class="select-goods" :class="storeId == item.id ? 'isSelect-goods' : ''">
							<block v-if="storeId == item.id">
								<image src="../../static/store/check.png" mode=""></image>
							</block>
						</view>
					</block>
				</view>
			</block>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="save-btn" @tap="$u.throttle(saveStore, 500)">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productName: '',
				pageIndex: 1,
				pageSize: 20,
				storeList: [],
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				completed: false,
				storeId: '',
				beginDate: '', // 活动开始时间
				endDate: '' // 活动结束时间
			}
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.storeId = options.storeId
			this.beginDate = options.beginDate
			this.endDate = options.endDate
			this.getStoreList()
		},
		onReachBottom() {
			let that = this
			if (!that.completed) {
				that.pageIndex++
				that.request({
					url: that.config.stores,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						name: that.productName,
						beginTime: that.beginDate,
						endTime: that.endDate
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						that.storeList.push(...data)
					}
				})
			}
		},
		methods: {
			getStoreList() {
				let that = this
				that.request({
					url: that.config.stores,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						name: that.productName,
						beginTime: that.beginDate,
						endTime: that.endDate
					}
				}).then(res => {
					console.log(res)
					that.storeList = res.data.data
				})
			},
			/* 搜索商品 */
			searchGoods() {
				this.completed = false
				this.getStoreList()
			},
			/* 选择店铺 */
			selectStore(id) {
				this.storeId = id
			},
			/* 保存店铺 */
			saveStore() {
				this.storeList.forEach(item => {
					if (item.id == this.storeId) {
						console.log(item)
						var pages = getCurrentPages()
						var prevPage = pages[pages.length - 2]
						prevPage.$vm.storeInfo = item
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style scoped>
	.wrap {
		padding: 34rpx 24rpx;
		background: #fff;
	}
	
	.store-box{
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
	
	.store-box.active-store{
		border: 1rpx solid #F2AB99;
	}
	
	.store-info-box{
		display: flex;
		align-items: center;
		max-width: 80%;
		position: relative;
	}
	
	.shadow-box{
		background-color: rgba(255, 255, 255, .6);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	.store-img{
		margin-right: 20rpx;
	}
	
	.store-img image{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	
	.store-name{
		font-size: 28rpx;
		margin-bottom: 18rpx;
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
	
	.activity-state{
		width: 120rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		border: 1rpx solid #333;
		color: #333;
		font-size: 20rpx;
		text-align: center;
		background-color: #D6D6D6;
	}
	
	.save-btn{
		position: fixed;
		bottom: 64rpx;
		left: 24rpx;
		right: 24rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>