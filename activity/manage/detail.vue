<template>
	<view>
		<view class="menu-tab">
			<view v-for="(item, index) in list" :key="index" class="tab-select"
				:class="tabIdx == index ? index == 0 ? 'today-active' : index == 1 ? 'tommorrow-active' : '' : ''"
				@click="changeDate(index)">
				{{item}}
			</view>
		</view>
		<block v-if="tabIdx == 0">
			<view class="detail-box">
				<view class="input-box">
					<view class="input-left">店铺选择</view>
					<view class="input-right">
						<view>{{activityInfo.storeName}}</view>
						<!-- <image src="../../static/store/setArrow.png" mode="widthFix"></image> -->
					</view>
				</view>
				<view class="input-box">
					<view class="input-left">名称</view>
					<view>{{activityInfo.name}}</view>
				</view>
				<view class="input-box">
					<view class="input-left">创建人</view>
					<view>{{activityInfo.createBy}}</view>
				</view>
				<view class="input-box">
					<view class="input-left">时间</view>
					<!-- 只有未开始活动可编辑 -->
					<block v-if="activityInfo.state == '0'">
						<view class="input-right">
							<!-- <picker mode="date" :value="beginDateTime" @change="confirmBeginTime"
								@cancel="closeBeginTime">
								<input type="text" placeholder="年-月-日" :disabled="true" :placeholder-style="style"
									v-model="beginDateTime">
							</picker> -->
							<yp-datetime
								placeholder="年-月-日"
								:defaultValue="beginDateTime"
								start="2000-02-03 02"
								end="2100-10-28 22"
								fields="hour"
								@change="confirmBeginTime" class="select-time"
							></yp-datetime>
							<view class="symbol"> — </view>
							<!-- <picker mode="date" :value="endDateTime" @change="confirmEndTime" @cancel="closeBeginTime">
								<input type="text" placeholder="年-月-日" :disabled="true" :placeholder-style="style"
									v-model="endDateTime">
							</picker> -->
							<yp-datetime
								placeholder="年-月-日"
								:defaultValue="endDateTime"
								start="2000-02-03 02"
								end="2100-10-28 22"
								fields="hour"
								@change="confirmEndTime" class="select-time"
							></yp-datetime>
						</view>
					</block>
					<block v-else>
						<view>{{activityInfo.beginDate}} — {{activityInfo.endDate}}</view>
					</block>
				</view>
				<view class="input-box">
					<view class="input-left">抽卡门槛</view>
					<block v-if="activityInfo.state == '0'">
						<view class="input-right" @click="openSelectValueShow('1')">
							<view>{{thresholdValue}}元</view>
							<image src="../../static/store/setArrow.png" mode="widthFix"></image>
						</view>
					</block>
					<block v-else>
						<view>{{thresholdValue}}元</view>
					</block>
				</view>
				<!-- <view class="input-box">
					<view class="input-left">规则类型</view>
					<view>{{activityInfo.typeName}}</view>
				</view>
				<view class="input-box">
					<view class="input-left">奖励次数</view>
					<view>{{activityInfo.numberOfReward}}次</view>
				</view>
				<view class="input-box">
					<view class="input-left">单笔奖励上限</view>
					<view>{{activityInfo.upperLimit}}次</view>
				</view> -->
				<view class="input-box textarea-box">
					<view class="input-left">描述</view>
					<view class="input textarea" v-if="activityInfo.state == '0'">
						<u--textarea v-model="activityDesc" placeholder="请输入活动描述" :placeholderStyle="style">
						</u--textarea>
					</view>
					<view class="input textarea" v-else>{{activityDesc}}</view>
				</view>
				<block v-if="activityInfo.state == '0'">
					<view class="input-box">
						<view>卡片种类</view>
						<view class="input-right" @click="openClasstypeShow('4')">
							<view>{{classtype}}种</view>
							<image src="../../static/store/setArrow.png" mode="widthFix"></image>
						</view>
					</view>
				</block>
				<view class="input-box card-kind-box">
					<view class="input-left">卡片种类</view>
					<view class="probability">抽卡概率{{probability}}</view>
				</view>
				<view class="card-list" v-if="!editCard">
					<view v-for="(item, index) in cardList" :key="index" class="card-box">
						<image :src="item.cardPicture"></image>
						<!-- <view class="card-count">{{item.count}}</view> -->
						<!-- <view>{{item.name}}</view> -->
						<view>NO.{{index + 1}}</view>
					</view>
				</view>
				<view class="card-list" v-if="editCard">
					<view v-for="(img, index) in cardList" :key="index" class="upload-card">
						<view class="add-img" v-if="img.cardPicture === ''">
							<u-upload @afterRead="afterRead" name="1" :multiple="false" :maxCount="10" :name="index">
								<view>
									<u-icon name="plus" color="#F2AB99" size="28"></u-icon>
								</view>
							</u-upload>
						</view>
						<view class="upload-cardimg" v-if="img.cardPicture !== ''">
							<image :src="img.cardPicture" mode=""></image>
							<image src="../../static/goods/closeIcon.png" mode="" class="delete-img"
								@click="deletePic(index)"></image>
						</view>
						<view class="add-card-input">
							NO.{{index + 1}}
							<!-- <input type="text" v-model="img.name" :placeholder="'卡片' + (index + 1)"
								:placeholder-style="style"> -->
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-if="tabIdx == 1" v-for="(item, index) in ruleList" :key="index">
			<view class="rule-box">
				<!-- <view class="input-box">
					<view>规则奖励</view> -->
					<!-- <view v-if="index == 0">规则A奖励</view>
					<view v-if="index == 1">规则B奖励</view>
					<view v-if="index == 2">规则C奖励</view> -->
					<!-- <block v-if="item.productList.length == 0">
						<view>{{item.amount}}元以下商品*1</view>
					</block>
					<block v-else>
						<view>{{item.goodsList}}</view>
					</block>
				</view> -->
				<!-- <view class="input-box">
					<view class="input-left">卡片要求</view>
					<view v-if="item.repetitionType == 1">可重复</view>
					<view v-if="item.repetitionType == 2">不可重复</view>
				</view> -->
				<!-- <view class="input-box">
					<view class="input-left">集卡数量</view>
					<view>{{item.cardQuantity}}张</view>
				</view> -->
				<!-- 未开始的活动可编辑 -->
				<block v-if="activityInfo.state == '0'">
					<view class="input-box">
						<view>兑换方式</view>
						<view class="card-require">
							<view v-for="(item, index) in exchangeTypeList" :key="index" class="rule-type"
								:class="awardType == item.id ? 'select-rule-type' : ''"
								@click="selectExchangeType(index)">{{item.name}}</view>
						</view>
					</view>
					<view class="input-box" v-if="awardType == 1">
						<view>按商品金额</view>
						<view class="card-num input-right" @click="openGoodsAmountShow">
							<view v-if="amount === ''">请选择指定商品金额</view>
							<view v-else>{{amount}}元以下</view>
							<image src="../../static/store/setArrow.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="input-box" v-if="awardType == 2">
						<view>按商品</view>
						<view class="card-num input-right" @click="goSelectGoods">
							<view v-if="selectGoodsIdList.length == 0">请选择指定商品</view>
							<block v-else>
								<view>{{selectGoods}}</view>
							</block>
							<image src="../../static/store/setArrow.png" mode="widthFix"></image>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="input-box">
						<view>规则奖励</view>
						<block v-if="item.productList.length == 0">
							<view>{{item.amount}}元以下商品*1</view>
						</block>
						<block v-else>
							<view>{{item.goodsList}}</view>
						</block>
					</view>
				</block>
				<view>
					<view class="card-kind">卡片种类</view>
					<view class="card-list">
						<view v-for="(img, index) in item.cardList" :key="index" class="card-box">
							<image :src="img.cardPicture"></image>
							<!-- <view>{{img.name}}</view> -->
							<view>NO.{{index + 1}}</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 兑换规则 -->
		<view class="activity-btn" v-if="tabIdx == 1">
			<!-- 未开始活动 -->
			<block v-if="activityInfo.state == '0'">
				<view @tap="$u.throttle(editRule, 500)" class="no-finish-btn">保存生效</view>
			</block>
		</view>
		<view class="activity-btn" v-if="tabIdx == 0">
			<!-- 进行中活动 -->
			<block v-if="activityInfo.state == '1'">
				<!-- 管理员角色 -->
				<view @tap="$u.throttle(endActivity, 500)" v-if="userInfo.roleId == '1' || userInfo.roleId == '2'"
					class="no-finish-btn">提前结束
				</view>

				<!-- 老板 || 员工 -->
				<block v-if="(userInfo.roleId == '3' || userInfo.roleId == '4') && funcShow">
					<view @tap="$u.throttle(endScheduleActivity, 500)" class="save-btn">按计划结束</view>
					<picker mode="date" :value="endDateTime" @change="endDelayActivity" @cancel="closeBeginTime">
						<view class="delete-btn">延期结束</view>
					</picker>
				</block>
			</block>
			<!-- 未开始 -->
			<block v-if="activityInfo.state == '0'">
				<view @tap="$u.throttle(editActivity, 500)" class="save-btn">保存生效</view>
				<view @tap="$u.throttle(deleteActivity, 500)" class="delete-btn">删除项目</view>
			</block>
			<!-- 已结束 -->
			<block v-if="activityInfo.state == '2'">
				<view @tap="$u.throttle(deleteActivity, 500)" class="delete-btn"
					:class="activityInfo.state == '2' ? 'no-finish-btn' : ''">删除项目</view>
			</block>
		</view>
		<view style="height: 4rpx;"></view>

		<!-- 抽卡门槛 -->
		<u-popup :show="selectValueShow" @close="closeSelectValueShow" :closeable="true">
			<view class="add-title">抽卡门槛</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="thresholdValueValue"
					@change="bindThresholdChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in thresholdValueList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('1')">自定义</view>
				<view @click="confirmThresholdValue">确定</view>
			</view>
		</u-popup>

		<!-- 卡片种类 -->
		<u-popup :show="classtypeShow" @close="closeClasstypeShow" :closeable="true">
			<view class="add-title">卡片种类</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="classtypeValue" @change="bindClasstypeChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in classtypeList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('4')">自定义</view>
				<view @click="confirmClasstype">确定</view>
			</view>
		</u-popup>

		<!-- 自定义输入框 -->
		<u-popup :show="definitionShow" @close="closeDefinitionShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<input type="text" v-model="definitionValue" placeholder="请输入自定义"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="closeDefinitionShow">取消</view>
					<view class="confirm-btn" @click="confirmDefinition">确认</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 指定商品金额 -->
		<u-popup :show="goodsAmountShow" @close="closeGoodsAmountShow" :closeable="true">
			<view class="add-title">指定商品金额</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="goodsAmountValue" @change="bindGoodsAmountChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in goodsAmountList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('2')">自定义</view>
				<view @click="confirmGoodsAmount">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ypDatetime from '@/components/yp-datetime/yp-datetime.vue';
	import date from '@/common/js/date.js' // 引入时间戳转换日期格式组件
	export default {
		data() {
			return {
				list: ['游戏内容', '兑换规则'],
				tabIdx: 0,
				cardList: [], // 卡片集合
				activityId: '',
				activityInfo: {}, // 游戏内容
				probability: 0, // 抽卡概率
				ruleList: [], // 规则列表
				userInfo: {},
				editCard: false,

				exchangeTypeList: [{
					id: 1,
					name: '按金额'
				}, {
					id: 2,
					name: '按商品'
				}],
				style: 'color: #ccc;',
				beginDateTime: 0,
				endDateTime: 0,
				thresholdValue: '', // 抽卡门槛金额
				activityDesc: '', // 活动描述
				classtype: 0, // 卡片种类数量
				probability: 0, // 抽卡概率
				cardList: [], // 上传卡片列表
				thresholdValueList: ['18元', '28元', '38元', '48元'], // 抽卡门槛金额列表
				thresholdValueIdx: 0,
				thresholdValueValue: [0],
				indicatorStyle: `height: 70rpx;`,
				selectValueShow: false,
				classtypeShow: false,
				addTitle: '',
				classtypeList: ['3', '4', '5', '6'], // 卡片种类列表
				classtypeValue: [0],
				classtypeIdx: 0,
				definitionShow: false, // 自定义弹出框
				definitionType: '',
				definitionValue: '',
				beginShow: false,
				endShow: false,
				storeId: '',
				storeInfo: {},
				fileList1: [],
				type: 0, // 结束类型，1-按计划执行、2-延期
				funcShow: false,
				awardType: 1, // 兑换方式，默认指定金额1
				amount: 10, // 指定金额，默认10
				selectGoodsIdList: [],
				selectGoods: '',
				goodsAmountShow: false, // 指定商品金额弹出框
				goodsAmountList: ['10元以下', '15元以下', '20元以下'], // 卡片种类列表
				goodsAmountValue: [0],
				ruleId: ''
			}
		},
		components: {
			ypDatetime
		},
		onLoad(options) {
			uni.hideShareMenu()
			this.activityId = options.id
			this.userInfo = uni.getStorageSync('userInfo')
			this.getActivityInfo()
			this.getQiniuToken()
			let activityId = uni.getStorageSync('activityId')
			if (this.activityId != activityId) {
				// 未操作结束按钮
				this.funcShow = true
			}
		},
		methods: {
			changeDate(index) {
				this.tabIdx = index
				if (index == 1) {
					this.getAcitivityRuleInfo()
				} else if (index == 0) {
					this.getActivityInfo()
				}
			},
			getActivityInfo() {
				let that = this
				that.request({
					url: `${that.config.activityList}/${that.activityId}`
				}).then(res => {
					console.log('活动详情', res)
					const data = res.data.data
					that.activityInfo = data
					that.activityInfo.beginDate = data.beginDate + ':00' // 活动开始时间
					that.activityInfo.endDate = data.endDate + ':00' // 活动结束时间
					
					that.probability = this.roundFun(1 / data.classType, 2)
					that.cardList = data.cardList
					that.activityDesc = data.description // 活动描述
					// let beginDate = data.beginDate.slice(0, 4) + '-' + data.beginDate.slice(5, 7) + '-' + data
					// 	.beginDate.slice(8, 10)
					that.beginDateTime = data.beginDate // 活动开始时间
					// let endDate = data.endDate.slice(0, 4) + '-' + data.endDate.slice(5, 7) + '-' + data.endDate
					// 	.slice(8, 10)
					that.endDateTime = data.endDate // 活动结束时间
					// 抽卡门槛
					that.thresholdValue = data.thresholdValue
					that.thresholdValueList.forEach((item, i) => {
						if (parseInt(item) == data.thresholdValue) {
							that.thresholdValueIdx = i
							that.thresholdValueValue = [i]
						}
					})
					// 卡片种类
					that.classtype = data.classType
					that.classtypeList.forEach((item, i) => {
						if (parseInt(item) == data.classType) {
							that.classtypeIdx = i
							that.classtypeValue = [i]
						}
					})
					that.storeId = data.storeId
				})
			},
			/* 删除活动 */
			deleteActivity() {
				let that = this
				uni.showModal({
					content: '确定要删除活动吗',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.editActivity}/${that.activityId}`,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
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
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			/* 向下取整 */
			roundFun(value, n) {
				// value为原数字，n为保留几位小数
				return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n);
			},
			/* 结束活动 */
			endActivity() {
				let that = this
				uni.showModal({
					content: '确定要提前结束该活动吗',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: `${that.config.editActivity}/${that.activityId}/end`,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
							}).then(res => {
								console.log(res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '操作成功',
										icon: 'none'
									})
									setTimeout(() => {
										that.getActivityInfo()
									}, 2000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			/* 获取兑换规则 */
			getAcitivityRuleInfo() {
				let that = this
				that.request({
					url: `${that.config.activityList}/${this.activityId}/changeRule`
				}).then(res => {
					console.log(res)
					const data = res.data.data
					let arr = []
					data.changeRuleList.forEach(item => {
						if (item.productList == null) {
							item.productList = []
						}
						console.log('1111111111')
						if (item.productList.length !== 0) {
							item.productList.forEach(value => {
								arr.push(value.name + '*1')
							})
							item.goodsList = arr.join('、')
						}
					})
					that.ruleList = data.changeRuleList
					
					let ruleInfo = data.changeRuleList[0]
					that.cardList = ruleInfo.cardList
					that.amount = ruleInfo.amount
					that.awardType = ruleInfo.awardType
					if (ruleInfo.productList == null) {
						ruleInfo.productList = []
					}
					if (ruleInfo.productList.length !== 0) {
						console.log('22222222222')
						ruleInfo.productList.forEach(item => {
							that.selectGoodsIdList.push(item.id)
							that.selectGoods = item.name
						})
					}
					that.ruleId = ruleInfo.id
				})
			},
			/* 延期结束 */
			endDelayActivity(e) {
				let that = this
				that.endDateTime = e.detail.value
				that.endShow = false
				that.request({
					url: `${that.config.editActivity}/${that.activityInfo.id}/countDown`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						type: 2,
						endTime: that.endDateTime
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						// uni.navigateTo({
						// 	url: '../rule/rule?id=' + res.data.data +
						// 		'&addActivityShow=true&storeId=' + that.storeInfo.id
						// })
						uni.setStorageSync('activityId', that.activityInfo.id)
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						that.funcShow = false
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 按计划结束 */
			endScheduleActivity() {
				let that = this
				that.request({
					url: `${that.config.editActivity}/${that.activityInfo.id}/countDown`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						type: 1
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						})
						uni.setStorageSync('activityId', that.activityInfo.id)
						that.funcShow = false
						// setTimeout(() => {
						// 	uni.navigateBack()
						// }, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			editActivityDesc() {
				let storeName
				let typeName
				if (this.storeId == undefined) {
					storeName = ''
				} else {
					storeName = this.storeName
				}
				let beginDate = this.beginDateTime.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
				let endDate = this.endDateTime.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
				this.activityDesc =
					`${beginDate}时 - ${endDate}时单笔消费满${this.thresholdValue}元，即可获抽卡机会一次`
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
			/* 删除图片 */
			deletePic(index) {
				this.cardList[index].cardPicture = ''
			},
			// 新增图片
			async afterRead(event) {
				console.log('上传的图片', event)
				uni.showLoading({
					title: '上传中'
				})
				let index = event.name
				// 新增前删除原图片
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList1`].length
				lists.map((item) => {
					this[`fileList1`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url, index)
					let item = this[`fileList1`][fileListLen]
					this[`fileList1`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url, index) {
				let that = this
				// let leng = this.fullDescList.length - 1
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: url,
						header: {
							"Content-Type": "multipart/form-data",
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							uni.hideLoading()
							let pic = 'https://qiaokun.yuepong.com/' + JSON.parse(res.data).key
							that.cardList[index].cardPicture = pic
							setTimeout(function() {
								uni.hideLoading();
							}, 2000);
							// let data = JSON.parse(res.data)
							// that.key = data.key
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			// 抽卡门槛
			openSelectValueShow() {
				this.selectValueShow = true
			},
			closeSelectValueShow() {
				this.selectValueShow = false
			},
			bindThresholdChange(e) {
				console.log(e)
				this.thresholdValueIdx = e.detail.value[0]
			},
			confirmThresholdValue() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.thresholdValue = parseFloat(this.thresholdValueList[this.thresholdValueIdx])
					this.selectValueShow = false
					this.editActivityDesc()
				}, 1000)
			},
			// 卡片种类
			openClasstypeShow() {
				this.classtypeShow = true
			},
			closeClasstypeShow() {
				this.classtypeShow = false
			},
			confirmClasstype() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.classtype = parseInt(this.classtypeList[this.classtypeIdx])
					this.classtypeShow = false
					this.probability = this.roundFun(1 / this.classtype, 2)
					this.editCard = true
					this.cardList = []
					for (var i = 0; i < this.classtype; i++) {
						this.cardList.push({
							cardPicture: '',
							name: ''
						})
					}
				}, 1000)
			},
			bindClasstypeChange(e) {
				console.log('卡片种类', e)
				this.classtypeIdx = e.detail.value[0]
			},
			openDefinitionShow(type) {
				this.definitionType = type
				this.definitionValue = ''
				if (type == '1') {
					// 抽卡门槛
					this.selectValueShow = false
				} else if (type == '4') {
					// 卡片种类
					this.classtypeShow = false
				}
				this.definitionShow = true
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				if (this.definitionType == '1') {
					// 抽卡门槛
					this.thresholdValue = this.definitionValue
					this.definitionShow = false
				} else if (this.definitionType == '4') {
					// 卡片种类
					if (this.definitionValue > 26) {
						uni.showToast({
							title: '最多可添加26张卡片',
							icon: 'none'
						})
					} else {
						this.classtype = this.definitionValue
						this.probability = this.roundFun(1 / this.classtype, 2)
						this.editCard = true
						this.cardList = []
						for (var i = 0; i < this.classtype; i++) {
							this.cardList.push({
								cardPicture: '',
								name: ''
							})
						}
						this.definitionShow = false
					}
				}
				this.editActivityDesc()
			},
			closeBeginTime() {
				this.beginShow = false
				this.endShow = false
			},
			confirmBeginTime(e) {
				console.log(e)
				this.beginDate = `${e.f1} ${e.hh}:${e.mm}`
				this.beginDateTime = `${e.f1} ${e.hh}:${e.mm}`.slice(0, 13)
				this.beginShow = false
				this.nextMonthTime()
			},
			/* 计算三个月后时间 */
			nextMonthTime() {
				// beginDateTime为 年-月-日 格式
				let currentDate = new Date(this.beginDate)
				let search_month = currentDate.getMonth()
				search_month = search_month + 3
				if (search_month > 11) {
					currentDate.setFullYear(currentDate.getFullYear() + 1)
					currentDate.setMonth(0)
				} else if (search_month < 0) {
					currentDate.setFullYear(currentDate.getFullYear() - 1)
					currentDate.setMonth(11)
				} else {
					currentDate.setMonth(search_month)
				}
				console.log('currentDate', currentDate)
				this.endDateTime = date.parseTime(currentDate.getTime(), "{y}-{m}-{d} {h}")
				console.log('endDateTime', this.endDateTime)
				this.editActivityDesc()
			},
			confirmEndTime(e) {
				console.log(e)
				this.endDate = `${e.f1} ${e.hh}:${e.mm}`
				this.endDateTime = `${e.f1} ${e.hh}:${e.mm}`.slice(0, 13)
				this.endShow = false
				this.editActivityDesc()
			},
			/* 修改活动 */
			editActivity() {
				let that = this
				let cardFlag = false
				let cardNameFlag = false
				console.log('cardList', that.cardList)
				that.cardList.forEach(card => {
					card.select = false
					if (card.cardPicture == '') {
						cardFlag = true
					}
					if (card.name == '') {
						cardNameFlag = true
					}
				})
				if (that.storeId == undefined) {
					uni.showToast({
						title: '请选择店铺',
						icon: 'none'
					})
				} else if (that.beginDateTime === '') {
					uni.showToast({
						title: '请选择活动开始时间',
						icon: 'none'
					})
				} else if (that.endDateTime === '') {
					uni.showToast({
						title: '请选择活动结束时间',
						icon: 'none'
					})
				} else if (parseFloat(that.thresholdValue) == 0) {
					uni.showToast({
						title: '请选择抽卡门槛',
						icon: 'none'
					})
				} else if (that.activityDesc === '') {
					uni.showToast({
						title: '请输入活动描述',
						icon: 'none'
					})
				} else if (that.classtype == 0) {
					uni.showToast({
						title: '请选择卡片种类',
						icon: 'none'
					})
				} else if (cardFlag) {
					uni.showToast({
						title: '请上传卡片图片',
						icon: 'none'
					})
				} else {
					uni.showLoading({
						title: '保存中'
					})
					that.request({
						url: `${that.config.editActivity}/${that.activityInfo.id}`,
						method: 'PUT',
						header: {
							'Content-Type': 'application/json',
							'Transaction-No': new Date().getTime()
						},
						data: {
							beginDate: that.beginDateTime,
							endDate: that.endDateTime,
							thresholdValue: parseFloat(that.thresholdValue),
							cardList: that.cardList,
							classType: that.classtype
						}
					}).then(res => {
						console.log(res)
						uni.hideLoading()
						if (res.data.code == '200000') {
							// uni.navigateTo({
							// 	url: '../rule/rule?id=' + res.data.data +
							// 		'&addActivityShow=true&storeId=' + that.storeInfo.id
							// })
							uni.showToast({
								title: '保存成功',
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
			},
			/* 选择兑换方式 */
			selectExchangeType(idx) {
				this.awardType = this.exchangeTypeList[idx].id
				this.amount = parseFloat(this.goodsAmountList[0])
			},
			/* 打开指定商品金额 */
			openGoodsAmountShow() {
				this.goodsAmountValue = [0]
				this.goodsAmountShow = true
			},
			closeGoodsAmountShow() {
				this.goodsAmountShow = false
			},
			/* 选择商品 */
			goSelectGoods(index) {
				// this.addActivityShow = false
				uni.navigateTo({
					url: '../selectGoods/selectGoods?index=' + index + '&storeId=' + this.storeId
				})
			},
			bindGoodsAmountChange(e) {
				this.goodsAmountIdx = e.detail.value[0]
			},
			confirmGoodsAmount() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.amount = parseFloat(this.goodsAmountList[this.goodsAmountIdx])
					this.goodsAmountShow = false
				}, 1000)
			},
			/* 修改活动规则 */
			editRule() {
				let that = this
				if (that.awardType == 1) {
					// 指定金额
					that.selectGoodsIdList = []
				} else if (that.awardType == 2) {
					// 指定商品
					that.amount = ''
				}
				let arr = []
				arr.push({
					id: that.ruleId,
					awardType: that.awardType,
					amount: that.amount,
					productList: that.selectGoodsIdList,
					detailFlag: 'modified'
				})
				that.request({
					url: `${that.config.editActivity}/${that.activityId}/changeRule`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						changeRuleList: arr
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '修改成功',
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
		}
	}
</script>

<style scoped>
	.menu-tab {
		display: flex;
		align-items: flex-end;
		font-size: 28rpx;
		color: #666;
		margin-top: 40rpx;
	}

	.tab-select {
		width: 254rpx;
		height: 68rpx;
		line-height: 68rpx;
		text-align: center;
		background-image: url(../../static/store/timebg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.tab-select:nth-child(2) {
		margin-left: -40rpx;
		z-index: 22;
	}

	.tab-select.today-active {
		background-image: url(../../static/store/todayActive.png);
		color: #F2AB99;
		z-index: 23;
		height: 80rpx;
		line-height: 80rpx;
	}

	.tab-select.tommorrow-active {
		background-image: url(../../static/store/tommorrow.png);
		color: #F2AB99;
		z-index: 23;
		height: 80rpx;
		line-height: 80rpx;
	}

	.detail-box {
		background-color: #fff;
	}

	.rule-box {
		margin-bottom: 14rpx;
		background-color: #fff;
	}

	.input-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 24rpx;
		color: #333;
		font-size: 28rpx;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.input-box.card-kind-box {
		border-bottom: 0;
	}

	.input-left {
		color: #999;
	}

	.input-right {
		display: flex;
		align-items: center;
	}

	.input-right image {
		width: 8rpx;
		height: auto;
		margin-left: 10rpx;
	}

	.select-time {
		width: 240rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		background-color: #F4F4F4;
	}

	.symbol {
		padding: 0 20rpx;
	}

	.textarea-box {
		align-items: flex-start;
		line-height: 44rpx;
	}

	.textarea {
		width: 512rpx;
		font-size: 28rpx;
		text-align: right;
	}

	.textarea-box>>>.u-textarea {
		padding: 0;
	}

	.probability {
		color: #F2AB99;
	}

	.card-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 24rpx;
	}

	.my-card-box {
		padding: 38rpx 0;
	}

	.card-tip {
		color: #333;
		font-size: 28rpx;
	}

	.card-box {
		position: relative;
		margin-right: 14rpx;
		margin-bottom: 38rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.card-box:nth-child(4n) {
		margin-right: 0;
	}

	.card-count {
		position: absolute;
		right: -6rpx;
		top: -12rpx;
		background-color: #F2AB99;
		color: #fff;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		font-size: 24rpx;
		text-align: center;
	}

	.card-box image {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		margin-bottom: 8rpx;
	}

	.activity-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 40rpx 24rpx;
	}

	.activity-btn view {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		background-color: #F2AB99;
		border: 1rpx solid #F2AB99;
		border-radius: 50rpx;
		font-size: 28rpx;
		text-align: center;
	}

	.activity-btn view.save-btn {
		margin-right: 20rpx;
	}

	.activity-btn view.delete-btn {
		background-color: transparent;
		color: #F2AB99;
		margin-right: 14rpx;
	}

	.activity-btn view.no-finish-btn {
		width: 100%;
	}

	.card-kind {
		color: #999;
		font-size: 28rpx;
		padding: 26rpx 24rpx;
	}


	.add-card-tip-box {
		padding: 26rpx 24rpx;
	}

	.add-card-tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.add-card {
		display: flex;
		align-items: center;
		color: #333;
	}

	.card-tip {
		color: #999;
	}

	.probability {
		color: #F2AB99;
	}

	.upload-card-box {
		padding-top: 26rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.upload-card {
		width: 164rpx;
		margin-right: 14rpx;
		position: relative;
		margin-bottom: 20rpx;
	}

	.upload-cardimg {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		border: 2rpx solid #F2AB99;
	}

	.upload-card image {
		width: 164rpx;
		height: 220rpx;
	}

	.upload-card:nth-child(4n) {
		margin-right: 0;
	}

	.add-img {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		border: 2rpx dotted #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-img>>>.u-upload {
		flex: unset;
	}

	.add-card-input {
		border-radius: 10rpx;
		color: #333;
		font-size: 28rpx;
		margin-top: 8rpx;
		padding-left: 12rpx;
		text-align: center;
	}

	.upload-card image.delete-img {
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		right: -8rpx;
		top: -16rpx;
	}

	.add-btn {
		margin: 40rpx 32rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.add-title {
		background-color: #F4F4F4;
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.picker-view {
		height: 300rpx;
	}

	.item {
		height: 70rpx;
		line-height: 70rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.select-btn-box {
		margin: 22rpx 24rpx;
	}

	.select-btn-box view {
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50rpx;
		font-size: 28rpx;
		margin-top: 26rpx;
	}

	.select-btn-box view.definition-btn {
		background-color: #fff;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	.cont>>>.u-popup__content__close--top-right {
		top: 24rpx;
		right: 24rpx;
	}

	.definition-box {
		margin: 60rpx 24rpx;
	}

	.definition-input input {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.definition-btn-box {
		display: flex;
		align-items: center;
	}

	.definition-btn-box view {
		width: 172rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #F2AB99;
		font-size: 28rpx;
		border: 2rpx solid #F2AB99;
	}

	.definition-btn-box view.confirm-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
	
	.card-require-box {
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1rpx solid #F4F4F4;
	}
	
	.card-require-box:last-child {
		border-bottom: 0;
	}
	
	.card-require {
		display: flex;
		align-items: center;
	}
	
	.rule-type {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-left: 14rpx;
		background-color: #EBEBEB;
		color: #999;
		border: 2rpx solid #999;
	}
	
	.rule-type.select-rule-type {
		background-color: #FCEEEB;
		color: #F2AB99;
		border-color: #F2AB99;
	}
</style>
