<template>
	<view>
		<u-sticky>
			<view class="nav-box">
				<u-tabs :list="navList" :scrollable="false" lineColor="#F2AB99" activeStyle="color: #333;"
					inactiveStyle="color: #999;" @click="changeStoreApplyState"></u-tabs>
			</view>
		</u-sticky>
		<view>
			<view class="apply-store-box" v-for="(item, index) in applyList" :key="index" @click="goApplyDetail(item)">
				<view>
					<view class="apply-store-name">
						<view>{{item.name}}</view>
						<view class="store-type" :class="item.storeType == 2 ? 'order-type' : ''">
							<block v-if="item.storeType == 1">展示型</block>
							<block v-if="item.storeType == 2">交易型</block>
						</view>
					</view>
					<view class="apply-time">申请时间：{{item.createTime}}</view>
				</view>
				<view v-if="item.auditResult == 1" class="agree-apply">审核通过</view>
				<view v-if="item.auditResult == 2" class="apply-btn">审核</view>
				<view v-if="item.auditResult == 3" class="cancle-apply">审核打回</view>
				<view v-if="item.auditResult == 4" class="apply-btn">待审核</view>
				<view v-if="item.auditResult == 5" class="cancle-apply">申请已撤销</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				completed: false,
				pageSize: 10,
				pageIndex: 1,
				navList: [{
					name: '待审核',
					value: 2
				}, {
					name: '审核打回',
					value: 3
				}, {
					name: '已完成',
					value: 1
				}],
				auditResult: '', // 审核状态
				applyList: []
			}
		},
		onLoad() {
			this.auditResult = this.navList[0].value
		},
		onShow() {
			this.pageIndex = 1
			this.applyList = []
			this.getApplyList()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getApplyList()
			}
		},
		methods: {
			/* 切换导航栏 */
			changeStoreApplyState(item) {
				console.log('item', item)
				this.auditResult = item.value
				this.pageIndex = 1
				this.applyList = []
				this.completed = false
				this.getApplyList()
			},
			/* 获取入驻申请列表 */
			getApplyList() {
				let that = this
				that.request({
					url: that.config.storeMaterials,
					data: {
						pageSize: that.pageSize,
						pageIndex: that.pageIndex,
						auditResult: that.auditResult
					}
				}).then(res => {
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						data.forEach(item => {
							item.createTime = item.createTime.slice(0, 10)
						})
						that.applyList.push(...data)
					}
				})
			},
			/* 跳转材料审核 */
			goApplyDetail(item) {
				uni.navigateTo({
					url: './detail?applyId=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.nav-box {
		background-color: #fff;
	}

	.apply-store-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 30rpx 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.apply-store-name {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		color: #000;
		padding-bottom: 20rpx;
	}

	.store-type {
		color: #fff;
		font-size: 24rpx;
		background-color: #7CD1F8;
		border-radius: 50rpx;
		margin-left: 20rpx;
		width: 100rpx;
		height: 36rpx;
		line-height: 36rpx;
		text-align: center;
	}

	.store-type.order-type {
		background-color: #DD5B33;
	}

	.apply-time {
		color: #666;
		font-size: 28rpx;
	}

	.apply-btn {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		border-radius: 50rpx;
	}

	.cancle-apply {
		color: #DD5B33;
	}

	.agree-apply {
		color: #62B279;
	}
</style>
