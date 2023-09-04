<template>
	<view class="content">
		<movable-area class="drag-sort" :style="'height:' + currentListLength + 'px'" id="drag">
			<movable-view v-for="(item, index) in currentList" :key="index" :x="0" :y="item.y"
				:style="'height:' + item.height + 'px;'" direction="vertical" disabled damping="40"
				class="drag-sort-item" :animation="active !== index"
				:class="{'item_active': active === index, 'item_after': item.index > 0}"
				@touchstart="rowTouchstart($event, index)" @touchmove="rowTouchmove" @touchend="rowTouchend">
				<view class="" :class="{'offset_content': isLeftMove && index === swipe.index}">
					<u-swipe-action>
						<u-swipe-action-item :options="funcBtn" @click="finishDelivery"
							:disabled="state == 2 ? false : true">
							<view class="delivery-list-box">
								<view class="delivery-box">
									<view class="delivery-left" @click="showDeliveryGoods(item, index)">
										<view class="order-num">#{{item.serialNumber}}</view>
										<view>
											<view class="address" @click.stop="location(item)">{{item.address}}
											</view>
											<view class="contact-info">
												<view>{{item.consignee}}{{item.gender}}</view>
												<view class="phone-icon" @click.stop="callPhone(item.contact)">
													<image :src="imgUrl + 'orderPhone.png'" mode=""></image>
													<view>{{item.contact}}</view>
												</view>
											</view>
										</view>
									</view>
									<view class="func-btn touch_move" @touchstart="touchstart" @touchmove="touchmove"
										@touchend="touchend">
										<block v-if="item.deliveryState == 1 || item.deliveryState == 2">
											<image :src="imgUrl + 'deliveryIcon.png'" mode=""></image>
										</block>
										<block v-if="item.deliveryState == 3">
											<view class="delivery-state">
												<view>配送完成</view>
												<view>{{item.actualDeliveryTime.slice(11, 16)}}</view>
											</view>
										</block>
										<block v-if="item.deliveryState == 4">
											<view class="delivery-state">
												<view class="finish-delivery">终止配送</view>
											</view>
										</block>
									</view>
								</view>
								<view class="goods-box" v-if="item.goodsState">
									<view v-for="(goods, goodIdx) in item.productList" :key="goodIdx"
										class="goods-info">
										<view class="goods-name">{{goods.name}}</view>
										<view>x{{goods.count}}</view>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
			</movable-view>
			<movable-view class="" :x="2000" :y="0" />
		</movable-area>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => ([])
			},
			listKey: {
				type: String,
				required: true
			},
			height: {
				type: Number,
				default: 130
			},
			state: Number
		},
		data() {
			return {
				imgUrl: this.config.imgUrl,
				currentList: [],
				active: -1, // 当前激活的item
				itemIndex: 0, // 当前激活的item的原index
				topY: 0, // 距离顶部的距离
				deviationY: 0, // 偏移量
				swipe: {
					index: -1, // 移动的下标
					distance: 100, // 滑动距离
					startX: 0,
					moveX: 0,
					endX: 0
				},
				funcBtn: [{
					text: '配送完成',
					style: {
						backgroundColor: '#7CD1F8'
					}
				}],
				currentListLength: 0
			}
		},
		methods: {
			/* 拨打电话 */
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			/* 跳转导航 */
			location(item) {
				let that = this
				let latitude = parseFloat(item.latitude)
				let longitude = parseFloat(item.longitude)
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function(res) {
						console.log('success')
					}
				})
			},
			showDeliveryGoods(item, index) {
				console.log(item)
				for (let i = index + 1; i < this.currentList.length; i++) {
					console.log(i)
					if (item.goodsState) {
						item.height += 50
						this.currentList[i].y -= 50
						this.currentListLength -= 50
					} else {
						item.height -= 50
						this.currentList[i].y += 50
						this.currentListLength += 50
					}
				}
				console.log('currentListLength', this.currentListLength)
				item.goodsState = !item.goodsState
				// if (item.goodsState) {
				// 	item.height += 50
				// } else {
				// 	item.height -= 50
				// }
			},
			/* 配送完成 */
			finishDelivery(e) {
				console.log(e)
				this.$emit('finishDelivery', e.index)
			},
			rowTouchstart(e, index) {
				let state = e.changedTouches[0]
				this.swipe.startX = state.pageX
				this.swipe.index = index
			},
			rowTouchmove(e) {
				let state = e.changedTouches[0]
				this.swipe.moveX = state.pageX
			},
			rowTouchend(e) {
				let state = e.changedTouches[0]
				console.log('end', state)
			},
			onUpdateCurrentList(list) {
				this.currentList = list.map((item, index) => {
					return {
						...item,
						sort: index,
						index,
						y: index * this.height,
						animation: true,
						height: this.height
					}
				})
			},
			touchstart(e) {
				// 计算y轴点击位置
				var query = wx.createSelectorQuery().in(this)
				query.select('#drag').boundingClientRect()
				query.exec((res) => {
					this.topY = res[0].top
					let touchY = e.mp.touches[0].clientY - res[0].top
					this.deviationY = touchY % this.height
					// console.log(touchY)
					for (const key in this.currentList) {
						if ((this.currentList[key].index * this.height < touchY) && ((this.currentList[key].index +
								1) * this.height > touchY)) {
							this.active = Number(key)
							this.itemIndex = this.currentList[key].index
							break
						}
					}
				})
			},
			touchmove(e) {
				if (this.active < 0) return
				let touchY = (e.mp.touches[0].clientY - this.topY) - this.deviationY
				// console.log('touchY', touchY)
				this.currentList[this.active].y = touchY
				for (const key in this.currentList) {
					// 跳过当前操作的item
					if (this.currentList[key].index !== this.currentList[this.active].index) {
						if (this.currentList[key].index > this.currentList[this.active].index) {
							if (touchY > this.currentList[key].index * this.height - this.height / 2) {
								this.currentList[this.active].index = this.currentList[key].index
								this.currentList[key].index = this.currentList[key].index - 1
								this.currentList[key].y = this.currentList[key].index * this.height
								break
							}
						} else {
							if (touchY < this.currentList[key].index * this.height + this.height / 2) {
								this.currentList[this.active].index = this.currentList[key].index
								this.currentList[key].index = this.currentList[key].index + 1
								this.currentList[key].y = this.currentList[key].index * this.height
								break
							}
						}
					}
				}
			},
			touchend(e) {
				if ((this.itemIndex !== this.currentList[this.active].index) && (this.active > -1)) {
					this.$emit('dragSortChange', {
						// 操作值
						data: (() => {
							let data = {
								...this.currentList[this.active]
							}
							delete data.index
							delete data.y
							delete data.animation
							return data
						})(),
						// 插队的位置前面的值
						frontData: (() => {
							for (const iterator of this.currentList) {
								if (this.currentList[this.active].index - 1 === iterator.index) {
									let data = {
										...iterator
									}
									delete data.index
									delete data.y
									delete data.animation
									return data
								}
							}
						})()
					})
				}
				this.currentList[this.active].animation = true
				this.currentList[this.active].y = this.currentList[this.active].index * this.height
				this.active = -1
			}
		},
		computed: {
			isLeftMove() {
				return this.swipe.distance < (this.swipe.startX - this.swipe.moveX)
			}
		},
		watch: {
			list: {
				immediate: true,
				deep: true,
				handler(list) {
					this.onUpdateCurrentList(list)
				}
			},
			// currentListLength() {
			// 	console.log('改变')
			// 	this.currentListLength = this.currentList.length * this.height
			// 	console.log('currentListLength', this.currentListLength)
			// }
		},
		mounted() {
			this.currentListLength = this.list.length * this.height
		}
	}
