<template>
	<view class="wrap">
		<view class="input-box">
			<u-search placeholder="请输入客户昵称或者完整手机号" v-model="nicknameOrPhone" :showAction="false" @search="searchClients"
				:clearable="true" bgColor="#fff" borderColor="#333" placeholderColor="#ccc" color="#333"
				searchIconColor="#F2AB99" shape="square" @clear="searchClients"></u-search>
		</view>
		<view class="tags-box">
			<view class="client-tags" v-for="(item,index) in tagList" :key="item.id"
				:class="{activeTag:index == tagIndex}" @click="tagsClick(item,index)">
				{{item.name}}({{item.num}})
			</view>
		</view>
		<view class="client-list">
			<view class="item" v-for="(item,index) in clientList" :key="index" @click="toClientDetail(item.id)">
				<image class="new" :src="imgUrl + 'new.png'" mode="widthFix"></image>
				<view class="client-img">
					<image :src="item.avatar"></image>
				</view>
				<view>
					<view class="name">{{item.nickname}}</view>
					<view class="phone">{{item.phone}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				clientList: [], // 客户信息
				nicknameOrPhone: '', // 昵称或手机号
				tagIndex: '',
				type: '',
				pageIndex: 1,
				pageSize: 20,
				tagList: [{
					id: 3,
					emphasis: 2,
					name: '新客户',
					num: 0
				}, {
					id: 2,
					emphasis: 1,
					name: '星标客户',
					num: 0
				}, {
					id: 1,
					emphasis: 0,
					name: '全部客户',
					num: 0
				}],
				storeId: ''
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.storeId = uni.getStorageSync('storeInfo').id
		},
		onShow() {
			this.tagIndex = 0
			this.type = this.tagList[0].emphasis
			this.clientList = []
			this.completed = false
			this.pageIndex = 1
			this.getClientList()
			this.getClientNum()
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				this.getClientList()
			}
		},
		onPullDownRefresh() {
			this.type = this.tagList[0].emphasis
			this.clientList = []
			this.completed = false
			this.pageIndex = 1
			this.getClientNum()
			this.getClientList()
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			/* 获取客户列表 */
			getClientList() {
				let that = this
				that.request({
					url: that.config.storecustomers,
					data: {
						storeId: that.storeId,
						nicknameOrPhone: that.nicknameOrPhone,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						type: that.type
					},
				}).then(res => {
					const data = res.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						that.clientList.push(...data)
					}
				})
			},
			tagsClick(item, index) {
				this.tagIndex = index
				this.type = item.emphasis
				this.clientList = []
				this.pageIndex = 1
				this.completed = false
				this.getClientNum()
				this.getClientList()
			},
			toClientDetail(id) {
				uni.navigateTo({
					url: '/store/clientDetali/clientDetali?id=' + id
				})
			},
			/* 客户查询 */
			searchClients() {
				this.clientList = []
				this.pageIndex = 1
				this.completed = false
				this.getClientNum()
				this.getClientList()
			},
			/* 获取店铺客户分类计数 */
			getClientNum() {
				let that = this
				that.request({
					url: that.config.storecustomers + `/${that.storeId}/groupCount`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					that.tagList[0].num = data.newStatus // 新客户
					that.tagList[1].num = data.emphasis // 星标客户
					that.tagList[2].num = data.all // 全部客户
				})
			}
		}
	}
</script>

<style scoped>
	.input-box {
		padding: 40rpx 24rpx;
		background-color: #fff;
	}

	.tags-box {
		padding: 32rpx 24rpx 38rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.client-tags {
		padding: 0 62rpx 0 0;
	}

	.client-tags.activeTag {
		color: #F0AA98;
	}

	.client-list {
		padding: 0 24rpx;
	}

	.client-list .item {
		position: relative;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.client-list .item .new {
		position: absolute;
		width: 40rpx;
		height: auto;
		top: 12rpx;
		left: 12rpx;
	}

	.client-img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}

	.client-img image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
	}

	.name {
		color: #333;
		font-size: 28rpx;
		padding-bottom: 20rpx;
	}

	.phone {
		font-size: 24rpx;
		color: #999;
	}
</style>
