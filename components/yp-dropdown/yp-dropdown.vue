<template>
	<view class="filter-wrapper" @touchmove.stop.prevent="discard">
		<view class="inner-wrapper">
			<!-- <view class="mask" :class="showMask ? 'show' : 'hide'" @tap="tapMask"></view> -->
			<view class="navs" :class="{ 'c-flex-center': index > 0, actNav: index === actNav, 'add-goods-nav': addGoods }"
				v-for="(item, index) in navData" :key="index" @click="navClick(index)">
				<view v-for="(child, childx) in item" :key="childx" v-if="child.select">{{ child.text }}</view>
				<block v-if="addGoods">
					<image src="../../static/goods/upArrow.png" mode="widthFix" class="icon-triangle"
						v-if="index === actNav"></image>
					<image src="../../static/goods/downArrow.png" mode="widthFix" class="icon-triangle" v-else>
					</image>
				</block>
				<block v-if="!addGoods">
					<image src="../../static/store/upArrow.png" mode="widthFix" class="icon-triangle"
						v-if="index === actNav"></image>
					<image src="../../static/store/downArrow.png" mode="widthFix" class="icon-triangle" v-else>
					</image>
				</block>
			</view>
			<scroll-view scroll-y="true" class="popup" :class="popupShow ? 'popupShow' : ''">
				<view class="item-opt c-flex-align" :class="[item.select ? 'actOpt' : '', addGoods ? 'add-goods-item' : '']"
					v-for="(item, index) in navData[actNav]" :key="index" @click="handleOpt(index)">
					{{ item.text }}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// import { getCurDateTime } from '@/libs/utils.js';
	export default {
		props: {
			height: {
				type: Number,
				default: 108
			},
			top: {
				type: String,
				default: 'calc(var(--window-statsu-bar) + 44px)'
			},
			border: {
				type: Boolean,
				default: false
			},
			filterData: {
				//必填
				type: Array,
				default: () => {
					return [];
				}
			},
			defaultIndex: {
				//默认选中条件索引,超出一类时必填
				type: Array,
				default: () => {
					return [0];
				}
			},
			addGoods: Boolean
		},
		data() {
			return {
				navData: [],
				popupShow: false,
				showMask: false,
				actNav: null,
				selIndex: [] //选中条件索引
			};
		},
		created() {
			this.navData = this.filterData;
			this.selIndex = this.defaultIndex;
			this.keepStatus();
		},
		watch: {
			defaultIndex() {
				this.selIndex = this.defaultIndex
				this.keepStatus()
			}
		},
		methods: {
			keepStatus() {
				this.navData.forEach(itemnavData => {
					itemnavData.map(child => {
						child.select = false;
					});
					return itemnavData;
				});
				for (let i = 0; i < this.selIndex.length; i++) {
					let selindex = this.selIndex[i];
					this.navData[i][selindex].select = true;
				}
			},
			navClick(index) {
				if (index === this.actNav) {
					this.tapMask();
					return;
				}
				this.popupShow = true;
				this.showMask = true;
				this.actNav = index;
			},
			handleOpt(index) {
				this.selIndex[this.actNav] = index;
				this.keepStatus();
				setTimeout(() => {
					this.tapMask();
				}, 100);
				let data = [];
				let res = this.navData.forEach(item => {
					let sel = item.filter(child => child.select);
					data.push(sel);
				});
				console.log(data);
				this.$emit('onSelected', data);
			},
			dateClick() {
				this.tapMask();
			},
			tapMask() {
				this.showMask = false;
				this.popupShow = false;
				this.actNav = null;
			},
		}
	};
</script>

<style lang="scss" scoped>
	page {
		font-size: 28rpx;
	}

	.c-flex-align {
		display: flex;
		align-items: center;
	}

	.c-flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.filter-wrapper {
		.inner-wrapper {
			.navs {
				position: relative;
				height: 64rpx;
				padding: 0 10rpx;
				width: 136rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background-color: #fff;
				border-bottom: 2rpx solid #f5f6f9;
				color: #333;
				z-index: 999;
				box-sizing: border-box;
				.date {
					justify-content: flex-end;
				}
				.actNav {
					color: #4d7df9;
					font-weight: bold;
				}
			}
			.add-goods-nav{
				background-color: #F2AB99;
				color: #fff;
				width: 112rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				padding: 0 14rpx;
			}

			.popup {
				position: absolute;
				max-height: 500rpx;
				background-color: #fff;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				overflow: scroll;
				z-index: 999;
				transition: all 1s linear;
				opacity: 0;
				display: none;

				.item-opt {
					height: 100rpx;
					padding: 0 40rpx;
					color: #8b9aae;
					border-bottom: 2rpx solid #f5f6f9;
				}

				.actOpt {
					color: #F2AB99;
					font-weight: bold;
					position: relative;

					// &::after {
					// 	content: '✓';
					// 	font-weight: bold;
					// 	font-size: 36rpx;
					// 	position: absolute;
					// 	right: 40rpx;
					// }
				}
				.add-goods-item{
					padding: 0 14rpx;
					font-size: 28rpx;
				}
			}

			.popupShow {
				display: block;
				opacity: 1;
			}
		}

		.icon-triangle {
			width: 16rpx;
			height: auto;
			margin-left: 10rpx;
		}
	}
</style>