</script>

<style scoped>
	/* @mixin flexLayout($align: center, $justify: center, $direction: row, $wrap: nowrap) {
		@if $align=='start' {
			$align: flex-start
		}

		@if $align=='end' {
			$align: flex-end
		}

		@if $justify=='start' {
			$justify: flex-start
		}

		@if $justify=='end' {
			$justify: flex-end
		}

		display: flex;
		align-items: $align;
		justify-content: $justify;
		flex-direction: $direction;
		flex-wrap: $wrap;
	}

	@mixin overflowEllipsis($rows: 1) {
		white-space: pre-wrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: $rows;
	} */

	/* .drag-sort {
		.drag-sort-item {
			position: absolute !important;
			width: 750upx;

			.content {

				&-left {
					width: 750upx;
					height: 100%;
					flex: none;
					@include flexLayout(center, flex-start);
					padding: 0 15upx;

					.touch_area {
						width: 30upx;
						height: 30upx;
						background-image: url('http://static.moka.world/wxa/images/mock/icon_drag.png');
						background-size: cover;
						@include flexLayout;
					}

					.context_item {
						flex: 1;
						margin-left: 10rpx;
						@include overflowEllipsis;
					}

					.icon_right {
						width: 24upx;
						height: 24upx;
						background-image: url('http://static.moka.world/wxa/images/mock/arrow-right-bold.png');
						background-size: cover;
					}
				}

				&-btn {
					width: 0;
					flex: none;
					@include flexLayout(center, flex-start);
					transition: .3s all;

					.fn_btn {
						flex: auto;
						height: 100%;
						text-align: center;
						font-size: 32upx;
						color: #FFF;
						line-height: 110upx;
					}

					.btn_edit {
						background: #0f63c2;
					}

					.btn_del {
						background: #fe1c1c;
					}
				}
			}

			.offset_content {
				width: 100%;

				.content-left {
					width: 550upx !important;
				}

				.content-btn {
					width: 200upx !important;
				}
			}
		}
	} */

	/* .item_after {
		position: relative;
	} */

	.touch_move {
		height: 40rpx;
		width: 44rpx;
		transform: translateX(0px) translateY(0px) translateZ(0px) scale(1) !important;
	}

	.item_active {
		z-index: 99;
	}

	.content>>>.drag-sort {
		width: unset;
	}

	.content>>>.drag-sort-item {
		width: 100%;
		/* height: unset; */
	}

	.delivery-list-box {
		background-color: #fff;
		padding: 0 20rpx;
		margin: 14rpx 24rpx;
		min-height: 240rpx;
	}

	.delivery-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* padding: 30rpx 0; */
		min-height: 240rpx;
	}

	.delivery-left {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
		justify-content: space-between;
	}

	.phone-icon {
		display: flex;
		align-items: center;
		padding-left: 80rpx;
	}

	.phone-icon image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
	}

	.func-btn {
		width: 15%;
		text-align: right;
	}

	.func-btn image {
		width: 44rpx;
		height: 40rpx;
	}

	.order-num {
		color: #999;
		padding-right: 20rpx;
	}

	.address {
		font-size: 40rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.contact-info {
		display: flex;
		align-items: center;
		padding-top: 40rpx;
	}

	.goods-box {
		border-top: 1rpx solid #ccc;
	}

	.goods-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
		font-size: 28rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #eee;
	}
	
	.goods-info:last-child {
		border-bottom: 0;
	}

	.goods-name {
		padding-right: 18rpx;
	}

	.delivery-state {
		text-align: center;
		font-size: 28rpx;
		color: #7CD1F8;
	}

	.finish-delivery {
		color: #F2AB99;
	}
</style>
